'use server';

import { revalidatePath } from 'next/cache';
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
  const result = await apiFetch('/api/blog', { method: 'POST', body: JSON.stringify(payload) });
  revalidatePath('/blog');
  return result;
}

export async function updatePost(slug: string, payload: Partial<Omit<BlogPayload, 'slug'>>) {
  const result = await apiFetch(`/api/blog/${slug}`, { method: 'PUT', body: JSON.stringify(payload) });
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  return result;
}

export async function deletePost(slug: string) {
  const result = await apiFetch(`/api/blog/${slug}`, { method: 'DELETE' });
  revalidatePath('/blog');
  return result;
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
  const result = await apiFetch('/api/playbook', { method: 'POST', body: JSON.stringify(payload) });
  revalidatePath('/playbook');
  return result;
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
  const result = await apiFetch(`/api/playbook/${slug}`, { method: 'PUT', body: JSON.stringify(payload) });
  revalidatePath('/playbook');
  revalidatePath(`/playbook/${slug}`);
  return result;
}

export async function deleteModule(slug: string) {
  const result = await apiFetch(`/api/playbook/${slug}`, { method: 'DELETE' });
  revalidatePath('/playbook');
  return result;
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
