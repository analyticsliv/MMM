export async function GET() {
  return Response.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    DV360_REDIRECT_URI : process.env.DV360_REDIRECT_URI ,
    LINKEDIN_CLIENT_ID : process.env.LINKEDIN_CLIENT_ID  ? 'Set' : 'Note set'
  });
}