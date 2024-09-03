import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/Models/User';

export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse the JSON body
        const { name, email, password, mobile } = body;

        if (!email || !password || !mobile) {
            return NextResponse.json({ message: 'Missing email, password, or mobile number' }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await hash(password, 12);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobile,
        });

        await newUser.save();

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error to debug it
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
