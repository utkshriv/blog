'use client'

import React from 'react'
import styles from './LeetCodeTracker.module.css'

export default function LeetCodeTracker() {
    // Hardcoded for now, can be replaced with API data later
    const stats = {
        easy: 12,
        medium: 5,
        hard: 1,
        total: 18
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                LeetCode Progress
            </h3>
            <div className={styles.stats}>
                <div className={styles.stat}>
                    <div className={styles.dotEasy}></div>
                    <div className={styles.valueEasy}>{stats.easy}</div>
                    <div className={styles.label}>Easy</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.dotMedium}></div>
                    <div className={styles.valueMedium}>{stats.medium}</div>
                    <div className={styles.label}>Medium</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.dotHard}></div>
                    <div className={styles.valueHard}>{stats.hard}</div>
                    <div className={styles.label}>Hard</div>
                </div>
            </div>
            <div className={styles.total}>
                Total: {stats.total} problems solved
            </div>
        </div>
    )
}
