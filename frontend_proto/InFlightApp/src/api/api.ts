const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function getCatalog() {
  const res = await fetch(`${API_URL}/catalog`);
  return handleResponse(res);
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/catalog/categories`);
  return handleResponse(res);
}

export interface CreateOrderPayload {
  seat: string;
  items: { item_id: number | string; quantity: number }[];
  payment_method?: string;
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getOrder(id: string) {
  const res = await fetch(`${API_URL}/orders/${id}`);
  return handleResponse(res);
}

export async function listOrders() {
  const res = await fetch(`${API_URL}/admin/orders`);
  return handleResponse(res);
}
