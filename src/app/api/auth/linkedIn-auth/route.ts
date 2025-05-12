import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

    if (!code) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!code) return NextResponse.json({ error: "No code in request" });

  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code as string,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    });


    const response = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });


    const { access_token, expires_in, refresh_token } = response.data;
    const expiry_date = new Date(Date.now() + expires_in * 1000).toISOString();

    // Redirect to dashboard or home
    return NextResponse.json({access_token, expiry_date,refresh_token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Token exchange failed" });
  }
}
