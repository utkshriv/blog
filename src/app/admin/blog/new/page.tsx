import { PostEditor } from '@/components/admin/PostEditor';
import styles from './new.module.css';

export const metadata = { title: 'New Post — Admin' };

export default function NewPostPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className="text-gradient">New Post</h1>
        <p className={styles.subtitle}>Write and publish a new blog post</p>
      </div>
      <PostEditor mode="create" />
    </div>
  );
}
