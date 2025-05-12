import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new Error("Missing LinkedIn client ID or redirect URI");
    }

    const state = 24145325;

    const scope = [
      "r_liteprofile",
      "r_ads_reporting",
      "r_ads",
      "rw_organization_admin",
      "w_member_social",
      "r_emailaddress",
      "w_organization_social",
      "rw_ads",
      "r_basicprofile",
      "r_organization_admin",
      "r_1st_connections_size",
    ].join(" ");

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Error generating LinkedIn auth URL:", error);
    return new NextResponse("Failed to generate auth URL", { status: 500 });
  }
}
