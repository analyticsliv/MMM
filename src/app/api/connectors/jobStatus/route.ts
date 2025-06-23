// pages/api/update-job-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ConnectorJob from '@/Models/JobDetail'; // Ensure the path is correct
import User from '@/Models/User';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        return await handleJsonStatusUpdate(req);
    } catch (error) {
        console.error('Error in update job status API:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

async function handleJsonStatusUpdate(req: NextRequest) {
    try {
        const { email, connectorType, jobId, fileContent, status } = await req.json();

        if (!jobId || !email || !connectorType) {
            return NextResponse.json({ message: 'jobId, email, and connectorType are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Prepare update fields
        const updateFields: any = {
            status: status || 'inProgress',
            updatedAt: Date.now(),
        };

        if (fileContent) {
            updateFields.fileContent = fileContent;
            console.log('Added file content to update fields');
        }

        const updatedJob = await ConnectorJob.findOneAndUpdate(
            { jobId },
            {
                $set: updateFields,
                $setOnInsert: {
                    jobId,
                    userId: user._id,
                    connectorType,
                    createdAt: Date.now(),
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        console.log('API hit: jobId:', jobId, 'status:', status);
        const responseMessage = fileContent ? 'Job status updated with HTML content' : 'Job status updated';

        return NextResponse.json({
            message: responseMessage,
            updatedJob,
            fileContentReceived: !!fileContent
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating job status:', error);
        return NextResponse.json({ message: 'Error updating job status' }, { status: 500 });
    }
}
