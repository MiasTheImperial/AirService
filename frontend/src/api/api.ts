import { Product, Category } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function getCatalog(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/catalog`);
  const data = await handleResponse(res);
  return data.map((item: any) => ({
    id: String(item.id),
    name: item.name,
    description: item.description || undefined,
    price: item.price,
    categoryId: item.category ? String(item.category) : '',
    image: item.image || undefined,
    inStock: item.available,
  }));
}

function flattenCategories(nodes: any[]): any[] {
  return nodes.reduce((acc: any[], node: any) => {
    acc.push(node);
    if (node.children) {
      acc.push(...flattenCategories(node.children));
    }
    return acc;
  }, []);
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/catalog/categories`);
  const data = await handleResponse(res);
  const flat = flattenCategories(data);
  return flat.map((c: any) => ({
    id: String(c.id),
    name: c.name,
    description: c.description || undefined,
    image: c.image || undefined,
  }));
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
