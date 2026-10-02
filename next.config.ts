import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "*.cursor.sh",
    "*.cursorapi.com",
    "*.cloudworkstations.dev",
  ],
};

export default nextConfig;
