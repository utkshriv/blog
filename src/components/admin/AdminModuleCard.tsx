'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Module } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DeleteModuleButton } from './DeleteModuleButton';
import styles from './AdminModuleCard.module.css';

interface Props {
  mod: Module;
}

export function AdminModuleCard({ mod }: Props) {
  const [problemsOpen, setProblemsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card hoverEffect={false} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.body}>
          <h3 className={styles.title}>{mod.title}</h3>
          <p className={styles.description}>{mod.description}</p>
          <div className={styles.meta}>
            <button
              className={styles.problemToggle}
              onClick={() => setProblemsOpen((o) => !o)}
              type="button"
            >
              <span className={`${styles.chevron} ${problemsOpen ? styles.chevronOpen : ''}`}>›</span>
              {mod.problems.length} Problem{mod.problems.length !== 1 ? 's' : ''}
            </button>
            {mod.problems.some((p) => p.status === 'Due') && (
              <Badge variant="accent">Review Due</Badge>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <Link href={`/admin/playbook/${mod.slug}/edit`}>
            <Button variant="outline" size="sm">Edit</Button>
          </Link>
          <DeleteModuleButton slug={mod.slug} />
        </div>
      </div>

      {problemsOpen && (
        <div className={styles.problemList}>
          {mod.problems.length === 0 ? (
            <p className={styles.empty}>No problems yet.</p>
          ) : (
            mod.problems.map((prob) => {
              const isExpanded = expandedId === prob.id;
              return (
                <div
                  key={prob.id}
                  className={`${styles.problem} ${isExpanded ? styles.problemExpanded : ''}`}
                >
                  <div
                    className={styles.problemRow}
                    onClick={() => setExpandedId(isExpanded ? null : prob.id)}
                  >
                    <span className={styles.probId}>#{prob.id}</span>
                    <span className={styles.probTitle}>{prob.title}</span>
                    <span className={`${styles.diffBadge} ${styles[`diff${prob.difficulty}`]}`}>
                      {prob.difficulty}
                    </span>
                    <span className={`${styles.probStatus} ${prob.status === 'Due' ? styles.statusDue : ''}`}>
                      {prob.status ?? 'New'}
                    </span>
                    <span className={`${styles.expandChevron} ${isExpanded ? styles.expandChevronOpen : ''}`}>›</span>
                  </div>

                  {isExpanded && (
                    <div className={styles.problemDetails}>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>LeetCode</span>
                        <a
                          href={prob.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.detailLink}
                        >
                          {prob.link}
                        </a>
                      </div>
                      {prob.pseudocode && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Notes</span>
                          <pre className={styles.pseudocode}>{prob.pseudocode}</pre>
                        </div>
                      )}
                      <div className={styles.detailActions}>
                        <Link href={`/admin/playbook/${mod.slug}/edit`}>
                          <Button variant="outline" size="sm">Edit in Module</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
}
