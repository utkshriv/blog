'use server';

import { getBackendToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

async function apiFetch(path: string, options: RequestInit) {
  const token = await getBackendToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}

// ── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPayload {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export async function createPost(payload: BlogPayload) {
  return apiFetch('/api/blog', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updatePost(slug: string, payload: Partial<Omit<BlogPayload, 'slug'>>) {
  return apiFetch(`/api/blog/${slug}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deletePost(slug: string) {
  return apiFetch(`/api/blog/${slug}`, { method: 'DELETE' });
}

// ── Playbook ──────────────────────────────────────────────────────────────────

export interface ProblemPayload {
  id: string;
  title: string;
  leetcodeUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'New' | 'Due' | 'Review';
  pseudocode: string;
  tags?: string[];
}

export interface ModulePayload {
  slug: string;
  title: string;
  description: string;
  content: string;
  order: number;
  problems: ProblemPayload[];
}

export async function createModule(payload: ModulePayload) {
  return apiFetch('/api/playbook', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateModule(
  slug: string,
  payload: {
    title?: string;
    description?: string;
    content?: string;
    order?: number;
    upsert_problems?: ProblemPayload[];
    delete_problem_ids?: string[];
  }
) {
  return apiFetch(`/api/playbook/${slug}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteModule(slug: string) {
  return apiFetch(`/api/playbook/${slug}`, { method: 'DELETE' });
}

// ── Upload URL ────────────────────────────────────────────────────────────────

export async function getUploadUrl(payload: {
  filename: string;
  content_type: string;
  entity_type: 'blog' | 'playbook';
  entity_slug: string;
  problem_id?: string;
}) {
  return apiFetch('/api/upload-url', { method: 'POST', body: JSON.stringify(payload) });
}
