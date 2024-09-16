// export function createJobId(connectorType: string, userEmail: string): string {
//     const data = `${connectorType}-${userEmail}`;
//     return data;
// }


export function createJobId(connectorType: string, userEmail: string): string {
    const data = `${connectorType}-${userEmail}`;
    const hash = Buffer.from(data).toString('base64').slice(0, 12); // Shortens the output
    return hash;
}
