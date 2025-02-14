// pages/api/update-job-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ConnectorJob from '@/Models/JobDetail'; // Ensure the path is correct
import User from '@/Models/User';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const { email, connectorType, jobId, status } = await req.json();

        if (!jobId || !email || !connectorType) {
            return NextResponse.json({ message: 'jobId, email, and connectorType are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updatedJob = await ConnectorJob.findOneAndUpdate(
            { jobId }, // Search for an existing job by jobId
            {
                $set: {
                    status: status || 'inProgress',
                    updatedAt: Date.now(),
                },
                $setOnInsert: { // This ONLY applies if a new document is created
                    jobId,
                    userId: user._id,
                    connectorType,
                    createdAt: Date.now(),
                }
            },
            {
                new: true,  // Return the updated document
                upsert: true // Create a new document if no match is found
            }
        );
        console.log('API hit: jobId:', jobId, 'status:', status);

        return NextResponse.json({ message: 'Job status updated', updatedJob }, { status: 200 });
    } catch (error) {
        console.error('Error updating job status:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
