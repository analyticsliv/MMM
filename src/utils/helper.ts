import crypto from "crypto";

export function createJobId(connectorType: string, userEmail: string): string {
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60)); // Hourly timestamp
    const data = `${connectorType}-${userEmail}-${currentHour}`;

    // Generate SHA-256 hash for consistency
    const hash = crypto.createHash("sha256").update(data).digest("hex");

    return hash.slice(0, 12); // First 12 chars for shorter jobId
}
