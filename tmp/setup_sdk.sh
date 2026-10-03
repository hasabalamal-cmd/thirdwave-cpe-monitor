#!/bin/bash
set -e
export ANDROID_HOME=/opt/android-sdk
mkdir -p /opt/android-sdk/cmdline-tools

if [ ! -d "/opt/android-sdk/cmdline-tools/latest" ]; then
  echo "Downloading cmdline-tools..."
  curl -s -L -o /tmp/cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  unzip -q -o /tmp/cmdline-tools.zip -d /opt/android-sdk/cmdline-tools/
  mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/latest
  rm -f /tmp/cmdline-tools.zip
fi

export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

echo "Accepting licenses..."
yes | /opt/android-sdk/cmdline-tools/latest/bin/sdkmanager --licenses >/dev/null 2>&1 || true

echo "Installing platforms;android-34 and build-tools;34.0.0..."
yes | /opt/android-sdk/cmdline-tools/latest/bin/sdkmanager "platforms;android-34" "build-tools;34.0.0" "platform-tools" >/dev/null 2>&1

echo "Writing local.properties..."
echo "sdk.dir=/opt/android-sdk" > /app/applet/android/local.properties

echo "Building assembleDebug..."
cd /app/applet/android
./gradlew assembleDebug --no-daemon

echo "Copying APK to public web directory for direct in-browser download..."
mkdir -p /app/applet/public/downloads
cp -f /app/applet/android/app/build/outputs/apk/debug/app-debug.apk /app/applet/public/downloads/ThirdWave-CPE-Monitor.apk
echo "APK successfully built and copied to /public/downloads/ThirdWave-CPE-Monitor.apk!"
