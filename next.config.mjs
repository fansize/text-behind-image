/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'images.unsplash.com',
            },
            {
              protocol: 'https',
              hostname: 'lxlfwrdbdhafahrrgtzk.supabase.co',
            },
            {
              protocol: 'https',
              hostname: 'zxrttzylzcvixglbkuvl.supabase.co',
            },
          ],
    },
};

export default nextConfig;
