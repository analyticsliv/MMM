import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_GA4_REDIRECT_URI! // Your redirect URI
);

export async function getTokens(code: string) {
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
}

export function generateAuthUrl() {
  console.log("Generating GA4 Auth URL with scopes", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!, process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!, process.env.NEXT_PUBLIC_GA4_REDIRECT_URI!)
  const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
  console.log("Final redirect Url in GA$ auth----",authUrl)
  return authUrl;
}
