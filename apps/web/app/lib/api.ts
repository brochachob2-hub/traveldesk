export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error(`Backend API is offline or blocked at ${API_URL}`);
  }
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(payload?.message) ? payload.message[0] : payload?.message;
    throw new Error(message ?? 'Request failed');
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
