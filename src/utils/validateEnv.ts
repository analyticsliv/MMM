// src/utils/validateEnv.ts
export function validateEnvVars() {
    const requiredServerVars = [
        'NEXTAUTH_SECRET',
        'MONGODB_URI',
        'FACEBOOK_CLIENT_ID',
        'FACEBOOK_CLIENT_SECRET',
        'LINKEDIN_CLIENT_ID',
        'LINKEDIN_CLIENT_SECRET',
        'DEVELOPER_TOKEN'
    ];

    const requiredClientVars = [
        'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
        'NEXT_PUBLIC_GOOGLE_CLIENT_SECRET'
    ];

    const requiredUrlVars = [
        'NEXTAUTH_URL',
        'BASE_API_URL',
        'GA4_REDIRECT_URI',
        'FACEBOOK_REDIRECT_URI',
        'GOOGLE_ADS_REDIRECT_URI',
        'LINKEDIN_REDIRECT_URI',
        'DV360_REDIRECT_URI'
    ];

    const missing: string[] = [];

    // Check server-side vars
    if (typeof window === 'undefined') {
        [...requiredServerVars, ...requiredUrlVars].forEach(varName => {
            if (!process.env[varName]) {
                missing.push(varName);
            }
        });
    }

    // Check client-side vars
    requiredClientVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    if (missing.length > 0) {
        console.error('Missing environment variables:', missing);
        
        // Log current environment for debugging
        if (typeof window === 'undefined') {
            console.log('Server environment check:', {
                NODE_ENV: process.env.NODE_ENV,
                hasNEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
                hasMONGODB_URI: !!process.env.MONGODB_URI,
                hasNEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
            });
        }
        
        return { isValid: false, missing };
    }

    return { isValid: true, missing: [] };
}

// Helper function to get environment variable with fallback
export function getEnvVar(name: string, fallback?: string): string {
    const value = process.env[name];
    if (!value && !fallback) {
        throw new Error(`Environment variable ${name} is required but not set`);
    }
    return value || fallback || '';
}