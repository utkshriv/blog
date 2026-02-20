'use client';

import { useState, useRef } from 'react';
import { getUploadUrl, Media } from '@/lib/admin-actions';
import { Button } from '@/components/ui/Button';
import styles from './MediaUploader.module.css';

interface Props {
  entityType: 'blog' | 'playbook';
  entitySlug: string;
  problemId?: string;
  media: Media[];
  onChange: (media: Media[]) => void;
}

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET || 'botthef-content-bucket';
const S3_REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'us-west-2';

export function MediaUploader({ entityType, entitySlug, problemId, media, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [slugError, setSlugError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function buildS3Url(s3Key: string): string {
    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${s3Key}`;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const newMedia: Media[] = [];

      for (const file of Array.from(files)) {
        // Get pre-signed upload URL
        const { url, s3Key, key } = await getUploadUrl({
          filename: file.name,
          content_type: file.type,
          entity_type: entityType,
          entity_slug: entitySlug,
          problem_id: problemId,
        });

        // Upload to S3
        const uploadRes = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        if (!uploadRes.ok) {
          throw new Error(`Upload failed for ${file.name}: ${uploadRes.statusText}`);
        }

        newMedia.push({ key, s3Key, type: 'image' });
      }

      onChange([...media, ...newMedia]);
    } catch (err) {
      console.error('[MediaUploader]', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeMedia(index: number) {
    onChange(media.filter((_, i) => i !== index));
  }

  function copyToClipboard(s3Key: string) {
    const url = buildS3Url(s3Key);
    navigator.clipboard.writeText(`![](${url})`);
  }

  function handleUploadClick() {
    if (!entitySlug) {
      setSlugError(true);
      setTimeout(() => setSlugError(false), 600);
      return;
    }
    setSlugError(false);
    fileInputRef.current?.click();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>Media</label>
        <div className={styles.uploadSection}>
          {slugError && <p className={styles.slugError}>⚠️ Enter a slug first</p>}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={uploading}
            className={slugError ? styles.shake : ''}
          >
            {uploading ? 'Uploading…' : '📎 Upload Images'}
          </Button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {media.length > 0 && (
        <ul className={styles.list}>
          {media.map((item, idx) => (
            <li key={idx} className={styles.item}>
              <span className={styles.filename}>{item.key}</span>
              <div className={styles.actions}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.s3Key)}
                  title="Copy MDX snippet"
                >
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedia(idx)}
                  style={{ color: 'var(--error)' }}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {media.length === 0 && (
        <p className={styles.empty}>No media uploaded yet.</p>
      )}
    </div>
  );
}
