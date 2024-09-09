import { NextRequest, NextResponse } from 'next/server';
import { handleFirstFeatureVisit } from '@/lib/userService';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    try {
        const { email } = await req.json(); // Parse JSON body
        await handleFirstFeatureVisit(email);
        return NextResponse.json({ message: 'Feature visit handled successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error handling feature visit:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
