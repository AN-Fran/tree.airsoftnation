export type LogLevel = "info" | "warn" | "error"

export function log(
  level: LogLevel,
  event: string,
  data: Record<string, any> = {}
) {
  console.log(
    JSON.stringify({
      level,
      event,
      ...data,
      timestamp: new Date().toISOString()
    })
  )
}

