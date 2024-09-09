
import { NextResponse } from 'next/server';
import { getTokens } from '@/lib/ga4Auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const tokens = await getTokens(code);
    return NextResponse.json(tokens);
  } catch (error) {
    console.error('Error getting tokens:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
