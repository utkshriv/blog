'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/lib/admin-actions';
import { Button } from '@/components/ui/Button';
import styles from './DeleteButton.module.css';

export function DeletePostButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deletePost(slug);
      router.refresh();
    } catch (err) {
      console.error('[DeletePostButton] delete failed:', err);
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <span className={styles.confirm}>
      {error && (
        <span style={{ color: 'var(--error)', fontSize: '0.75rem' }} title={error}>
          Error — check console
        </span>
      )}
      {confirming ? (
        <>
          <Button variant="primary" size="sm" onClick={handleDelete} disabled={deleting}
            style={{ background: 'var(--error)', color: '#000' }}>
            {deleting ? '…' : 'Confirm'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setConfirming(false); setError(null); }}>
            Cancel
          </Button>
        </>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setConfirming(true)} className={styles.danger}>
          Delete
        </Button>
      )}
    </span>
  );
}
