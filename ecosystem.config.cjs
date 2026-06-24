// PM2 ecosystem для mktu.рус
// Файл: /var/www/mktu/ecosystem.config.cjs
//
// Запуск:
//   cd /var/www/mktu
//   pm2 start ecosystem.config.cjs
//   pm2 save
//
// После ребута VPS:
//   pm2 resurrect
//
module.exports = {
  apps: [
    {
      name: "mktu",
      script: "server.js",
      cwd: "/var/www/mktu",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
        NEXT_TELEMETRY_DISABLED: 1,
        // Секреты — задать через .env (см. /var/www/mktu/.env)
        // PM2 автоматически подхватит переменные из .env, если файл лежит в cwd
      },
      // Логи
      out_file: "/var/log/mktu/out.log",
      error_file: "/var/log/mktu/error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      //Watch: false, // не перезапускать при изменении файлов
      // Health check
      // min_uptime: 5000,  // процесс должен жить минимум 5 сек, иначе считается "упавшим"
    },
  ],
};
