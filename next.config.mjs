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
                fs : false,
                child_process: false, 
            };
        }

        return config;
    },
};

export default nextConfig;