/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
  },
  webpack: (config, { isServer, webpack }) => {
      // 1) Enable WebAssembly support
      config.experiments = {
        ...(config.experiments || {}),
        asyncWebAssembly: true,
      };

      // 2) When we import *.wasm?url, treat it as a file URL, not as a WASM module
      config.module.rules.push({
        test: /\.wasm$/i,
        type: "asset/resource",
        resourceQuery: /url/, // only for imports ending with ?url
      });

      return config;
    },
}

module.exports = nextConfig

