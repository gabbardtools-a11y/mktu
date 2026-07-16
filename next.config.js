/** @type {import('next').NextConfig} */
const nextConfig = {
  // В режиме dev убираем output: "export" - он только для статической сборки
  output: "standalone",

  // Для dev режима изображения не оптимизируются
  images: {
    unoptimized: true,
  },

  // Игнорируем ошибки TypeScript при сборке
  typescript: {
    ignoreBuildErrors: true,
  },

  // Отключаем строгий режим React
  reactStrictMode: false,
};

module.exports = nextConfig;
