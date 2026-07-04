import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "www.archeoares.it",
      },
      {
        protocol: "https",
        hostname: "www.isolabisentina.org",
      },
      {
        protocol: "https",
        hostname: "civitadibagnoregio.cloud",
      },
      {
        protocol: "https",
        hostname: "media.cultura.gov.it",
      },
      {
        protocol: "https",
        hostname: "www.sacrobosco.eu",
      },
      {
        protocol: "https",
        hostname: "visitbolsena.it",
      },
      {
        protocol: "https",
        hostname: "www.secretumbria.it",
      },
    ],
  },
  serverExternalPackages: ["mongoose"],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
