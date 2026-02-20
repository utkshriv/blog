export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getContentService } from '@/services/factory';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const svc = getContentService();

  const [posts, modules] = await Promise.all([
    svc.getDailyLogs().catch(() => []),
    svc.getModules().catch(() => []),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className="text-gradient">Dashboard</h1>
        <p className={styles.subtitle}>Signed in as {session?.user?.email}</p>
      </div>

      <div className={styles.statsGrid}>
        <Card hoverEffect={false}>
          <p className={styles.statNumber}>{posts.length}</p>
          <p className={styles.statLabel}>Blog Posts</p>
          <Link href="/admin/blog" className={styles.statLink}>Manage posts →</Link>
        </Card>
        <Card hoverEffect={false}>
          <p className={styles.statNumber}>{modules.length}</p>
          <p className={styles.statLabel}>Playbook Modules</p>
          <Link href="/admin/playbook" className={styles.statLink}>Manage modules →</Link>
        </Card>
      </div>

      <div className={styles.actions}>
        <Link href="/admin/blog/new">
          <Button variant="primary">+ New Post</Button>
        </Link>
        <Link href="/admin/playbook/new">
          <Button variant="outline">+ New Module</Button>
        </Link>
      </div>
    </div>
  );
}
