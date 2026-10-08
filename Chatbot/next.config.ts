import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// Semua variabel lingkungan dipusatkan di file .env pada root folder siapsiaga
const configDir = path.dirname(fileURLToPath(import.meta.url));
loadEnvConfig(path.resolve(configDir, ".."));

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
