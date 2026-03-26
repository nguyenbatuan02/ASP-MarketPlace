const ODOO_URL = '';  
const DB = import.meta.env.VITE_ODOO_DB;

let requestId = 0;

export interface OdooResponse<T = unknown> {
  result?: T;
  error?: {
    code: number;
    message: string;
    data: { message: string };
  };
}

async function rpc<T = unknown>(
  endpoint: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(`${ODOO_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: ++requestId,
      params,   
    }),
  });

  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const data: OdooResponse<T> = await res.json();
  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message);
  }
  return data.result as T;
}

export async function callKw<T = unknown>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {}
): Promise<T> {
  return rpc<T>('/web/dataset/call_kw', {
    model,
    method,
    args,
    kwargs: {
      ...kwargs,
      context: { lang: 'vi_VN' },  
    },
  });
}

export { rpc, DB };