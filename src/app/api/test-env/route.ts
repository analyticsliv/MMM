export async function GET() {
  return Response.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID! ,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET! ,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET! ,
    DV360_REDIRECT_URI : process.env.DV360_REDIRECT_URI! ,
    LINKEDIN_CLIENT_ID : process.env.LINKEDIN_CLIENT_ID! ,
    MONGODB_URI : process.env.MONGODB_URI! 
  });
}