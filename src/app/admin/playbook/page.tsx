export const dynamic = 'force-dynamic'

import { getContentService } from '@/services/factory';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DeleteModuleButton } from '@/components/admin/DeleteModuleButton';
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
            <Card key={mod.slug} hoverEffect={false} className={styles.item}>
              <div className={styles.itemBody}>
                <h3 className={styles.title}>{mod.title}</h3>
                <p className={styles.description}>{mod.description}</p>
                <div className={styles.meta}>
                  <Badge variant="secondary">{mod.problems.length} Problem{mod.problems.length !== 1 ? 's' : ''}</Badge>
                  {mod.problems.some((p) => p.status === 'Due') && (
                    <Badge variant="accent">Review Due</Badge>
                  )}
                </div>
              </div>
              <div className={styles.itemActions}>
                <Link href={`/admin/playbook/${mod.slug}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <DeleteModuleButton slug={mod.slug} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
