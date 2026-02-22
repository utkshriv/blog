import { SignJWT } from 'jose';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

if (!NEXTAUTH_SECRET || !ADMIN_EMAIL) {
  console.error('Missing NEXTAUTH_SECRET or ADMIN_EMAIL');
  process.exit(1);
}

const secret = new TextEncoder().encode(NEXTAUTH_SECRET);

new SignJWT({ email: ADMIN_EMAIL })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('30d')
  .sign(secret)
  .then(token => {
    console.log('JWT token (valid 30 days):\n');
    console.log(token);
    console.log('\nAdd to MCP server .env:');
    console.log(`ADMIN_JWT_TOKEN=${token}`);
  })
  .catch(err => {
    console.error('Error generating token:', err);
    process.exit(1);
  });
