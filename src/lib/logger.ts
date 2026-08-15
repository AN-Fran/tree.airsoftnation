export type LogLevel = "info" | "warn" | "error";

type LogData = Record<string, unknown>;

const ALERT_EVENTS = new Set([
  "contact.failed",
  "contact.workshop_post_ticket_failed",
]);

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
    };
  }
  return { errorMessage: String(error) };
}

function buildEntry(level: LogLevel, event: string, data: LogData) {
  return {
    level,
    event,
    ...data,
    timestamp: new Date().toISOString(),
  };
}

async function sendFailureAlert(entry: LogData) {
  const webhookUrl = process.env.CONTACT_ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tree.airsoftnation.eu",
        ...entry,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(JSON.stringify(buildEntry("error", "contact.alert_delivery_failed", {
        status: response.status,
        originalEvent: entry.event,
        requestId: entry.requestId,
      })));
    }
  } catch (error) {
    console.error(JSON.stringify(buildEntry("error", "contact.alert_delivery_failed", {
      ...serializeError(error),
      originalEvent: entry.event,
      requestId: entry.requestId,
    })));
  } finally {
    clearTimeout(timeout);
  }
}

export function log(
  level: LogLevel,
  event: string,
  data: LogData = {}
) {
  const entry = buildEntry(level, event, data);
  const serialized = JSON.stringify(entry);

  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.log(serialized);

  if (level === "error" && ALERT_EVENTS.has(event)) {
    void sendFailureAlert(entry);
  }
}

export function logError(
  event: string,
  error: unknown,
  data: LogData = {}
) {
  log("error", event, { ...data, ...serializeError(error) });
}
