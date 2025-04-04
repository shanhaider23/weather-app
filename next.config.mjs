/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa';

const withPWA = nextPWA({
    dest: 'public',
    disable: false,
    register: true,
    skipWaiting: true,
});

const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);
