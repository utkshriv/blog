'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createModule, updateModule, ModulePayload, ProblemPayload } from '@/lib/admin-actions';
import { Button } from '@/components/ui/Button';
import styles from './Editor.module.css';

interface Props {
  initialData?: Partial<ModulePayload>;
  mode: 'create' | 'edit';
}

const EMPTY_PROBLEM: ProblemPayload = {
  id: '',
  title: '',
  leetcodeUrl: '',
  difficulty: 'Medium',
  status: 'New',
  pseudocode: '',
  tags: [],
};

export function ModuleEditor({ initialData = {}, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    slug: initialData.slug ?? '',
    title: initialData.title ?? '',
    description: initialData.description ?? '',
    content: initialData.content ?? '',
    order: initialData.order ?? 1,
  });

  const [problems, setProblems] = useState<ProblemPayload[]>(
    initialData.problems ?? []
  );

  function setField(field: keyof typeof form, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addProblem() {
    setProblems((p) => [...p, { ...EMPTY_PROBLEM }]);
  }

  function removeProblem(idx: number) {
    setProblems((p) => p.filter((_, i) => i !== idx));
  }

  function setProblemField(
    idx: number,
    field: keyof ProblemPayload,
    value: string | string[]
  ) {
    setProblems((p) =>
      p.map((prob, i) => (i === idx ? { ...prob, [field]: value } : prob))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (mode === 'create') {
        await createModule({ ...form, problems });
      } else {
        await updateModule(form.slug, {
          title: form.title,
          description: form.description,
          content: form.content,
          order: form.order,
          upsert_problems: problems,
        });
      }
      router.push('/admin/playbook');
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
            onChange={(e) => setField('slug', e.target.value)}
            required
            readOnly={mode === 'edit'}
            placeholder="two-pointers"
          />
        </label>
        <label className={styles.label}>
          Order
          <input
            className={styles.input}
            type="number"
            min={1}
            value={form.order}
            onChange={(e) => setField('order', Number(e.target.value))}
            required
          />
        </label>
      </div>

      <label className={styles.label}>
        Title
        <input
          className={styles.input}
          value={form.title}
          onChange={(e) => setField('title', e.target.value)}
          required
          placeholder="Two Pointers"
        />
      </label>

      <label className={styles.label}>
        Description
        <input
          className={styles.input}
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          required
          placeholder="Short module description"
        />
      </label>

      <label className={styles.label}>
        Content (MDX)
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          value={form.content}
          onChange={(e) => setField('content', e.target.value)}
          required
          placeholder="# Module content in MDX"
          rows={14}
        />
      </label>

      {/* ── Problems ───────────────────────────────────────── */}
      <p className={styles.sectionHeading}>Problems</p>

      {problems.map((prob, idx) => (
        <div key={idx} className={styles.problemCard}>
          <div className={styles.row}>
            <label className={styles.label}>
              ID
              <input
                className={styles.input}
                value={prob.id}
                onChange={(e) => setProblemField(idx, 'id', e.target.value)}
                required
                placeholder="two-sum-ii"
              />
            </label>
            <label className={styles.label}>
              Title
              <input
                className={styles.input}
                value={prob.title}
                onChange={(e) => setProblemField(idx, 'title', e.target.value)}
                required
                placeholder="Two Sum II"
              />
            </label>
          </div>

          <label className={styles.label}>
            LeetCode URL
            <input
              className={styles.input}
              value={prob.leetcodeUrl}
              onChange={(e) => setProblemField(idx, 'leetcodeUrl', e.target.value)}
              required
              placeholder="https://leetcode.com/problems/..."
            />
          </label>

          <div className={styles.row}>
            <label className={styles.label}>
              Difficulty
              <select
                className={styles.select}
                value={prob.difficulty}
                onChange={(e) =>
                  setProblemField(idx, 'difficulty', e.target.value as ProblemPayload['difficulty'])
                }
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </label>
            <label className={styles.label}>
              Status
              <select
                className={styles.select}
                value={prob.status}
                onChange={(e) =>
                  setProblemField(idx, 'status', e.target.value as ProblemPayload['status'])
                }
              >
                <option>New</option>
                <option>Due</option>
                <option>Review</option>
              </select>
            </label>
          </div>

          <label className={styles.label}>
            Tags (comma-separated)
            <input
              className={styles.input}
              value={(prob.tags ?? []).join(', ')}
              onChange={(e) =>
                setProblemField(
                  idx,
                  'tags',
                  e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                )
              }
              placeholder="two-pointers, binary-search"
            />
          </label>

          <label className={styles.label}>
            Pseudocode / Notes
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={prob.pseudocode}
              onChange={(e) => setProblemField(idx, 'pseudocode', e.target.value)}
              rows={4}
              placeholder="Approach notes..."
            />
          </label>

          <div className={styles.problemActions}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeProblem(idx)}
              style={{ color: 'var(--error)' }}
            >
              Remove Problem
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addProblem}>
        + Add Problem
      </Button>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving…' : mode === 'create' ? 'Create Module' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
