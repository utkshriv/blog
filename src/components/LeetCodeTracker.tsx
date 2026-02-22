import React from 'react'
import { LeetCodeStats } from '@/types'
import styles from './LeetCodeTracker.module.css'

interface Props {
    stats: LeetCodeStats | null;
}

export default function LeetCodeTracker({ stats }: Props) {
    const display = stats ?? { easy: 0, medium: 0, hard: 0, total: 0 }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                LeetCode Progress
            </h3>
            <div className={styles.stats}>
                <div className={styles.stat}>
                    <div className={styles.dotEasy}></div>
                    <div className={styles.valueEasy}>{display.easy}</div>
                    <div className={styles.label}>Easy</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.dotMedium}></div>
                    <div className={styles.valueMedium}>{display.medium}</div>
                    <div className={styles.label}>Medium</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.dotHard}></div>
                    <div className={styles.valueHard}>{display.hard}</div>
                    <div className={styles.label}>Hard</div>
                </div>
            </div>
            <div className={styles.total}>
                Total: {display.total} problems solved
            </div>
        </div>
    )
}
