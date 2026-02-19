'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import styles from './AdminNav.module.css';

const links = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/blog', label: 'Blog', exact: false },
  { href: '/admin/playbook', label: 'Playbook', exact: false },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <div className={styles.bar}>
      <nav className={styles.tabs}>
        {links.map(({ href, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.tab} ${isActive(href, exact) ? styles.active : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {status === 'loading' ? null : session ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign out
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signIn()}
        >
          Sign in
        </Button>
      )}
    </div>
  );
}
