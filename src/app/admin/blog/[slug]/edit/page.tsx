import { getContentService } from '@/services/factory';
import { PostEditor } from '@/components/admin/PostEditor';
import { notFound } from 'next/navigation';
import styles from './edit.module.css';

export const metadata = { title: 'Edit Post — Admin' };

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  const svc = getContentService();
  const post = await svc.getPostBySlug(params.slug).catch(() => null);

  if (!post) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className="text-gradient">Edit Post</h1>
        <p className={styles.subtitle}>{post.title}</p>
      </div>
      <PostEditor mode="edit" initialData={post} />
    </div>
  );
}
