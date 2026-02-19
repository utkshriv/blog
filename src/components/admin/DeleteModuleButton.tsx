'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteModule } from '@/lib/admin-actions';
import { Button } from '@/components/ui/Button';
import styles from './DeleteButton.module.css';

export function DeleteModuleButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteModule(slug);
      router.refresh();
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className={styles.confirm}>
        <Button variant="primary" size="sm" onClick={handleDelete} disabled={deleting}
          style={{ background: 'var(--error)', color: '#000' }}>
          {deleting ? '…' : 'Confirm'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
      </span>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirming(true)} className={styles.danger}>
      Delete
    </Button>
  );
}
