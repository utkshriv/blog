export const dynamic = 'force-dynamic'

import { getContentService } from '@/services/factory';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminModuleCard } from '@/components/admin/AdminModuleCard';
import styles from './playbook.module.css';

export default async function AdminPlaybookPage() {
  const svc = getContentService();
  const modules = await svc.getModules().catch(() => []);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className="text-gradient">Playbook Modules</h1>
        <p className={styles.subtitle}>{modules.length} module{modules.length !== 1 ? 's' : ''}</p>
      </div>

      <div className={styles.toolbar}>
        <Link href="/admin/playbook/new">
          <Button variant="primary" size="sm">+ New Module</Button>
        </Link>
      </div>

      {modules.length === 0 ? (
        <Card hoverEffect={false}>
          <p className={styles.empty}>No modules yet. Create your first one!</p>
        </Card>
      ) : (
        <div className={styles.list}>
          {modules.map((mod) => (
            <AdminModuleCard key={mod.slug} mod={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
