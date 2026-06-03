#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="${DIR}/.dev.pid"

if [ -f "${PID_FILE}" ]; then
  PID="$(cat "${PID_FILE}")"
  kill "$PID" 2>/dev/null && echo "✓ سرور (PID $PID) متوقف شد"
  rm -f "${PID_FILE}"
else
  echo "سرور در حال اجرا نیست"
fi

lsof -ti :3000 | xargs kill -9 2>/dev/null
echo "پورت 3000 آزاد شد"
