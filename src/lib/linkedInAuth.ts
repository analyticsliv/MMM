import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.LINKEDIN_CLIENT_ID,
  process.env.LINKEDIN_CLIENT_SECRET,
  process.env.LINKEDIN_REDIRECT_URI // Your redirect URI
);

export async function getTokens(code: string) {
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
}

export function generateAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}
