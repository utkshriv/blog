'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './Header.module.css';

export function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const adminHref = session ? '/admin' : '/admin/login';

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logoLink}>
                <Image
                    src="/logo.png"
                    alt="botthef"
                    width={140}
                    height={76}
                    priority
                />
            </Link>
            <nav className={styles.nav}>
                <Link
                    href="/"
                    className={pathname === '/' ? styles.active : ''}
                >
                    Home
                </Link>
                <Link
                    href="/blog"
                    className={pathname.startsWith('/blog') ? styles.active : ''}
                >
                    Blog
                </Link>
                <Link
                    href="/playbook"
                    className={pathname.startsWith('/playbook') ? styles.active : ''}
                >
                    Playbook
                </Link>
                <Link
                    href={adminHref}
                    className={pathname.startsWith('/admin') ? styles.adminActive : ''}
                >
                    Admin
                </Link>
            </nav>
        </header>
    );
}
