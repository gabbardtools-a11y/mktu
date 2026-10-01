// PM2 ecosystem для мкту.рус — v3 (2026-10-01, Мастер Ибро)
// Секреты НЕ хранить здесь! .env живёт на VPS: /var/www/mktu/.env (root:root, 600).
// Этот файл при старте читает .env и прокидывает переменные в процесс,
// так что ROUTERAI_API_KEY и др. попадают в приложение при любом способе запуска:
//   pm2 start /var/www/mktu/ecosystem.config.cjs   (деплой, вручную)
//   pm2 save + resurrect (env сохраняется в дамп; при сомнении — delete+start заново)
const fs = require("fs");

const ENV_FILE = "/var/www/mktu/.env";
const fileEnv = {};
try {
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v !== "") fileEnv[m[1]] = v;
  }
} catch (e) {
  console.error("[ecosystem] не смог прочитать " + ENV_FILE + ": " + e.message);
}

module.exports = {
  apps: [
    {
      name: "mktu",
      script: "server.js",
      cwd: "/var/www/mktu/.next/standalone",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      env: Object.assign(
        {
          NODE_ENV: "production",
          PORT: 3000,
          HOSTNAME: "127.0.0.1",
          NEXT_TELEMETRY_DISABLED: 1,
        },
        fileEnv
      ),
      out_file: "/var/log/mktu/out.log",
      error_file: "/var/log/mktu/error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
