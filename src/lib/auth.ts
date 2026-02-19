import { NextAuthOptions, getServerSession } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SignJWT } from 'jose';

const devProviders =
  process.env.NODE_ENV === 'development'
    ? [
        CredentialsProvider({
          name: 'Dev Login',
          credentials: { email: { label: 'Email', type: 'email' } },
          async authorize(credentials) {
            if (credentials?.email === process.env.ADMIN_EMAIL) {
              return { id: '1', email: credentials!.email, name: 'Dev Admin' };
            }
            return null;
          },
        }),
      ]
    : [];

export const authOptions: NextAuthOptions = {
  providers: [
    ...devProviders,
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? 'placeholder',
      clientSecret: process.env.GITHUB_SECRET ?? 'placeholder',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'placeholder',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user.email === process.env.ADMIN_EMAIL;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Creates a short-lived HS256 JWT compatible with the Python backend's
 * verify_admin_token() — payload: { email, exp }.
 */
export async function getBackendToken(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
  return new SignJWT({ email: session.user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
}
