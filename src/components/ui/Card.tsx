import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverEffect?: boolean;
}

export function Card({ children, className = '', hoverEffect = true, ...props }: CardProps) {
    return (
        <div
            className={`${styles.card} ${hoverEffect ? styles.hover : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
