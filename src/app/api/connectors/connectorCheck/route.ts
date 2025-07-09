import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/Models/User';
import Connector from '@/Models/Connector';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const connectorName = searchParams.get('connectorName');

    if (!email || !connectorName) {
        return NextResponse.json({ message: 'Email and connectorName are required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Find the user by email (without populate)
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Manually fetch connectors using the IDs from user.connectors
        const connectors = await Connector.find({ 
            _id: { $in: user.connectors } 
        });

        // Same logic as before - find the connector with the specific connectorName
        const connector = connectors.find((connector: any) => connector[connectorName]);

        if (!connector) {
            return NextResponse.json({ message: 'Connector not found for the given name' }, { status: 404 });
        }

        return NextResponse.json({ data: connector[connectorName] }, { status: 200 });
    } catch (error) {
        console.error('Error fetching connector data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}