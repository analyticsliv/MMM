// lib/mongoose.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Only throw error in development or when actually trying to connect
if (!MONGODB_URI && process.env.NODE_ENV === 'development') {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

// For production builds, just warn but don't throw
if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.warn('MONGODB_URI not found during build. This is expected during build time.');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    // If no MONGODB_URI, return null (for build time)
    if (!MONGODB_URI) {
        console.log('Skipping database connection - MONGODB_URI not available');
        return null;
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        }).then((mongoose) => {
            return mongoose;
        }).catch((error) => {
            cached.promise = null;
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
}

export default connectToDatabase;