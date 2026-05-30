import fs from 'fs'
import path from 'path'

const LOG_DIR  = path.join(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'app.log')
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

type Level = 'INFO' | 'WARN' | 'ERROR' | 'DB'

function ensureDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
}

function rotate() {
  try {
    const stat = fs.statSync(LOG_FILE)
    if (stat.size >= MAX_BYTES) {
      fs.renameSync(LOG_FILE, LOG_FILE.replace('.log', `.${Date.now()}.log`))
    }
  } catch {
    // فایل هنوز وجود ندارد — نیازی به rotate نیست
  }
}

function write(level: Level, message: string, meta?: unknown) {
  if (typeof window !== 'undefined') return // فقط سمت سرور
  try {
    ensureDir()
    rotate()
    const ts   = new Date().toISOString()
    const extra = meta !== undefined ? ' ' + JSON.stringify(meta, null, 0) : ''
    const line  = `[${ts}] [${level}] ${message}${extra}\n`
    fs.appendFileSync(LOG_FILE, line, 'utf8')
  } catch {
    // لاگر نباید کرش کند
  }
}

export const logger = {
  info:  (msg: string, meta?: unknown) => { console.info(`[INFO]  ${msg}`,  meta ?? ''); write('INFO',  msg, meta) },
  warn:  (msg: string, meta?: unknown) => { console.warn(`[WARN]  ${msg}`,  meta ?? ''); write('WARN',  msg, meta) },
  error: (msg: string, meta?: unknown) => { console.error(`[ERROR] ${msg}`, meta ?? ''); write('ERROR', msg, meta) },
  db:    (msg: string, meta?: unknown) => {                                               write('DB',    msg, meta) },
}
