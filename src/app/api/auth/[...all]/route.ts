import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const headersList = await headers();
  const modifiedRequest = new Request(request.url, {
    method: request.method,
    headers: new Headers(headersList),
    body: request.body,
    // @ts-ignore
    duplex: 'half',
  });
  return auth.handler(modifiedRequest);
}

export async function GET(request: Request) {
  const headersList = await headers();
  const modifiedRequest = new Request(request.url, {
    method: request.method,
    headers: new Headers(headersList),
  });
  return auth.handler(modifiedRequest);
}
