// pages/api/update-job-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ConnectorJob from '@/Models/JobDetail'; // Ensure the path is correct
import User from '@/Models/User';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const contentType = req.headers.get('content-type') || '';

        // Handle file upload (multipart/form-data)
        if (contentType.includes('multipart/form-data')) {
            return await handleFileUploadWithStatus(req);
        }
        else {
            return await handleJsonStatusUpdate(req);
        }
    } catch (error) {
        console.error('Error in update job status API:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

async function handleJsonStatusUpdate(req: NextRequest) {
    try {
        const { email, connectorType, jobId, status } = await req.json();

        if (!jobId || !email || !connectorType) {
            return NextResponse.json({ message: 'jobId, email, and connectorType are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updatedJob = await ConnectorJob.findOneAndUpdate(
            { jobId },
            {
                $set: {
                    status: status || 'inProgress',
                    updatedAt: Date.now(),
                },
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

        return NextResponse.json({ message: 'Job status updated', updatedJob }, { status: 200 });
    } catch (error) {
        console.error('Error updating job status:', error);
        return NextResponse.json({ message: 'Error updating job status' }, { status: 500 });
    }
}

async function handleFileUploadWithStatus(req: NextRequest) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const connectorType = formData.get('connectorType') as string;
        const jobId = formData.get('jobId') as string;
        const status = formData.get('status') as string;
        const file = formData.get('file') as File;

        if (!jobId || !email || !connectorType) {
            return NextResponse.json({ message: 'jobId, email, and connectorType are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Prepare the update object
        const updateFields: any = {
            status: status || 'inProgress',
            updatedAt: Date.now(),
        };

        // Handle file if provided
        if (file && file.size > 0) {
            // Validate file type (allow .html files)
            const allowedTypes = ['text/html', 'application/octet-stream'];
            const isHtmlFile = file.name.toLowerCase().endsWith('.html');

            if (!allowedTypes.includes(file.type) && !isHtmlFile) {
                return NextResponse.json({
                    message: 'Only HTML files are allowed'
                }, { status: 400 });
            }

            // Read file content
            const fileContent = await file.text();

            // Add file fields to update
            updateFields.fileName = file.name;
            updateFields.fileContent = fileContent;
            updateFields.fileType = file.type || 'text/html';
            updateFields.fileSize = file.size;
        }

        const updatedJob = await ConnectorJob.findOneAndUpdate(
            { jobId }, // Search for an existing job by jobId
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

        console.log('API hit: jobId:', jobId, 'status:', status, 'file:', file ? file.name : 'none');

        const responseMessage = file ? 'Job status updated with file' : 'Job status updated';

        return NextResponse.json({
            message: responseMessage,
            updatedJob
        }, { status: 200 });
    } catch (error : any) {
        console.error('Error handling file upload with status update:', error);
        return NextResponse.json({ message: `Error processing request ${error.message}` }, { status: 500 });
    }
}
