// // next.config.mjs
// import path from 'path';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     output: 'standalone',
//     reactStrictMode: false,
//     experimental: {
//         appDir: true,
//     },
//     typescript: {
//         ignoreBuildErrors: true,
//     },
//     webpack: (config, { isServer }) => {
//         // Add path aliases
//         config.resolve.alias = {
//             ...config.resolve.alias,
//             '@': path.join(process.cwd(), 'src'),
//             '@/components': path.join(process.cwd(), 'src/components'),
//             '@/utils': path.join(process.cwd(), 'src/utils'),
//             '@/hooks': path.join(process.cwd(), 'src/hooks'),
//             '@/lib': path.join(process.cwd(), 'src/lib'),
//         };

//         if (!isServer) {
//             config.resolve.fallback = {
//                 ...config.resolve.fallback,
//                 net: false,
//                 tls: false,
//                 dns: false,
//                 fs : false,
//                 child_process: false, 
//             };
//         }

//         return config;
//     },
// };

// export default nextConfig;


// next.config.mjs
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    experimental: {
        appDir: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Add public runtime config for environment variables
    publicRuntimeConfig: {
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    },
    // Add server runtime config
    serverRuntimeConfig: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        MONGODB_URI: process.env.MONGODB_URI,
        FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
        FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
        LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
        LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
        DEVELOPER_TOKEN: process.env.DEVELOPER_TOKEN,
    },
    // Ensure environment variables are available at runtime
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        BASE_API_URL: process.env.BASE_API_URL,
        GA4_REDIRECT_URI: process.env.GA4_REDIRECT_URI,
        FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI,
        GOOGLE_ADS_REDIRECT_URI: process.env.GOOGLE_ADS_REDIRECT_URI,
        LINKEDIN_REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI,
        DV360_REDIRECT_URI: process.env.DV360_REDIRECT_URI,
    },
    webpack: (config, { isServer }) => {
        // Add path aliases
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.join(process.cwd(), 'src'),
            '@/components': path.join(process.cwd(), 'src/components'),
            '@/utils': path.join(process.cwd(), 'src/utils'),
            '@/hooks': path.join(process.cwd(), 'src/hooks'),
            '@/lib': path.join(process.cwd(), 'src/lib'),
        };

        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                net: false,
                tls: false,
                dns: false,
                fs: false,
                child_process: false, 
            };
        }

        return config;
    },
};

export default nextConfig;