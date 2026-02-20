'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost, BlogPayload, Media } from '@/lib/admin-actions';
import { Button } from '@/components/ui/Button';
import { MediaUploader } from './MediaUploader';
import styles from './Editor.module.css';

interface Props {
  initialData?: Partial<BlogPayload>;
  mode: 'create' | 'edit';
}

export function PostEditor({ initialData = {}, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<BlogPayload>({
    slug: initialData.slug ?? '',
    title: initialData.title ?? '',
    date: initialData.date ?? new Date().toISOString().slice(0, 10),
    excerpt: initialData.excerpt ?? '',
    tags: initialData.tags ?? [],
    content: initialData.content ?? '',
  });

  const [tagInput, setTagInput] = useState(form.tags.join(', '));
  const [media, setMedia] = useState<Media[]>(initialData.media ?? []);

  function set(field: keyof BlogPayload, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      tags: tagInput.split(',').map((t) => t.trim()).filter(Boolean),
      media,
    };
    try {
      if (mode === 'create') {
        await createPost(payload);
      } else {
        const { slug, ...rest } = payload;
        await updatePost(slug, rest);
      }
      router.push('/admin/blog');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.row}>
        <label className={styles.label}>
          Slug
          <input
            className={styles.input}
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            required
            readOnly={mode === 'edit'}
            placeholder="my-post-slug"
          />
        </label>
        <label className={styles.label}>
          Date
          <input
            className={styles.input}
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            required
          />
        </label>
      </div>

      <label className={styles.label}>
        Title
        <input
          className={styles.input}
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          required
          placeholder="Post title"
        />
      </label>

      <label className={styles.label}>
        Excerpt
        <input
          className={styles.input}
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          required
          placeholder="Short description shown on the blog listing"
        />
      </label>

      <label className={styles.label}>
        Tags (comma-separated)
        <input
          className={styles.input}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="typescript, aws, react"
        />
      </label>

      <label className={styles.label}>
        Content (MDX)
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
          required
          placeholder="# Your MDX content here"
          rows={22}
        />
      </label>

      <MediaUploader
        entityType="blog"
        entitySlug={form.slug}
        media={media}
        onChange={setMedia}
      />

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving…' : mode === 'create' ? 'Create Post' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
