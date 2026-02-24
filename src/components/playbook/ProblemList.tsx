'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Problem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import styles from './ProblemList.module.css';

interface ProblemListProps {
    problems: Problem[];
}

export function ProblemList({ problems }: ProblemListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (problems.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No problems assigned to this module yet.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>Battle Ground</h3>
            <div className={styles.list}>
                {problems.map((problem) => {
                    const isExpanded = expandedId === problem.id;
                    const hasPseudocode = Boolean(problem.pseudocode);

                    return (
                        <div
                            key={problem.id}
                            className={`${styles.item} ${isExpanded ? styles.itemExpanded : ''}`}
                            onClick={() => hasPseudocode && setExpandedId(isExpanded ? null : problem.id)}
                            style={{ cursor: hasPseudocode ? 'pointer' : 'default' }}
                        >
                            <div className={styles.row}>
                                <div className={styles.info}>
                                    <div className={styles.header}>
                                        <span className={styles.id}>#{problem.id}</span>
                                        <Link
                                            href={problem.link}
                                            target="_blank"
                                            className={styles.link}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {problem.title}
                                        </Link>
                                        <Badge variant={
                                            problem.difficulty === 'Easy' ? 'accent' :
                                                problem.difficulty === 'Medium' ? 'secondary' : 'default'
                                        }>
                                            {problem.difficulty}
                                        </Badge>
                                    </div>
                                    <div className={styles.status}>
                                        {problem.status === 'Due' && <span className={styles.due}>Review Due</span>}
                                        {problem.nextReview && <span className={styles.date}>Next: {new Date(problem.nextReview).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    {hasPseudocode && (
                                        <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}>
                                            ›
                                        </span>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Log Attempt
                                    </Button>
                                </div>
                            </div>

                            {hasPseudocode && (
                                <div className={`${styles.pseudocode} ${isExpanded ? styles.pseudocodeOpen : ''}`}>
                                    <div>
                                        <span className={styles.pseudocodeLabel}>Pseudocode</span>
                                        <pre className={styles.pseudocodeContent}>{problem.pseudocode}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
