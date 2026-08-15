export type LogLevel = "info" | "warn" | "error";

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
    };
  }
  return { errorMessage: String(error) };
}

export function log(
  level: LogLevel,
  event: string,
  data: Record<string, unknown> = {}
) {
  const entry = JSON.stringify({
    level,
    event,
    ...data,
    timestamp: new Date().toISOString(),
  });

  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.log(entry);
}

export function logError(
  event: string,
  error: unknown,
  data: Record<string, unknown> = {}
) {
  log("error", event, { ...data, ...serializeError(error) });
}
