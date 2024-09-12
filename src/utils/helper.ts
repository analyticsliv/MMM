export function createJobId(connectorType: string, userId: string): string {
    const data = `${connectorType}-${userId}-${Date.now()}`;
    return data;
}