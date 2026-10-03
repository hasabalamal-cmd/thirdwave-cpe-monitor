/**
 * Authentic Huawei CPE SCRAM / Challenge-Login Authentication Protocol.
 * Implements PBKDF2-HMAC-SHA256 client proof computation matching Huawei 5G CPE firmware.
 */

export interface AuthProgressCallback {
  (step: number, description: string): void;
}

export interface AuthResult {
  success: boolean;
  errorMessage?: string;
  sessionId?: string;
  token?: string;
}

/**
 * Calculates Huawei client proof using PBKDF2-HMAC-SHA256
 */
export async function computeHuaweiClientProof(
  password: string,
  firstNonce: string,
  saltHex: string,
  iterations: number,
  serverNonce: string
): Promise<string> {
  const enc = new TextEncoder();

  // Clean salt hex string
  const cleanSalt = saltHex.trim().replace(/^0x/i, '');
  const saltBytes = new Uint8Array(
    cleanSalt.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  // 1. Import raw password as key
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // 2. Derive 256 bits via PBKDF2-HMAC-SHA256
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

  // Convert to hex
  return Array.from(proof)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate 32-byte random hex nonce
 */
export function generateClientNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Parse simple XML tag value from response
 */
export function extractXmlTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Full Huawei CPE Login and Router Verification Flow
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
      errorMessage: isArabic
        ? 'يرجى إدخال عنوان IP صحيح للراوتر (مثل 192.168.8.1)'
        : 'Please enter a valid router IP address',
    };
  }

  if (!password && !isDemoMode) {
    return {
      success: false,
      errorMessage: isArabic
        ? 'يرجى إدخال كلمة مرور إدارة الراوتر'
        : 'Please enter router admin password',
    };
  }

  if (isDemoMode) {
    // Verified Simulation of Huawei challenge authentication
    onProgress?.(
      1,
      isArabic
        ? '1/5 جلب رمز الجلسة والتوثيق الأولي (SesTokInfo)...'
        : '1/5 Fetching initial session token (SesTokInfo)...'
    );
    await new Promise((r) => setTimeout(r, 350));

    onProgress?.(
      2,
      isArabic
        ? '2/5 إرسال تحدي المصادقة (POST /api/user/challenge_login)...'
        : '2/5 Sending authentication challenge...'
    );
    const firstNonce = generateClientNonce();
    await new Promise((r) => setTimeout(r, 400));

    onProgress?.(
      3,
      isArabic
        ? '3/5 حساب برهان العميل بالتشفير (PBKDF2-HMAC-SHA256)...'
        : '3/5 Computing client proof (PBKDF2-HMAC-SHA256)...'
    );
    const dummySalt = 'a9f1b2c3d4e5f60718293a4b5c6d7e8f';
    const clientProof = await computeHuaweiClientProof(
      password || 'admin',
      firstNonce,
      dummySalt,
      100,
      generateClientNonce()
    );
    await new Promise((r) => setTimeout(r, 450));

    onProgress?.(
      4,
      isArabic
        ? '4/5 إتمام تسجيل الدخول (POST /api/user/authentication_login)...'
        : '4/5 Finalizing authentication login...'
    );
    await new Promise((r) => setTimeout(r, 350));

    onProgress?.(
      5,
      isArabic
        ? '5/5 فحص حالة الاتصال بالبرج والمشغل (Mobily 42003)...'
        : '5/5 Validating tower telemetry and operator...'
    );
    await new Promise((r) => setTimeout(r, 300));

    return {
      success: true,
      sessionId: 'SessionID=d3m0_v3r1f13d',
      token: clientProof.slice(0, 32),
    };
  }

  // Real CPE Connection Mode:
  const baseUrls = [
    `/cpe-proxy`, // Vite / Node dev server proxy
    `http://${cleanHost}`, // Direct LAN
  ];

  let lastError = '';

  for (const base of baseUrls) {
    try {
      // Step 1: Request SesTokInfo
      onProgress?.(
        1,
        isArabic
          ? '1/4 جلب رمز التوثيق الأولي (GET /api/webserver/SesTokInfo)...'
          : '1/4 Fetching SesTokInfo...'
      );

      const sesRes = await fetch(`${base}/api/webserver/SesTokInfo`, {
        signal: AbortSignal.timeout(3000),
      });

      if (!sesRes.ok) {
        throw new Error(`HTTP ${sesRes.status}`);
      }

      const sesXml = await sesRes.text();
      const token = extractXmlTag(sesXml, 'TokInfo') || sesRes.headers.get('__RequestVerificationToken') || '';

      // Step 2: Challenge Login
      onProgress?.(
        2,
        isArabic
          ? '2/4 إرسال تحدي المصادقة (POST /api/user/challenge_login)...'
          : '2/4 Sending challenge_login...'
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
        signal: AbortSignal.timeout(3000),
      });

      const challengeXml = await challengeRes.text();
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
          : '3/4 Computing client proof...'
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
          : '4/4 Sending authentication_login...'
      );

      const authReqBody = `<?xml version="1.0" encoding="UTF-8"?><request><clientproof>${proof}</clientproof><finalnonce>${serverNonce}</finalnonce><loginflag>2</loginflag></request>`;
      const authRes = await fetch(`${base}/api/user/authentication_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          '__RequestVerificationToken': challengeRes.headers.get('__RequestVerificationToken') || token,
        },
        body: authReqBody,
        signal: AbortSignal.timeout(3000),
      });

      const authXml = await authRes.text();
      if (authXml.includes('error') || authXml.includes('<code>')) {
        const errCode = extractXmlTag(authXml, 'code') || '108001';
        return {
          success: false,
          errorMessage: isArabic
            ? `فشل تسجيل الدخول: كلمة المرور غير صحيحة أو تم قفل المحاولات (رمز الخطأ: ${errCode})`
            : `Authentication failed: Incorrect password or locked account (Code ${errCode})`,
        };
      }

      return {
        success: true,
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
      continue;
    }
  }

  return {
    success: false,
    errorMessage: isArabic
      ? `تعذر الوصول إلى عنوان الراوتر ${cleanHost}. يرجى التأكد من اتصالك بشبكة Wi-Fi الخاصة بالراوتر، أو تفعيل وضع المحاكاة (Demo).`
      : `Cannot reach router at ${cleanHost}. Ensure you are connected to the router Wi-Fi or switch to Demo mode.`,
  };
}
