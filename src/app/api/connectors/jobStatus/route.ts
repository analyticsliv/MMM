// pages/api/update-job-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ConnectorJob from '@/Models/JobDetail'; // Ensure the path is correct

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const { jobId, status } = await req.json();

        if (!jobId) {
            return NextResponse.json({ message: 'jobId is required' }, { status: 400 });
        }

        const updatedJob = await ConnectorJob.findOneAndUpdate(
            { jobId },
            {
                $set: {
                    status: status || 'Started',
                    updatedAt: Date.now(),
                }
            },
            {
                new: true,       // Return the updated document
                upsert: true     // Create a new document if no match is found
            }
        );

        return NextResponse.json({ message: 'Job status updated', updatedJob }, { status: 200 });
    } catch (error) {
        console.error('Error updating job status:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
