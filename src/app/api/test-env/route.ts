// Create: src/app/api/debug-env/route.js
export async function GET() {
  return Response.json({
    // All environment variables (be careful with this in production)
    allEnvVars: Object.keys(process.env),
    
    // Specific checks
    nodeEnv: process.env.NODE_ENV,
    
    // Your variables with existence check
    secrets: {
      GOOGLE_CLIENT_ID: {
        exists: !!process.env.GOOGLE_CLIENT_ID,
        value: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
        length: process.env.GOOGLE_CLIENT_ID?.length || 0
      },
      GOOGLE_CLIENT_SECRET: {
        exists: !!process.env.GOOGLE_CLIENT_SECRET,
        value: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
        length: process.env.GOOGLE_CLIENT_SECRET?.length || 0
      },
      NEXTAUTH_SECRET: {
        exists: !!process.env.NEXTAUTH_SECRET,
        value: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
        length: process.env.NEXTAUTH_SECRET?.length || 0
      },
      MONGODB_URI: {
        exists: !!process.env.MONGODB_URI,
        value: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
        length: process.env.MONGODB_URI?.length || 0
      }
    }
  });
}