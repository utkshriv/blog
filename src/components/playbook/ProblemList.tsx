import Link from 'next/link';
import { Problem } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import styles from './ProblemList.module.css';

interface ProblemListProps {
    problems: Problem[];
}

export function ProblemList({ problems }: ProblemListProps) {
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
                {problems.map((problem) => (
                    <div key={problem.id} className={styles.item}>
                        <div className={styles.info}>
                            <div className={styles.header}>
                                <span className={styles.id}>#{problem.id}</span>
                                <Link href={problem.link} target="_blank" className={styles.link}>
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
                            <Button size="sm" variant="outline">Log Attempt</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
