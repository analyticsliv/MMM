// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',  // Add this line for Cloud Run deployment
    reactStrictMode: false,
    experimental: {
        appDir: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                net: false,
                tls: false,
                dns: false,
                fs : false,
                child_process: false, 
            };
        }

        return config;
    },
};

export default nextConfig;