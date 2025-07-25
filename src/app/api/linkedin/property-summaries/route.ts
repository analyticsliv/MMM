import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { access_token, account } = await req.json();

    if (!access_token || !account) {
        return NextResponse.json({ error: 'Missing access token or account id' }, { status: 400 })
    }

    try {
        const url = `https://api.linkedin.com/v2/adCampaignsV2?q=search&search.account.values[0]=urn:li:sponsoredAccount:${account}&projection=(elements*(id,name))`
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data }, { status: response.status });
        }

        if (!data.elements?.length) {
            return NextResponse.json({ error: 'No Property IDs found' }, { status: 400 });
        }

        return NextResponse.json({
            adPropertyData: data,
        });
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fecth properties' }, { status: 500 });
    }
}