import Constants from 'expo-constants';
import { Product, Category, OrderStatus } from '../types';

const API_URL = Constants.expoConfig?.extra?.apiUrl as string;

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function getCatalog(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/catalog`);
  const data = await handleResponse(res);
  return data.map((item: any) => ({
    id: String(item.id),
    name: item.name,
    description: item.description || undefined,
    price: item.price,
    categoryId: item.category_id !== undefined && item.category_id !== null
      ? String(item.category_id)
      : '',
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
  seat?: string;
  items: { item_id: number | string; quantity: number }[];
  payment_method?: string;
}

export async function createOrder(
  payload: CreateOrderPayload,
  auth?: { email: string; password: string }
) {
  const headers: any = { 'Content-Type': 'application/json' };
  if (auth) {
    headers['Authorization'] = `Basic ${btoa(`${auth.email}:${auth.password}`)}`;
  }
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers,
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

function mapOrder(data: any) {
  return {
    id: String(data.id),
    items: Array.isArray(data.items)
      ? data.items.map((i: any) => ({
          productId: String(i.item_id),
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        }))
      : [],
    totalAmount: data.total,
    status: mapOrderStatus(data.status),
    seatNumber: data.seat,
    createdAt: data.created_at ? new Date(data.created_at) : undefined,
    updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    paymentMethod: data.payment_method,
  };
}

export async function getOrder(id: string) {
  const res = await fetch(`${API_URL}/orders/${id}`);
  const data = await handleResponse(res);
  return mapOrder(data);
}

export async function listOrders({ seat, status }: { seat: string; status?: string }) {
  const statusQuery = status ? `&status=${status}` : '';
  const res = await fetch(`${API_URL}/orders?seat=${seat}${statusQuery}`);
  const data = await handleResponse(res);
  return Array.isArray(data) ? data.map(mapOrder) : data;
}
