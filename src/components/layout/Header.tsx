import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export function Header() {
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
                <Link href="/">Home</Link>
                <Link href="/modules">Playbook</Link>
                <Link href="/about">About</Link>
            </nav>
        </header>
    );
}
