// src/lib/facebookOAuth.js

const clientId = process.env.FACEBOOK_CLIENT_ID;
const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
const redirectUri = 'https://127.0.0.1:3000/api/facebook-callback';

export const generateFacebookAuthUrl = () => {
    const scope = 'public_profile,email,pages_show_list,pages_read_engagement,business_management';
    return `https://www.facebook.com/v11.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
};
