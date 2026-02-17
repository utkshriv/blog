'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './BlogPostAnimation.module.css';

const TYPING_SPEED_MIN = 18;
const TYPING_SPEED_MAX = 36;
const HOLD_AFTER_DONE = 3500;

type LineType = 'h1' | 'h2' | 'body' | 'code' | 'list' | 'spacer';
interface Line { text: string; type: LineType }

const POSTS: { filename: string; lines: Line[] }[] = [
  {
    filename: 'ai-accelerates-dev.md',
    lines: [
      { text: '# AI is Reshaping How We Build', type: 'h1' },
      { text: '', type: 'spacer' },
      { text: 'The way we write software is changing fast. Tools like', type: 'body' },
      { text: 'Claude Code don\'t just autocomplete — they plan, reason,', type: 'body' },
      { text: 'and execute full tasks autonomously.', type: 'body' },
      { text: '', type: 'spacer' },
      { text: '## From hours to minutes', type: 'h2' },
      { text: '', type: 'spacer' },
      { text: 'Tasks that used to take a full day can now be done in', type: 'body' },
      { text: 'under an hour — boilerplate, tests, refactors, docs.', type: 'body' },
      { text: '', type: 'spacer' },
      { text: '## The developer\'s new role', type: 'h2' },
      { text: '', type: 'spacer' },
      { text: 'You become the architect. You define intent, review', type: 'body' },
      { text: 'output, and guide direction. AI handles the heavy lifting.', type: 'body' },
      { text: '', type: 'spacer' },
      { text: '## Where it matters most', type: 'h2' },
      { text: '', type: 'spacer' },
      { text: '→  Prototyping new ideas in minutes', type: 'list' },
      { text: '→  Debugging complex, unfamiliar codebases', type: 'list' },
      { text: '→  Writing thorough test coverage automatically', type: 'list' },
      { text: '→  Documenting systems that outlast their authors', type: 'list' },
      { text: '', type: 'spacer' },
      { text: 'The engineers who adopt AI tools early will have an', type: 'body' },
      { text: 'enormous leverage advantage. Start now.', type: 'body' },
    ],
  },
  {
    filename: 'dsa-still-matters.md',
    lines: [
      { text: '# Why DSA Still Matters in the AI Era', type: 'h1' },
      { text: '', type: 'spacer' },
      { text: 'AI can generate code. But understanding why an algorithm', type: 'body' },
      { text: 'is O(n log n) vs O(n²) — that judgment is still on you.', type: 'body' },
      { text: '', type: 'spacer' },
      { text: '## The foundation beneath everything', type: 'h2' },
      { text: '', type: 'spacer' },
      { text: 'Every system — databases, browsers, ML models — is built', type: 'body' },
      { text: 'on fundamental data structures. Trees, graphs, hash maps.', type: 'body' },
      { text: '', type: 'spacer' },
      { text: '## Real-world impact', type: 'h2' },
      { text: '', type: 'spacer' },
      { text: '→  Hash maps:  O(1) lookups powering your APIs', type: 'list' },
      { text: '→  Heaps:      priority queues in task schedulers', type: 'list' },
      { text: '→  Graphs:     shortest path in every maps app', type: 'list' },
      { text: '→  Trees:      every file system you\'ve ever used', type: 'list' },
      { text: '', type: 'spacer' },
      { text: '## What AI can\'t replace', type: 'h2' },
      { text: '', type: 'spacer' },
      { text: 'AI can write a BFS. It can\'t decide when BFS is better', type: 'body' },
      { text: 'than Dijkstra for your specific use case. That\'s yours.', type: 'body' },
      { text: '', type: 'spacer' },
      { text: 'Master the patterns.', type: 'body' },
      { text: 'The interviews — and the systems — will follow.', type: 'body' },
    ],
  },
];

function getColor(type: LineType): string {
  switch (type) {
    case 'h1':   return '#B8A8E6';
    case 'h2':   return '#9DD9FF';
    case 'code': return '#B8F3D8';
    case 'list': return '#FFD4B8';
    default:     return '#e8e8e8';
  }
}

function getFontWeight(type: LineType): number {
  return type === 'h1' || type === 'h2' ? 700 : 400;
}

function getFontSize(type: LineType): string {
  if (type === 'h1') return '1.05rem';
  if (type === 'h2') return '0.95rem';
  if (type === 'code') return '0.8rem';
  return '0.85rem';
}

export function BlogPostAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [postIdx, setPostIdx] = useState(0);
  const [completedLines, setCompletedLines] = useState<Line[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [fading, setFading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCompletedLines(POSTS[0].lines);
      return;
    }

    let lineIdx = 0;
    let charIdx = 0;
    let activePostIdx = 0;
    let cancelled = false;

    const schedule = (fn: () => void, delay: number) => {
      timerRef.current = setTimeout(() => { if (!cancelled) fn(); }, delay);
    };

    const tick = () => {
      const post = POSTS[activePostIdx];
      if (lineIdx >= post.lines.length) {
        // Post complete — hold, then fade and switch
        schedule(() => {
          setFading(true);
          schedule(() => {
            activePostIdx = (activePostIdx + 1) % POSTS.length;
            lineIdx = 0;
            charIdx = 0;
            setPostIdx(activePostIdx);
            setCompletedLines([]);
            setCurrentText('');
            setFading(false);
            schedule(tick, 300);
          }, 600);
        }, HOLD_AFTER_DONE);
        return;
      }

      const line = post.lines[lineIdx];

      if (line.type === 'spacer') {
        setCompletedLines(prev => [...prev, line]);
        lineIdx++;
        charIdx = 0;
        schedule(tick, 60);
        return;
      }

      if (charIdx < line.text.length) {
        setCurrentText(line.text.slice(0, charIdx + 1));
        charIdx++;
        const speed = Math.random() * (TYPING_SPEED_MAX - TYPING_SPEED_MIN) + TYPING_SPEED_MIN;
        schedule(tick, speed);
      } else {
        setCompletedLines(prev => [...prev, line]);
        setCurrentText('');
        lineIdx++;
        charIdx = 0;
        schedule(tick, 110);
      }
    };

    schedule(tick, 400);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [completedLines, currentText]);

  const currentLineType: LineType =
    completedLines.length < POSTS[postIdx].lines.length
      ? POSTS[postIdx].lines[completedLines.length]?.type ?? 'body'
      : 'body';

  return (
    <div className={styles.wrapper} aria-hidden="true">
      {/* Editor chrome */}
      <div className={styles.chrome}>
        <div className={styles.dot} style={{ background: '#FF5F56' }} />
        <div className={styles.dot} style={{ background: '#FFBD2E' }} />
        <div className={styles.dot} style={{ background: '#27C93F' }} />
        <span className={styles.filename}>{POSTS[postIdx].filename}</span>
      </div>

      {/* Post content */}
      <div
        ref={containerRef}
        className={`${styles.content} ${fading ? styles.fading : ''}`}
      >
        {completedLines.map((line, i) => (
          <div
            key={i}
            style={{
              minHeight: line.type === 'spacer' ? '0.5rem' : undefined,
              color: getColor(line.type),
              fontWeight: getFontWeight(line.type),
              fontSize: getFontSize(line.type),
              fontFamily: line.type === 'code' ? 'var(--font-mono)' : 'inherit',
              marginBottom: '1px',
              whiteSpace: 'pre',
            }}
          >
            {line.text}
          </div>
        ))}

        {currentText && (
          <div
            style={{
              color: getColor(currentLineType),
              fontWeight: getFontWeight(currentLineType),
              fontSize: getFontSize(currentLineType),
              fontFamily: currentLineType === 'code' ? 'var(--font-mono)' : 'inherit',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1px',
              whiteSpace: 'pre',
            }}
          >
            <span>{currentText}</span>
            <span className={styles.cursor} />
          </div>
        )}
      </div>
    </div>
  );
}
