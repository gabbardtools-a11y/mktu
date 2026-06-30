import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  // TS ошибки в нашем коде (src/) валят build.
  // Файлы в skills/ — от z.ai SDK, не наши, игнорируем.
  typescript: {
    // По умолчанию tsconfig.json исключает skills/, но если Next игнорирует
    // exclude — добавим ignoreBuildErrors только для skills через ignoreBuildErrors: false
    // и явный exclude в tsconfig
    ignoreBuildErrors: false,
  },
  // eslint: { ignoreDuringBuilds: true }, // если будут проблемы
};

export default nextConfig;
