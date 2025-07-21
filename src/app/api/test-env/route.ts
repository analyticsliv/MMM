// Make sure this is a server-side route
export async function GET() {
  // Force server-side execution
  console.log('Running on server side, NODE_ENV:', process.env.NODE_ENV);
  
  return Response.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'undefined',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
    
    // Debug info
    nodeEnv: process.env.NODE_ENV,
    runtime: process.env.NEXT_RUNTIME,
    // Check if we're actually in server context
    isServer: typeof window === 'undefined'
  });
}