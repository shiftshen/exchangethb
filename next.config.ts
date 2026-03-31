import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  async redirects() {
    return [
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/en/index.php', destination: '/', permanent: true },
      { source: '/th/index.php', destination: '/th', permanent: true },
      { source: '/zh/index.php', destination: '/zh', permanent: true },
      { source: '/change-lang/Th', destination: '/th', permanent: true },
      { source: '/change-lang/En', destination: '/', permanent: true },
      { source: '/change-lang/Zh', destination: '/zh', permanent: true },
      { source: '/crypto', destination: '/en/crypto', permanent: true },
      { source: '/cash', destination: '/en/cash', permanent: true },
      { source: '/exchanges', destination: '/en/exchanges', permanent: true },
      { source: '/money-changers', destination: '/en/money-changers', permanent: true },
      { source: '/routes', destination: '/en/routes', permanent: true },
      { source: '/legal/methodology', destination: '/en/legal/methodology', permanent: true },
    ];
  },
};

export default nextConfig;
