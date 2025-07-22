import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
    process.env.NEXTPUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXTPUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_ADS_REDIRECT_URI // Your redirect URI
);

export async function getTokens(code: string) {
    const { tokens } = await oAuth2Client.getToken(code);
    return tokens;
}

export function generateAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/adwords'];
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
    });
}

