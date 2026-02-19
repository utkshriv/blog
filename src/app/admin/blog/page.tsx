import { getContentService } from '@/services/factory';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DeletePostButton } from '@/components/admin/DeletePostButton';
import styles from './blog.module.css';

export default async function AdminBlogPage() {
  const svc = getContentService();
  const posts = await svc.getDailyLogs().catch(() => []);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className="text-gradient">Blog Posts</h1>
        <p className={styles.subtitle}>{posts.length} post{posts.length !== 1 ? 's' : ''} published</p>
      </div>

      <div className={styles.toolbar}>
        <Link href="/admin/blog/new">
          <Button variant="primary" size="sm">+ New Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card hoverEffect={false}>
          <p className={styles.empty}>No posts yet. Create your first one!</p>
        </Card>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <Card key={post.slug} hoverEffect={false} className={styles.item}>
              <div className={styles.itemBody}>
                <div className={styles.itemMeta}>
                  <span className={styles.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className={styles.title}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="default">#{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className={styles.itemActions}>
                <Link href={`/admin/blog/${post.slug}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <DeletePostButton slug={post.slug} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
