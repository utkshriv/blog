export const dynamic = 'force-dynamic'

import { getContentService } from '@/services/factory';
import { ModuleEditor } from '@/components/admin/ModuleEditor';
import { notFound } from 'next/navigation';
import { ModulePayload, ProblemPayload } from '@/lib/admin-actions';
import styles from './edit.module.css';

export const metadata = { title: 'Edit Module — Admin' };

export default async function EditModulePage({ params }: { params: { slug: string } }) {
  const svc = getContentService();
  const mod = await svc.getModuleBySlug(params.slug).catch(() => null);

  if (!mod) notFound();

  // Map frontend Problem (link) → backend ProblemPayload (leetcodeUrl)
  const problems: ProblemPayload[] = mod.problems.map((p) => ({
    id: p.id,
    title: p.title,
    leetcodeUrl: p.link,
    difficulty: p.difficulty,
    status: p.status ?? 'New',
    pseudocode: p.pseudocode ?? '',
    tags: [],
  }));

  const initialData: Partial<ModulePayload> = {
    slug: mod.slug,
    title: mod.title,
    description: mod.description,
    content: mod.content,
    order: 1,
    problems,
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className="text-gradient">Edit Module</h1>
        <p className={styles.subtitle}>{mod.title}</p>
      </div>
      <ModuleEditor mode="edit" initialData={initialData} />
    </div>
  );
}
