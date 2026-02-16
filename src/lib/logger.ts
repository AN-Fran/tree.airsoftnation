export type LogLevel = "info" | "error" | "warn"

export function log(level: LogLevel, event: string, data: Record<string, any> = {}) {
  console.log(JSON.stringify({
    level,
    event,
    ...data,
    timestamp: new Date().toISOString()
  }))
}
