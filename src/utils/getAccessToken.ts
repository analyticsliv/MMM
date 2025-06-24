export const getGaAccessTokenFromRefreshToken = async (refreshToken: string) => {
    try {
        const response = await fetch(`/api/auth/googleAds-refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();
        return data?.access_token || null;
    } catch (error) {
        console.error("Error getting access token using refresh token:", error);
    }
}

export const getDv360AccessTokenFromRefreshToken = async (refreshToken: string) => {
    try {
        const response = await fetch(`/api/auth/dv360-refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();
        return data?.access_token || null;
    } catch (error) {
        console.error("Error getting access token using refresh token:", error);
    }
}