'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './login.module.css';

interface Props {
  isDev: boolean;
}

export function LoginForm({ isDev }: Props) {
  const params = useSearchParams();
  const error = params.get('error');
  const [email, setEmail] = useState('');

  return (
    <div className={styles.page}>
      <Card hoverEffect={false} className={styles.card}>
        <h1 className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Admin Login
        </h1>
        <p className={styles.subtitle}>Restricted to authorised users only</p>

        {error && (
          <p className={styles.error}>
            {error === 'AccessDenied'
              ? 'Access denied — your email is not whitelisted.'
              : 'Authentication failed. Please try again.'}
          </p>
        )}

        {isDev ? (
          <form
            className={styles.devForm}
            onSubmit={(e) => {
              e.preventDefault();
              signIn('credentials', { email, callbackUrl: '/admin' });
            }}
          >
            <p className={styles.devBadge}>Dev mode — no OAuth needed</p>
            <input
              className={styles.devInput}
              type="email"
              placeholder="Enter your ADMIN_EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
              Sign in
            </Button>
          </form>
        ) : (
          <div className={styles.buttons}>
            <Button
              variant="outline"
              onClick={() => signIn('github', { callbackUrl: '/admin' })}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Sign in with GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => signIn('google', { callbackUrl: '/admin' })}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Sign in with Google
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
