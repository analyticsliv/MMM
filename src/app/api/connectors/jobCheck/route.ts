// pages/api/get-job-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';  // Adjust the import path if necessary
import ConnectorJob from '@/Models/JobDetail'; // Adjust the import path if necessary

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json({ message: 'jobId is required' }, { status: 400 });
        }

        const job = await ConnectorJob.findOne({ jobId });

        if (!job) {
            return NextResponse.json({ message: 'Job not found' }, { status: 200 });
        }

        return NextResponse.json({ job }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving job status:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
