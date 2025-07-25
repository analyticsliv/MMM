import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { access_token } = await req.json();

  if (!access_token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
  }

  try {
    // Step 1: Fetch ad account user data
    const url = `https://api.linkedin.com/v2/adAccountsV2?q=search`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    if (!data?.elements?.length) {
      return NextResponse.json({ error: 'No ad account IDs found' }, { status: 400 });
    }

    return NextResponse.json({
      adAccountData: data,
    });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch ad account or names' }, { status: 500 });
  }
}
