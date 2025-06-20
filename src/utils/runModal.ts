// utils/runModal.ts
export const runMMMModal = async (data: any) => {
  try {
    console.log("util--",data)
    const res = await fetch('/api/mmm/run-modal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || 'Unknown error');
    return result;
  } catch (err) {
    console.error('MMM Modal Run Error:', err);
    throw err;
  }
};
