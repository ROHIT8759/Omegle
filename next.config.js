/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com'],
    },
    webpack: (config, { isServer }) => {
        // Disable webpack caching
        config.cache = false
        return config
    },
}

module.exports = nextConfig
