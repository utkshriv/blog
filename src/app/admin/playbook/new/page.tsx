import { ModuleEditor } from '@/components/admin/ModuleEditor';
import styles from './new.module.css';

export const metadata = { title: 'New Module — Admin' };

export default function NewModulePage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className="text-gradient">New Module</h1>
        <p className={styles.subtitle}>Create a new playbook module and add problems</p>
      </div>
      <ModuleEditor mode="create" />
    </div>
  );
}
