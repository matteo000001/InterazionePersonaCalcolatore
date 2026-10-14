import {
  User,
} from '@exam-planner/shared-types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333/api';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  token?: string;
  method?: HttpMethod;
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Errore inatteso' }));
    const message = Array.isArray(error.message)
      ? error.message.join(', ')
      : error.message;

    throw new Error(message ?? 'Errore inatteso');
  }

  return response.json() as Promise<T>;
}

export const api = {
  getMe: (token: string) => request<User>('/users/me', { token })
};
