// utils/checkJobStatus.ts

export const checkJobStatus = async (jobId: string) => {
  try {
    const res = await fetch('/api/connectors/jobCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Job check failed');
    return data;
  } catch (error) {
    console.error('Job check error:', error);
    return null;
  }
};
