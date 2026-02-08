'use client'

import React from 'react'

export default function LeetCodeTracker() {
    // Hardcoded for now, can be replaced with API data later
    const stats = {
        easy: 12,
        medium: 5,
        hard: 1,
        total: 18
    }

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                LeetCode Grind
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'space-around' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#00b8a3', fontWeight: 'bold', fontSize: '1.5rem' }}>{stats.easy}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Easy</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#ffc01e', fontWeight: 'bold', fontSize: '1.5rem' }}>{stats.medium}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Medium</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#ff375f', fontWeight: 'bold', fontSize: '1.5rem' }}>{stats.hard}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Hard</div>
                </div>
            </div>
            <div style={{ marginTop: '1rem', background: '#222', borderRadius: '4px', height: '6px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ flex: stats.easy, background: '#00b8a3' }}></div>
                <div style={{ flex: stats.medium, background: '#ffc01e' }}></div>
                <div style={{ flex: stats.hard, background: '#ff375f' }}></div>
            </div>
        </div>
    )
}
