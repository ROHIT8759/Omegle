/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Disable webpack caching
        config.cache = false
        return config
    },
}
