// // Make sure this is a server-side route
// export async function GET() {
//   // Force server-side execution
//   console.log('Running on server side, NODE_ENV:', process.env.NODE_ENV);
  
//   return Response.json({
//     NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'undefined',
//     NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
//     NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
//     MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
    
//     // Debug info
//     nodeEnv: process.env.NODE_ENV,
//     runtime: process.env.NEXT_RUNTIME,
//     // Check if we're actually in server context
//     isServer: typeof window === 'undefined'
//   });
// }




import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Only allow in development or with a debug header
    const isDev = process.env.NODE_ENV === 'development';
    const debugHeader = request.headers.get('x-debug-env');
    
    if (!isDev && debugHeader !== 'allow') {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    const envVars = {
        NODE_ENV: process.env.NODE_ENV,
        
        // Public vars (safe to show)
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
        NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
        
        // Server vars (show only if set/not set)
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
        MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
        
        // Redirect URIs
        BASE_API_URL: process.env.BASE_API_URL || 'NOT_SET',
        NEXT_PUBLIC_GA4_REDIRECT_URI: process.env.NEXT_PUBLIC_GA4_REDIRECT_URI || 'NOT_SET',
        FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI || 'NOT_SET',
        GOOGLE_ADS_REDIRECT_URI: process.env.GOOGLE_ADS_REDIRECT_URI || 'NOT_SET',
        LINKEDIN_REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI || 'NOT_SET',
        DV360_REDIRECT_URI: process.env.DV360_REDIRECT_URI || 'NOT_SET',
        
        // OAuth credentials (show only if set/not set)
        FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? 'SET' : 'NOT_SET',
        FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET ? 'SET' : 'NOT_SET',
        LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID ? 'SET' : 'NOT_SET',
        LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET ? 'SET' : 'NOT_SET',
        DEVELOPER_TOKEN: process.env.DEVELOPER_TOKEN ? 'SET' : 'NOT_SET',
        
        // Runtime info
        isServer: typeof window === 'undefined',
        buildTime: new Date().toISOString(),
    };

    return NextResponse.json(envVars);
}