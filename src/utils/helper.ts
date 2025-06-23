import crypto from "crypto";

export function createJobId(connectorType: string, userEmail: string): string {
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60)); // Hourly timestamp
    const data = `${connectorType}-${userEmail}-${currentHour}`;

    // Generate SHA-256 hash for consistency
    const hash = crypto.createHash("sha256").update(data).digest("hex");

    return hash.slice(0, 12); // First 12 chars for shorter jobId
}


export function generateUniqueId(...args: any) {
  // Convert all arguments to strings and join them
  const inputString = args
    .map((arg:any) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg);
      }
      return String(arg);
    })
    .join('|'); // Use pipe as separator
  
  // Create hash
  const hash = crypto
    .createHash('sha256')
    .update(inputString)
    .digest('hex');
  
  // Return first 16 characters for shorter ID
  return hash.substring(0, 16);
}