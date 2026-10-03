/**
 * Authentic Huawei CPE SCRAM / Challenge-Login Authentication Protocol.
 * Implements PBKDF2-HMAC-SHA256 client proof computation matching Huawei 4G/5G CPE firmware.
 * Local Network only - Zero external telemetry.
 */

export type HuaweiAuthStatus =
  | 'router_reachable'
  | 'authenticating'
  | 'authenticated'
  | 'authentication_failed'
  | 'session_expired'
  | 'unsupported_endpoint'
  | 'network_error';

export interface AuthProgressCallback {
  (step: number, description: string, status: HuaweiAuthStatus): void;
}

export interface AuthResult {
  success: boolean;
  status: HuaweiAuthStatus;
  errorMessage?: string;
  sessionId?: string;
  token?: string;
}

/**
 * Known Huawei CPE Error Codes
 */
export const HUAWEI_ERROR_CODES: Record<string, { ar: string; en: string; status: HuaweiAuthStatus }> = {
  '108001': {
    ar: 'كلمة المرور أو اسم المستخدم غير صحيح (رمز 108001)',
    en: 'Invalid username or password (Code 108001)',
    status: 'authentication_failed',
  },
  '108002': {
    ar: 'تم تجاوز الحد الأقصى للمحاولات وتم قفل الحساب مؤقتاً (رمز 108002)',
    en: 'Maximum login attempts exceeded. Account temporarily locked (Code 108002)',
    status: 'authentication_failed',
  },
  '108003': {
    ar: 'مستخدم آخر مسجل دخوله بالفعل على الراوتر (رمز 108003)',
    en: 'Another admin user is already logged in (Code 108003)',
    status: 'authentication_failed',
  },
  '100005': {
    ar: 'انتهت صلاحية جلسة الراوتر الحالية، يرجى إعادة تسجيل الدخول (رمز 100005)',
    en: 'Session expired. Please log in again (Code 100005)',
    status: 'session_expired',
  },
  '100002': {
    ar: 'هذا المنفذ أو الأمر غير مدعوم في هذا الطراز (رمز 100002)',
    en: 'Unsupported endpoint on this router firmware (Code 100002)',
    status: 'unsupported_endpoint',
  },
  '100003': {
    ar: 'أمر غير مصرح به أو تم رفض الوصول (رمز 100003)',
    en: 'Unauthorized or unsupported request (Code 100003)',
    status: 'unsupported_endpoint',
  },
  '125001': {
    ar: 'فشل التحدي الأولي للتشفير مع الراوتر (رمز 125001)',
    en: 'Initial challenge verification failed (Code 125001)',
    status: 'authentication_failed',
  },
  '125002': {
    ar: 'رمز التحقق منتهي الصلاحية، يرجى المحاولة مجدداً (رمز 125002)',
    en: 'Verification token expired (Code 125002)',
    status: 'session_expired',
  },
  '125003': {
    ar: 'خطأ في تسلسل التوثيق، تم تجديد التوكن (رمز 125003)',
    en: 'Token sequence mismatch (Code 125003)',
    status: 'authentication_failed',
  },
};

/**
 * Calculates Huawei client proof using PBKDF2-HMAC-SHA256
 * Conforms strictly to Huawei CPE challenge authentication spec.
 */
export async function computeHuaweiClientProof(
  password: string,
  firstNonce: string,
  saltHex: string,
  iterations: number,
  serverNonce: string
): Promise<string> {
  const enc = new TextEncoder();

  // Clean and parse salt hex string
  const cleanSalt = saltHex.trim().replace(/^0x/i, '');
  const saltBytes = new Uint8Array(
    cleanSalt.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  // 1. Import raw password as key for PBKDF2
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // 2. Derive 256 bits (32 bytes) via PBKDF2-HMAC-SHA256
  const saltedPasswordBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: iterations,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );
  const saltedPassword = new Uint8Array(saltedPasswordBuffer);

  // 3. Client Key = HMAC-SHA256(salted_password, "Client Key")
  const hmacKey1 = await crypto.subtle.importKey(
    'raw',
    saltedPassword,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const clientKeyBuffer = await crypto.subtle.sign(
    'HMAC',
    hmacKey1,
    enc.encode('Client Key')
  );
  const clientKey = new Uint8Array(clientKeyBuffer);

  // 4. Stored Key = SHA-256(client_key)
  const storedKeyBuffer = await crypto.subtle.digest('SHA-256', clientKey);
  const storedKey = new Uint8Array(storedKeyBuffer);

  // 5. Signature = HMAC-SHA256(stored_key, f"{first_nonce},{server_nonce},{server_nonce}")
  const authMsg = `${firstNonce},${serverNonce},${serverNonce}`;
  const hmacKey2 = await crypto.subtle.importKey(
    'raw',
    storedKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    hmacKey2,
    enc.encode(authMsg)
  );
  const signature = new Uint8Array(signatureBuffer);

  // 6. Client Proof = XOR(clientKey, signature)
  const proof = new Uint8Array(clientKey.length);
  for (let i = 0; i < clientKey.length; i++) {
    proof[i] = clientKey[i] ^ signature[i];
  }

  // Convert to hex string without logging secrets
  return Array.from(proof)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate 32-byte cryptographically secure random hex nonce
 */
export function generateClientNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Parse XML tag value from response text
 */
export function extractXmlTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Evaluates whether Huawei response XML indicates success or a specific error code
 */
export function parseHuaweiResponse(xml: string): { ok: boolean; code?: string; message?: string } {
  if (xml.includes('<error>') || xml.includes('<code>')) {
    const code = extractXmlTag(xml, 'code') || '108001';
    const message = extractXmlTag(xml, 'message') || '';
    return { ok: false, code, message };
  }

  const responseTag = extractXmlTag(xml, 'response');
  if (responseTag === 'OK' || responseTag === '1' || xml.includes('<response>OK</response>')) {
    return { ok: true };
  }

  if (xml.includes('<salt>') && xml.includes('<servernonce>')) {
    return { ok: true };
  }

  if (xml.includes('<SesInfo>') || xml.includes('<TokInfo>')) {
    return { ok: true };
  }

  // If response contains neither OK nor known valid payload
  return { ok: false, code: '100001', message: 'Unknown response' };
}

/**
 * Full Huawei CPE Login and Router Verification Flow
 * Supports Android Native LAN (Cleartext HTTP) and Demo simulation.
 */
export async function verifyHuaweiRouterLogin(
  host: string,
  username: string,
  password: string,
  isDemoMode: boolean,
  isArabic: boolean,
  onProgress?: AuthProgressCallback
): Promise<AuthResult> {
  const cleanHost = host.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');

  if (!cleanHost) {
    return {
      success: false,
      status: 'network_error',
      errorMessage: isArabic
        ? 'يرجى إدخال عنوان IP صحيح للراوتر (مثل 192.168.8.1)'
        : 'Please enter a valid router IP address',
    };
  }

  if (!password && !isDemoMode) {
    return {
      success: false,
      status: 'authentication_failed',
      errorMessage: isArabic
        ? 'يرجى إدخال كلمة مرور إدارة الراوتر'
        : 'Please enter router admin password',
    };
  }

  if (isDemoMode) {
    // 1. Router Reachable
    onProgress?.(
      1,
      isArabic
        ? '1/5 التحقق من وصول الراوتر المحلي (Router Reachable)...'
        : '1/5 Checking local router reachability...',
      'router_reachable'
    );
    await new Promise((r) => setTimeout(r, 250));

    // 2. Fetching SesTokInfo
    onProgress?.(
      2,
      isArabic
        ? '2/5 جلب رمز الجلسة والتوثيق الأولي (SesTokInfo)...'
        : '2/5 Fetching initial session token (SesTokInfo)...',
      'authenticating'
    );
    await new Promise((r) => setTimeout(r, 300));

    // 3. Challenge Login
    onProgress?.(
      3,
      isArabic
        ? '3/5 إرسال تحدي المصادقة (POST challenge_login)...'
        : '3/5 Sending authentication challenge...',
      'authenticating'
    );
    const firstNonce = generateClientNonce();
    await new Promise((r) => setTimeout(r, 350));

    // 4. Compute Client Proof
    onProgress?.(
      4,
      isArabic
        ? '4/5 حساب برهان العميل بالتشفير (PBKDF2-HMAC-SHA256)...'
        : '4/5 Computing client proof (PBKDF2-HMAC-SHA256)...',
      'authenticating'
    );
    const dummySalt = 'a9f1b2c3d4e5f60718293a4b5c6d7e8f';
    const clientProof = await computeHuaweiClientProof(
      password || 'admin',
      firstNonce,
      dummySalt,
      100,
      generateClientNonce()
    );
    await new Promise((r) => setTimeout(r, 400));

    // 5. Finalizing Authentication
    onProgress?.(
      5,
      isArabic
        ? '5/5 إتمام المصادقة بنجاح واستخراج بيانات الشبكة...'
        : '5/5 Authenticated successfully. Fetching telemetry...',
      'authenticated'
    );
    await new Promise((r) => setTimeout(r, 300));

    return {
      success: true,
      status: 'authenticated',
      sessionId: 'SessionID=d3m0_v3r1f13d',
      token: clientProof.slice(0, 32),
    };
  }

  // Real CPE Connection Mode:
  // On Android native app with usesCleartextTraffic="true", http://${cleanHost} goes directly to router LAN!
  // In dev browser, /cpe-proxy is used as fallback.
  const baseUrls = [
    `http://${cleanHost}`,
    `/cpe-proxy`,
  ];

  for (const base of baseUrls) {
    try {
      // Step 1: Check Router Reachability & Request SesTokInfo
      onProgress?.(
        1,
        isArabic
          ? '1/4 جلب رمز التوثيق الأولي (GET /api/webserver/SesTokInfo)...'
          : '1/4 Connecting & requesting SesTokInfo...',
        'router_reachable'
      );

      const sesRes = await fetch(`${base}/api/webserver/SesTokInfo`, {
        signal: AbortSignal.timeout(3500),
      });

      // Crucial: HTTP 200 alone does not mean success!
      const sesXml = await sesRes.text();
      const sesCheck = parseHuaweiResponse(sesXml);

      if (!sesCheck.ok && sesCheck.code) {
        const errInfo = HUAWEI_ERROR_CODES[sesCheck.code];
        return {
          success: false,
          status: errInfo?.status || 'network_error',
          errorMessage: errInfo ? (isArabic ? errInfo.ar : errInfo.en) : `Router error code ${sesCheck.code}`,
        };
      }

      const token = extractXmlTag(sesXml, 'TokInfo') || sesRes.headers.get('__RequestVerificationToken') || '';

      // Step 2: Challenge Login
      onProgress?.(
        2,
        isArabic
          ? '2/4 إرسال تحدي المصادقة (POST /api/user/challenge_login)...'
          : '2/4 Sending challenge_login...',
        'authenticating'
      );

      const firstNonce = generateClientNonce();
      const challengeReqBody = `<?xml version="1.0" encoding="UTF-8"?><request><username>${username}</username><firstnonce>${firstNonce}</firstnonce><mode>1</mode><loginflag>2</loginflag></request>`;

      const challengeRes = await fetch(`${base}/api/user/challenge_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          '__RequestVerificationToken': token,
        },
        body: challengeReqBody,
        signal: AbortSignal.timeout(3500),
      });

      const challengeXml = await challengeRes.text();
      const challengeCheck = parseHuaweiResponse(challengeXml);

      if (!challengeCheck.ok && challengeCheck.code) {
        const errInfo = HUAWEI_ERROR_CODES[challengeCheck.code];
        return {
          success: false,
          status: errInfo?.status || 'authentication_failed',
          errorMessage: errInfo ? (isArabic ? errInfo.ar : errInfo.en) : `Challenge error ${challengeCheck.code}`,
        };
      }

      const salt = extractXmlTag(challengeXml, 'salt');
      const iterations = parseInt(extractXmlTag(challengeXml, 'iterations') || '100', 10);
      const serverNonce = extractXmlTag(challengeXml, 'servernonce');

      if (!salt || !serverNonce) {
        throw new Error('لم يقم الراوتر بإرجاع بيانات التحدي salt / servernonce');
      }

      // Step 3: Compute Client Proof
      onProgress?.(
        3,
        isArabic
          ? '3/4 حساب برهان العميل بالتشفير (PBKDF2-HMAC-SHA256)...'
          : '3/4 Computing client proof (PBKDF2)...',
        'authenticating'
      );

      const proof = await computeHuaweiClientProof(
        password,
        firstNonce,
        salt,
        iterations,
        serverNonce
      );

      // Step 4: Authentication Login
      onProgress?.(
        4,
        isArabic
          ? '4/4 التحقق من كلمة المرور (POST /api/user/authentication_login)...'
          : '4/4 Sending authentication_login...',
        'authenticating'
      );

      const authReqBody = `<?xml version="1.0" encoding="UTF-8"?><request><clientproof>${proof}</clientproof><finalnonce>${serverNonce}</finalnonce><loginflag>2</loginflag></request>`;
      const authRes = await fetch(`${base}/api/user/authentication_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          '__RequestVerificationToken': challengeRes.headers.get('__RequestVerificationToken') || token,
        },
        body: authReqBody,
        signal: AbortSignal.timeout(3500),
      });

      const authXml = await authRes.text();
      const authCheck = parseHuaweiResponse(authXml);

      // Crucial: HTTP 200 with <error> or <code> is checked here!
      if (!authCheck.ok) {
        const code = authCheck.code || '108001';
        const errInfo = HUAWEI_ERROR_CODES[code];
        return {
          success: false,
          status: errInfo?.status || 'authentication_failed',
          errorMessage: errInfo
            ? (isArabic ? errInfo.ar : errInfo.en)
            : (isArabic ? `فشل تسجيل الدخول (رمز الخطأ ${code})` : `Login failed (Code ${code})`),
        };
      }

      // Success
      return {
        success: true,
        status: 'authenticated',
      };
    } catch (err: unknown) {
      // Try next base URL
      continue;
    }
  }

  return {
    success: false,
    status: 'network_error',
    errorMessage: isArabic
      ? `تعذر الوصول إلى عنوان الراوتر ${cleanHost}. تأكد أن هاتفك متصل بشبكة Wi-Fi الخاصة بالراوتر، أو استخدم وضع المحاكاة (Demo).`
      : `Cannot reach router at ${cleanHost}. Ensure you are connected to the router Wi-Fi or use Demo mode.`,
  };
}
