export const GetCampaignData = async (payload: any) => {
  try {

    await fetch('/api/mmm/campaign-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return null;
  }
};
