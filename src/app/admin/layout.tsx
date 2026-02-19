import { AdminNav } from '@/components/admin/AdminNav';
import styles from './layout.module.css';

export const metadata = { title: 'Admin — botthef' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <AdminNav />
        {children}
      </div>
    </section>
  );
}
