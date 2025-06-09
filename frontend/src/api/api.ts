import { Product, Category, OrderStatus } from '../types';

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

export function mapOrderStatus(status: string): OrderStatus {
  switch (status) {
    case 'new':
      return OrderStatus.PENDING;
    case 'forming':
      return OrderStatus.PREPARING;
    case 'done':
      return OrderStatus.COMPLETED;
    case 'cancelled':
      return OrderStatus.CANCELLED;
    default:
      return status as OrderStatus;
  }
}

export async function getOrder(id: string) {
  const res = await fetch(`${API_URL}/orders/${id}`);
  const data = await handleResponse(res);
  if (data && typeof data.status === 'string') {
    data.status = mapOrderStatus(data.status);
  }
  return data;
}

export async function listOrders({ seat, status }: { seat: string; status?: string }) {
  const statusQuery = status ? `&status=${status}` : '';
  const res = await fetch(`${API_URL}/orders?seat=${seat}${statusQuery}`);
  const data = await handleResponse(res);
  return Array.isArray(data)
    ? data.map((o) => ({ ...o, status: mapOrderStatus(o.status) }))
    : data;
}
