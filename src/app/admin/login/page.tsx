import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Admin Login — botthef' };

export default function LoginPage() {
  const isDev = process.env.NODE_ENV === 'development';
  return (
    <Suspense>
      <LoginForm isDev={isDev} />
    </Suspense>
  );
}
