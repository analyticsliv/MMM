// src/pages/api/facebook-auth-url.js

import { generateFacebookAuthUrl } from '@/lib/facebookAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const authUrl = generateFacebookAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.error(new Error('Failed to generate auth URL for facebook'));
  }
}