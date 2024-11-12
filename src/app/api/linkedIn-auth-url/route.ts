import { NextRequest, NextResponse } from 'next/server';
import { generateAuthUrl } from '@/lib/linkedInAuth';

export async function GET(req: NextRequest) {
  try {
    const authUrl = generateAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.error(new Error('Failed to generate auth URL'));
  }
}
