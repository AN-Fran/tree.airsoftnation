type JsonRpcResponse<T> = {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: {
      message?: string;
      [key: string]: unknown;
    };
  };
};

const ODOO_URL = process.env.ODOO_URL?.replace(/\/$/, "");
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;

function assertConfig() {
  if (!ODOO_URL || !ODOO_DB || !ODOO_USERNAME || !ODOO_PASSWORD) {
    throw new Error(
      "Odoo is not configured. Required: ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD"
    );
  }
}

async function jsonRpc<T>(service: string, method: string, args: unknown[]) {
  assertConfig();

  const response = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        service,
        method,
        args,
      },
      id: Date.now(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Odoo HTTP error: ${response.status}`);
  }

  const payload = (await response.json()) as JsonRpcResponse<T>;

  if (payload.error) {
    throw new Error(
      `Odoo RPC error: ${payload.error.data?.message || payload.error.message}`
    );
  }

  return payload.result as T;
}

let cachedUid: number | null = null;

export async function authenticateOdoo() {
  if (cachedUid) return cachedUid;

  const uid = await jsonRpc<number | false>("common", "authenticate", [
    ODOO_DB,
    ODOO_USERNAME,
    ODOO_PASSWORD,
    {},
  ]);

  if (!uid) {
    throw new Error("Odoo authentication failed");
  }

  cachedUid = uid;
  return uid;
}

export async function executeOdoo<T>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {}
) {
  const uid = await authenticateOdoo();

  return jsonRpc<T>("object", "execute_kw", [
    ODOO_DB,
    uid,
    ODOO_PASSWORD,
    model,
    method,
    args,
    kwargs,
  ]);
}

export async function createOdooRecord(
  model: string,
  values: Record<string, unknown>
) {
  return executeOdoo<number>(model, "create", [values]);
}

export type OdooFieldDefinition = {
  type?: string;
  relation?: string;
  required?: boolean;
  readonly?: boolean;
};

export async function fieldsGetOdoo(
  model: string,
  fields: string[],
  attributes: Array<keyof OdooFieldDefinition> = [
    "type",
    "relation",
    "required",
    "readonly",
  ]
) {
  return executeOdoo<Record<string, OdooFieldDefinition>>(
    model,
    "fields_get",
    [fields],
    { attributes }
  );
}

export async function searchReadOdoo<T>(
  model: string,
  domain: unknown[] = [],
  fields: string[] = [],
  limit = 100
) {
  return executeOdoo<T[]>(model, "search_read", [domain], {
    fields,
    limit,
  });
}
