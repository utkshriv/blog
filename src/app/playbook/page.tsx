import Link from 'next/link';
import { getContentService } from '@/services/factory';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import LeetCodeTracker from '@/components/LeetCodeTracker';
import { TerminalBackground } from '@/components/ui/TerminalBackground';
import styles from './page.module.css';

export const metadata = {
    title: 'Playbook // botthef',
    description: 'Structured learning modules for cracking the code interview.',
};

export default async function ModulesPage() {
    const service = getContentService();
    const modules = await service.getModules();

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Left Pane - Playbook content */}
                <div className={styles.leftPane}>
                    <div className={styles.header}>
                        <h1 className="text-gradient">The Playbook</h1>
                        <p>Master the patterns. Defeat the algorithm.</p>
                    </div>

                    <div className={styles.grid}>
                        {modules.map((module) => (
                            <Link key={module.slug} href={`/playbook/${module.slug}`} style={{ display: 'contents' }}>
                                <Card className={styles.moduleCard} hoverEffect>
                                    <div className={styles.moduleContent}>
                                        <h3 className={styles.title}>{module.title}</h3>
                                        <p className={styles.description}>{module.description}</p>

                                        <div className={styles.meta}>
                                            <Badge variant="secondary">{module.problems.length} Problems</Badge>
                                            {module.problems.some(p => p.status === 'Due') && (
                                                <Badge variant="accent" className={styles.dueBadge}>Review Due</Badge>
                                            )}
                                        </div>

                                        <div className={styles.action}>
                                            <Button variant="outline" size="sm">Start Module</Button>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Pane - Tracker + Terminal */}
                <div className={styles.rightPane}>
                    <div className={styles.trackerSection}>
                        <LeetCodeTracker />
                    </div>
                    <div className={styles.terminalSection}>
                        <TerminalBackground />
                    </div>
                </div>
            </div>
        </section>
    );
}
