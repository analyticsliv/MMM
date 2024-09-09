import { NextRequest, NextResponse } from 'next/server';
import { updateOrCreateConnector } from '@/lib/userService';

export async function POST(req: NextRequest) {
    try {
        const { email, connectorName, data } = await req.json(); // Parse the email and connector data from the request body

        const result = await updateOrCreateConnector(email, connectorName, data);
        return NextResponse.json({ message: 'Connector handled successfully', result }, { status: 200 });
    } catch (error) {
        console.error("Error handling connector:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
