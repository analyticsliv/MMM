// pages/api/test-connection.js
import connectToDatabase from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req:NextRequest, res:NextResponse) {
    try {
        await connectToDatabase();
        return NextResponse.json({ message: 'Connected to the database successfully' });
    } catch (error) {
        console.error('Database connection failed:', error);
        return  NextResponse.json({ message: 'Failed to connect to the database' });
    }
}
