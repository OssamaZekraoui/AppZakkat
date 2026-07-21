import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Keep Turbopack scoped to this application when another lockfile exists
  // in a parent directory (common on shared Windows workstations).
  turbopack: {
    root: process.cwd(),
  },
};

export default withNextIntl(nextConfig);
