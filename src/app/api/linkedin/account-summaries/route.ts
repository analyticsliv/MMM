import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { access_token } = await req.json();

  if (!access_token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
  }

  try {
    // Step 1: Fetch ad account user data
    const url = `https://api.linkedin.com/v2/adAccountUsers?q=authenticatedUser`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    const responseText = await response.text();
    if (!response.ok) {
      return NextResponse.json({ error: responseText }, { status: response.status });
    }

    const data = JSON.parse(responseText);

    // Step 2: Extract all account IDs (from URNs)
    const accountIds = data.elements
      .map((el: any) => el.account?.split(':')[3])
      .filter(Boolean);

    if (!accountIds.length) {
      return NextResponse.json({ error: 'No ad account IDs found' }, { status: 400 });
    }

    // Step 3: Fetch account names using the account IDs
    // const accountInfo = await Promise.all(
    //   accountIds.map(async (id: string) => {
    //     try {
    //       const accountRes = await fetch(`https://api.linkedin.com/v2/adAccounts/${id}`, {
    //         headers: {
    //           Authorization: `Bearer ${access_token}`,
    //           'Content-Type': 'application/json',
    //           'X-Restli-Protocol-Version': '2.0.0',
    //         },
    //       });

    //       if (!accountRes.ok) {
    //         const errorText = await accountRes.text();
    //         console.warn(`Failed to fetch details for account ID ${id}:`, errorText);
    //         return { id, name: 'Unknown', error: errorText };
    //       }

    //       const accountJson = await accountRes.json();
    //       return {
    //         id,
    //         name: accountJson.name || 'Unnamed Account',
    //       };
    //     } catch (err) {
    //       console.error(`Error fetching account ID ${id}:`, err);
    //       return { id, name: 'Unknown', error: 'Fetch error' };
    //     }
    //   })
    // );

    // Optional: fetch LinkedIn profile too
    const profileRes = await fetch('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const profileText = await profileRes.text();

    return NextResponse.json({
      adAccountData: data,
      adAccountId: accountIds,
      // accountNames: accountInfo,
    });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch ad account or names' }, { status: 500 });
  }
}








// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   const { access_token } = await req.json();

//   if (!access_token) {
//     return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
//   }

//   try {
//     // Fetch ad account user data
//     const url = `https://api.linkedin.com/v2/adAccountUsers?q=authenticatedUser`;
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//         'Content-Type': 'application/json',
//         'X-Restli-Protocol-Version': '2.0.0',
//       },
//     });

//     const responseText = await response.text();
//     if (!response.ok) {
//       return NextResponse.json({ error: responseText }, { status: response.status });
//     }

//     const profileRes = await fetch('https://api.linkedin.com/v2/me', {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });
//     console.log('sjdi=--------------', await profileRes.text());

//     const data = JSON.parse(responseText);
//     console.log('Ad Account User Data:', data);

//     // Extract accountId (numeric value without urn:li:sponsoredAccount:)
//     const accountId = data.elements[0]?.account?.split(':')[3];

//     console.log("accountIdaccountIdaccountId--", accountId)
//     if (!accountId) {
//       return NextResponse.json({ error: 'Ad account ID not found' }, { status: 400 });
//     }

//     // // Fetch campaigns for the ad account using the extracted accountId
//     // const campaignUrl = `https://api.linkedin.com/v2/adCampaigns?q=account&accountId=${accountId}`;
//     // const campaignResponse = await fetch(campaignUrl, {
//     //   headers: {
//     //     Authorization: `Bearer ${access_token}`,
//     //     'Content-Type': 'application/json',
//     //     'X-Restli-Protocol-Version': '2.0.0',
//     //   },
//     // });

//     // const campaignResponseText = await campaignResponse.text();
//     // console.log("campaignResponseText------", campaignResponseText)
//     // if (!campaignResponse.ok) {
//     //   return NextResponse.json({ error: campaignResponseText }, { status: campaignResponse.status });
//     // }

//     // const campaignData = JSON.parse(campaignResponseText);
//     // console.log('Campaign Data:', campaignData);

//     // Return both ad account and campaign data
//     return NextResponse.json({
//       adAccountData: data,
//       // campaignData: campaignData,
//     });

//   } catch (error) {
//     console.error('Fetch error:', error);
//     return NextResponse.json({ error: 'Failed to fetch ad account or campaigns' }, { status: 500 });
//   }
// }










// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   const { access_token } = await req.json();

//   if (!access_token) {
//     return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
//   }

//   try {
//     //   headers: {
//     //     Authorization: `Bearer ${access_token}`,
//     //     'Content-Type': 'application/json',
//     //     'X-Restli-Protocol-Version': '2.0.0',
//     //     'LinkedIn-Version': '202504', // Make sure to set the appropriate API version
//     //   },
//     // });

//       const url = `https://api.linkedin.com/v2/adAccountUsers?q=authenticatedUser`;
//       const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//         'Content-Type': 'application/json',
//         'X-Restli-Protocol-Version': '2.0.0',
//       },
//     });
//     const profileRes = await fetch('https://api.linkedin.com/v2/me', {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });
//     console.log('sjdi=--------------', await profileRes.text());


//     console.log("responseresponseresponse", response);

//     const responseText = await response.text();
//     console.log("response.text()", responseText);

//     if (!response.ok) {
//       return NextResponse.json({ error: responseText }, { status: response.status });
//     }

//     const data = JSON.parse(responseText); // Parsing the response text into JSON

//     console.log("datadatadatadata", data);

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Fetch error:', error);
//     return NextResponse.json({ error: 'Failed to fetch ad accounts' }, { status: 500 });
//   }
// }








// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   const { access_token } = await req.json();

//   if (!access_token) {
//     return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
//   }

//   try {
//     const response = await fetch('https://api.linkedin.com/v2/adAccounts', {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//         'Content-Type': 'application/json',
//         'X-Restli-Protocol-Version': '2.0.0',
//       },
//     });

//     console.log("responseresponseresponse",response)
//     console.log("response.text()",response.text())


//     if (!response.ok) {
//       const errorText = await response.text();
//       return NextResponse.json({ error: errorText }, { status: response.status });
//     }

//     const data = await response.json();

//     console.log("datadatadatadata",data)
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Fetch error:', error);
//     return NextResponse.json({ error: 'Failed to fetch ad accounts' }, { status: 500 });
//   }
// }
