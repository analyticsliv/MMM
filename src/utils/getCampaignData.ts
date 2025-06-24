export const GetCampaignData = async (payload: any) => {
  try {
    const res = await fetch('/api/mmm/campaign-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return null;
  }
};
