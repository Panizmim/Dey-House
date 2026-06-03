#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="${DIR}/.dev.pid"
LOG_FILE="${DIR}/logs/dev.log"

mkdir -p "${DIR}/logs"

# اگر قبلاً در حال اجرا بود، متوقفش کن
if [ -f "${PID_FILE}" ]; then
  OLD_PID="$(cat "${PID_FILE}")"
  kill "$OLD_PID" 2>/dev/null && echo "سرور قبلی (PID $OLD_PID) متوقف شد"
  rm -f "${PID_FILE}"
fi

# پورت 3000 را آزاد کن
lsof -ti :3000 | xargs kill -9 2>/dev/null
sleep 1

# سرور را در بکگراند اجرا کن
cd "${DIR}"
nohup npx next dev --port 3000 > "${LOG_FILE}" 2>&1 &
echo "$!" > "${PID_FILE}"

echo "✓ سرور در حال راه‌اندازی... (PID: $!)"
echo "  آدرس: http://localhost:3000"
echo "  لاگ:  ${LOG_FILE}"
echo "  برای متوقف کردن: bash stop-dev.sh"

sleep 7
curl -s -o /dev/null -w "وضعیت سرور: %{http_code}\n" http://localhost:3000
