import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/Models/User';
import JobDetail from '@/Models/JobDetail';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const jobs = await JobDetail.find({ userId: user._id });

        return NextResponse.json(jobs, { status: 200 });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
