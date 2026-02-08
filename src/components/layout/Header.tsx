import Link from 'next/link';
import styles from './Header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>
                botthef <span className={styles.tagline}>// redemption</span>
            </h1>
            <nav className={styles.nav}>
                <Link href="/">Home</Link>
                <Link href="/modules">Playbook</Link>
                <Link href="/about">About</Link>
            </nav>
        </header>
    );
}
