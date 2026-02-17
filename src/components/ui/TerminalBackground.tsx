'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './TerminalBackground.module.css';

// Timing configuration (in milliseconds)
const TYPING_SPEED_MIN = 40;
const TYPING_SPEED_MAX = 80;
const PAUSE_AFTER_COMMAND = 600;
const PAUSE_AFTER_OUTPUT = 1200;
const PAUSE_BEFORE_RESTART = 2000;

// Terminal command sequence
const COMMANDS = [
  {
    prompt: 'utkarsh@macbook ~ %',
    command: 'cat bfs.py',
    output: 'from collections import deque\n\ndef bfs(graph, start):\n    visited = set()\n    queue = deque([start])\n    visited.add(start)\n    result = []\n\n    while queue:\n        node = queue.popleft()\n        result.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n\n    return result',
  },
  {
    prompt: 'utkarsh@macbook ~ %',
    command: 'python3 bfs.py',
    output: 'graph = {0: [1, 2], 1: [3], 2: [3], 3: []}\nBFS from node 0: [0, 1, 2, 3]\nTime complexity:  O(V + E)\nSpace complexity: O(V)',
  },
];

export function TerminalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const cursorRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Show static final state
      const staticLines: string[] = [];
      COMMANDS.forEach((cmd) => {
        staticLines.push(`${cmd.prompt} ${cmd.command}`);
        staticLines.push(cmd.output);
      });
      staticLines.push('utkarsh@macbook ~ % ');
      setLines(staticLines);
      setCurrentLine('');
      return;
    }

    // Cursor blink effect
    cursorRef.current = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    // Animation logic
    let commandIndex = 0;
    let charIndex = 0;
    let phase: 'typing-command' | 'showing-output' | 'pausing' = 'typing-command';
    let pauseTimeout: NodeJS.Timeout | null = null;

    const animate = () => {
      if (commandIndex >= COMMANDS.length) {
        // All commands done - pause before restart
        pauseTimeout = setTimeout(() => {
          setLines([]);
          setCurrentLine('');
          commandIndex = 0;
          charIndex = 0;
          phase = 'typing-command';
          animationRef.current = setInterval(animate, getRandomTypingSpeed());
        }, PAUSE_BEFORE_RESTART);
        if (animationRef.current) clearInterval(animationRef.current);
        return;
      }

      const currentCmd = COMMANDS[commandIndex];

      if (phase === 'typing-command') {
        const fullCommand = `${currentCmd.prompt} ${currentCmd.command}`;

        if (charIndex < fullCommand.length) {
          setCurrentLine(fullCommand.slice(0, charIndex + 1));
          charIndex++;
        } else {
          // Command fully typed - pause then show output
          phase = 'showing-output';
          pauseTimeout = setTimeout(() => {
            setLines((prev) => [...prev, fullCommand, currentCmd.output]);
            setCurrentLine('');
            phase = 'pausing';

            // Pause after output before next command
            pauseTimeout = setTimeout(() => {
              commandIndex++;
              charIndex = 0;
              phase = 'typing-command';
            }, PAUSE_AFTER_OUTPUT);
          }, PAUSE_AFTER_COMMAND);

          if (animationRef.current) clearInterval(animationRef.current);
          return;
        }
      }

      // Adjust typing speed for natural feel
      if (animationRef.current) clearInterval(animationRef.current);
      animationRef.current = setInterval(animate, getRandomTypingSpeed());
    };

    const getRandomTypingSpeed = () => {
      return Math.random() * (TYPING_SPEED_MAX - TYPING_SPEED_MIN) + TYPING_SPEED_MIN;
    };

    // Start animation
    animationRef.current = setInterval(animate, getRandomTypingSpeed());

    // Cleanup
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
      if (cursorRef.current) clearInterval(cursorRef.current);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, currentLine]);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      {/* macOS Window Chrome */}
      <div
        style={{
          background: 'transparent',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid rgba(184, 168, 230, 0.2)',
        }}
      >
        {/* macOS Window Buttons */}
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#FF5F56',
          }}
        />
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#FFBD2E',
          }}
        />
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#27C93F',
          }}
        />
        {/* Window Title */}
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: '13px',
            color: '#d3d3d3',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 400,
          }}
        >
          utkarsh@macbook — zsh
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={containerRef}
        style={{
          background: 'transparent',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: '#f0f0f0',
          padding: '16px',
          flex: 1,
          overflow: 'auto',
          lineHeight: '1.6',
        }}
      >
        <div>
          {lines.map((line, index) => (
            <div
              key={index}
              style={{
                marginBottom: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: line.includes('%') ? '#B8A8E6' : '#e8e8e8',
                fontWeight: line.includes('%') ? 500 : 400,
              }}
            >
              {line}
            </div>
          ))}
          {currentLine && (
            <div
              style={{
                marginBottom: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: '#B8A8E6',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>{currentLine}</span>
              {showCursor && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '18px',
                    background: '#ffffff',
                    marginLeft: '2px',
                  }}
                />
              )}
            </div>
          )}
          {!currentLine && lines.length > 0 && (
            <div
              style={{
                color: '#B8A8E6',
                fontWeight: 500,
              }}
            >
              <span>utkarsh@macbook ~ % </span>
              {showCursor && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '18px',
                    background: '#ffffff',
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 968px) {
          div[aria-hidden="true"] > div:last-of-type {
            font-size: 11px;
            padding: 12px;
            height: 300px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
