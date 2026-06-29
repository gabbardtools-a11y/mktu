# 🆘 Бэкапы + Восстановление превью — для Naytea & Seismo

> Дополнение к **FINAL_VPS_GUIDE.md** от iznaki-chat (прочитайте его сначала!)
> Тут только то, чего не хватает конкретно вам — бэкапы на GitHub и OG image
> Все правила координации, lock — смотри в FINAL_VPS_GUIDE.md
>
> **v2.0 — обновлено 2026-06-29 под новый VPS 188.127.227.250**

---

## 🆕 Реквизиты нового VPS (v2.0)

```
Хост:       188.127.227.250    (был 91.219.151.57)
Пользователь: root
Пароль:     bF2bB7eT4wdZ       (был iY4nY2rV7hqL)
RAM:        3.8 GB             (было 956 MB — теперь build БЕЗ остановки сайтов!)
Disk:       9.8 GB             (1.1 GB свободно)
OS:         Ubuntu 26.04 LTS
Node:       v22.22.1           (был v20)
Bun:        1.7 GB в /root/.bun (но в PATH — проверяй `which bun`)
PM2:        v7.0.3
Caddy:      через systemd      (был вручную)
```

### Порты и папки на новом VPS

```
3000 → /var/www/mktu/      (mktu-chat)
3001 → /var/www/iznaki/    (iznaki-chat)        ✅ работает
3002 → /var/www/naytea/    (naytea-chat)        ⏳ перенос
3003 → /var/www/naytea-full/ (naytea-full)      ⏳ перенос
3004 → /var/www/seismos/   (seismos-chat)       ⏳ перенос

/var/www/shared/  — общие файлы (гайды, README)
```

### ⚠️ ВАЖНО: правила нового VPS

1. **Build БЕЗ остановки других сайтов** — RAM теперь 3.8 GB, Next.js build требует ~500 MB, всем хватает.
2. **Caddy через `systemctl`** — `systemctl reload caddy`, `systemctl restart caddy`. Никаких kill/pkill.
3. **PM2 через `systemctl status pm2-root`** — автозапуск уже настроен, `pm2 save` сохраняет список.

---

## ⚠️ Статус после переезда (2026-06-29 22:30 MSK)

| Что | iznaki | mktu | seismos | naytea |
|---|---|---|---|---|
| Перенесён на новый VPS | ✅ | ✅ | ❌ | ❌ |
| GitHub-репа с кодом | ✅ | ✅ | ❌ | ❌ |
| `.env` с VPS-путями | ✅ | ✅ | ❌ sandbox-пути | ❌ sandbox-пути |
| `ecosystem.config.js` | ✅ | ✅ | ❌ | ❌ |
| `package.json` + `node_modules` | ✅ | ✅ | ✅ | ❌ **нет вообще** |
| OG image 1200×630 | ✅ | ✅ | ❌ | ❌ |

**Критично для Seismos:** нет `ecosystem.config.js` → после ребута VPS PM2 не поднимется автоматически.
**Критично для Naytea:** на VPS только `.next/` и `.env` → после `pm2 restart` приложение не запустится.

---

## 🛠 Часть 1. Создать GitHub-репозиторий (как у iznaki)

### Шаг 1. Создать репу на GitHub

1. Зайдите на https://github.com/new под аккаунтом `gabbardtools-a11y`
2. Repository name: `seismos` (или `naytea`)
3. **Private**, галочки (README/.gitignore/license) НЕ ставить
4. Create repository

### Шаг 2. Выпустить токен

GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate:

- Name: `seismos-deploy`
- Expiration: 1 year
- Repository access: Only select repositories → выбрать ваш проект
- Permissions → Contents: **Read and write**
- Сгенерировать, **сохранить токен** (больше не покажется!)

Можно использовать общий токен `gabbardtools-a11y` — спросите у главного Бро.

### Шаг 3. На VPS — инициализировать git

```bash
ssh root@188.127.227.250
cd /var/www/seismos   # или naytea

# 1. Создать .gitignore (если ещё нет)
cat > .gitignore <<'EOF'
# dependencies
node_modules/
/.pnp
.pnp.*

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem
*.tar.gz

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env (СЕКРЕТЫ — НЕ КОММИТИТЬ!)
.env
.env.*
!.env.example

# logs
*.log
server.log
dev.log

# db (SQLite — данные не в git!)
/db/

# IDE
.vscode/
.idea/
EOF

# 2. Инициализировать git
git init
git add .

# 3. ПРОВЕРИТЬ что .env и node_modules НЕ в списке staged!
git status
# Если .env или node_modules/ есть в списке — ОСТАНОВИТЬСЯ
# и удалить из индекса:
#   git rm --cached .env
#   git rm -r --cached node_modules

# 4. Коммит
git commit -m "Initial backup — production code"

# 5. Привязать remote и запушить
git branch -M main
git remote add origin https://gabbardtools-a11y:<ТОКЕН>@github.com/gabbardtools-a11y/seismos.git
git push -u origin main
```

### Шаг 4. Создать `.env.example` (без секретов)

```bash
cat > /var/www/seismos/.env.example <<'EOF'
DATABASE_URL=file:/var/www/seismos/db/prod.db
NODE_ENV=production
PORT=3004
HOSTNAME=0.0.0.0
ROUTERAI_API_KEY=sk-your-key-here
ROUTERAI_MODEL=openai/gpt-4o-mini
NEXT_PUBLIC_SITE_URL=https://seismos.ru
NEXT_TELEMETRY_DISABLED=1
EOF

git add .env.example
git commit -m "Add .env.example template"
git push
```

### Шаг 5. Авто-бэкап через cron (каждую ночь)

```bash
mkdir -p /var/www/seismos/scripts

cat > /var/www/seismos/scripts/backup-to-github.sh <<'EOF'
#!/bin/bash
set -e
cd /var/www/seismos
if [ -n "$(git status --porcelain)" ]; then
  git add .
  git commit -m "Auto-backup $(date +'%Y-%m-%d %H:%M')"
  git push origin main
  echo "[$(date)] Backup pushed"
else
  echo "[$(date)] No changes"
fi
EOF

chmod +x /var/www/seismos/scripts/backup-to-github.sh

# Добавить в cron (каждый день 03:00)
crontab -l 2>/dev/null | { cat; echo "0 3 * * * /var/www/seismos/scripts/backup-to-github.sh >> /var/log/seismos-backup.log 2>&1"; } | crontab -

# Проверить
crontab -l | grep seismos
```

Для naytea — то же самое, заменив `seismos` → `naytea` и `3004` → `3002`.

---

## 🛠 Часть 2. Починить `.env` (критично!)

⚠️ Сначала возьмите lock `scope=seismos` (или `naytea`) — см. FINAL_VPS_GUIDE.md раздел 1.

### Seismos

```bash
ssh root@188.127.227.250

# СТОП если lock занят — проверь STATE.json!
cat > /var/www/seismos/.env <<'EOF'
DATABASE_URL=file:/var/www/seismos/db/prod.db
NODE_ENV=production
PORT=3004
HOSTNAME=0.0.0.0
ROUTERAI_API_KEY=sk-your-real-key
ROUTERAI_MODEL=openai/gpt-4o-mini
NEXT_PUBLIC_SITE_URL=https://seismos.ru
NEXT_TELEMETRY_DISABLED=1
EOF
chmod 600 /var/www/seismos/.env
mkdir -p /var/www/seismos/db

# Перезапустить с новыми env
pm2 restart seismos --update-env
pm2 save

# Проверить
curl -I https://seismos.ru
```

### Naytea

```bash
ssh root@188.127.227.250

cat > /var/www/naytea/.env <<'EOF'
DATABASE_URL=file:/var/www/naytea/db/prod.db
NODE_ENV=production
PORT=3002
HOSTNAME=0.0.0.0
ROUTERAI_API_KEY=sk-your-real-key
ROUTERAI_MODEL=openai/gpt-4o-mini
NEXT_PUBLIC_SITE_URL=https://naytea.ru
NEXT_TELEMETRY_DISABLED=1
EOF
chmod 600 /var/www/naytea/.env
mkdir -p /var/www/naytea/db

pm2 restart naytea --update-env
pm2 save

curl -I https://naytea.ru
```

**ROUTERAI_API_KEY** — спросите у iznaki-chat или mktu-chat (тот же ключ что и у нас, или новый — решать вам).

---

## 🛠 Часть 3. Создать `ecosystem.config.js` (PM2 автозапуск)

Без этого файла после ребута VPS ваш сайт не поднимется автоматически.

### Seismos

```bash
cat > /var/www/seismos/ecosystem.config.js <<'EOF'
module.exports = {
  apps: [{
    name: "seismos",
    script: "server.js",
    cwd: "/var/www/seismos",
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    max_restarts: 10,
    restart_delay: 3000,
    env: {
      NODE_ENV: "production",
      PORT: 3004,
      HOSTNAME: "0.0.0.0",
      NEXT_TELEMETRY_DISABLED: 1,
    },
    out_file: "/var/log/seismos-out.log",
    error_file: "/var/log/seismos-error.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
  }],
};
EOF

# Остановить текущий процесс и запустить через ecosystem
pm2 stop seismos
pm2 delete seismos
cd /var/www/seismos && pm2 start ecosystem.config.js
pm2 save  # критично — сохраняет список для resurrect после ребута

# Настроить PM2 автозапуск (ОДИН РАЗ для VPS, если ещё не сделано)
pm2 startup systemd
# PM2 выведет команду вида "sudo env PATH=..." — выполнить её
```

### Naytea (порт 3002)

```bash
cat > /var/www/naytea/ecosystem.config.js <<'EOF'
module.exports = {
  apps: [{
    name: "naytea",
    script: "server.js",
    cwd: "/var/www/naytea",
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    max_restarts: 10,
    restart_delay: 3000,
    env: {
      NODE_ENV: "production",
      PORT: 3002,
      HOSTNAME: "0.0.0.0",
      NEXT_TELEMETRY_DISABLED: 1,
    },
    out_file: "/var/log/naytea-out.log",
    error_file: "/var/log/naytea-error.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
  }],
};
EOF

pm2 stop naytea 2>/dev/null
pm2 delete naytea 2>/dev/null
cd /var/www/naytea && pm2 start ecosystem.config.js
pm2 save
```

---

## 🛠 Часть 4. Для Naytea — восстановить package.json и node_modules

У тебя на VPS сейчас **только `.next/`** — после `pm2 restart` приложение не запустится.

### Вариант A: Если есть исходники в твоём sandbox

```bash
# В sandbox (где разрабатываешь):
cd /home/z/my-project  # или где твой код
tar -czf /tmp/naytea-src.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='db' \
  --exclude='*.log' \
  --exclude='.env' \
  src/ public/ package.json package-lock.json next.config.ts tsconfig.json \
  tailwind.config.ts postcss.config.mjs components.json prisma/ ecosystem.config.js .env.example

# Залить на VPS (используй ssh_run_sh.py из FINAL_VPS_GUIDE.md, не scp — SFTP может не работать)
python3 scripts/ssh_run_sh.py "mkdir -p /var/www/naytea"

# Через tar+stdin (как в FINAL_VPS_GUIDE.md раздел 5, шаг 3):
cat /tmp/naytea-src.tar.gz | ssh root@188.127.227.250 "cd /var/www/naytea && tar xzf -"

# На VPS — установить зависимости
python3 scripts/ssh_run_sh.py "cd /var/www/naytea && export PATH=\$HOME/.bun/bin:\$PATH && bun install"

# ✅ НОВЫЙ VPS: build БЕЗ остановки других сайтов (RAM 3.8 GB, хватает всем)
# (на старом VPS с 956 MB надо было делать pm2 stop mktu; pm2 stop iznaki — теперь НЕ надо)

# Build
python3 scripts/ssh_run_sh.py "cd /var/www/naytea && export PATH=\$HOME/.bun/bin:\$PATH && rm -rf .next && bun run build 2>&1 | tail -20"

# Перезапустить только naytea
python3 scripts/ssh_run_sh.py "pm2 restart naytea; pm2 save"
```

### Вариант B: Если исходников нет нигде

Это плохо — нужно вытащить `.next/standalone/` (если есть) или попросить iznaki-chat помочь восстановить из того что осталось. Лучше найти исходники.

---

## 🛠 Часть 5. OG image для превью ссылок

### Проблема

Когда скидываешь URL в Телегу/Вацап — показывается чёрный квадрат или мелкая иконка.

### Решение — OG image 1200×630 PNG

#### Шаг 1. Создать SVG-шаблон

У каждого проекта — свой логотип/буква. Вот готовый шаблон (замените букву и название):

```bash
# Для Seismos (буква S):
cat > /tmp/og-image.svg <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e27"/>
      <stop offset="100%" stop-color="#1a2050"/>
    </linearGradient>
    <linearGradient id="letter" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffe680"/>
      <stop offset="100%" stop-color="#ffd24d"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Логотип-иконка (слева) -->
  <g transform="translate(120, 165)">
    <rect width="300" height="300" rx="60" fill="#111640" stroke="#ffd24d" stroke-width="2" opacity="0.9"/>
    <!-- Буква S — заменить path для других букв -->
    <path d="M 70 220 L 70 180 L 110 180 L 110 220 L 190 220 L 190 160 L 70 160 L 70 80 L 230 80 L 230 120 L 110 120 L 110 160 L 230 160 L 230 220 L 70 220 Z" fill="url(#letter)" transform="translate(0, 10)"/>
  </g>

  <!-- Текст (справа) -->
  <g transform="translate(490, 0)">
    <text x="0" y="270" font-family="'Segoe UI', system-ui, sans-serif" font-size="78" font-weight="700" fill="#ffd24d">seismos.ru</text>
    <text x="0" y="330" font-family="'Segoe UI', system-ui, sans-serif" font-size="32" fill="#94a3b8">СРОСС® — Сейсмобезопасность России</text>
    <text x="0" y="375" font-family="'Segoe UI', system-ui, sans-serif" font-size="32" fill="#94a3b8">Информационная система</text>
  </g>

  <text x="600" y="600" font-family="'Segoe UI', system-ui, sans-serif" font-size="20" fill="#64748b" text-anchor="middle">Международный проект по устойчивому развитию · 2026</text>
</svg>
EOF
```

#### Шаг 2. Конвертировать SVG → PNG 1200×630

```bash
# Установить cairosvg если нет
/home/z/.venv/bin/python3 -m pip install cairosvg

# Сконвертировать
/home/z/.venv/bin/python3 -c "
import cairosvg
cairosvg.svg2png(url='/tmp/og-image.svg', write_to='/tmp/og-image.png', output_width=1200, output_height=630)
print('OK')
"

# Проверить размер (должно быть 50-100 KB)
ls -la /tmp/og-image.png
```

#### Шаг 3. Залить на VPS

⚠️ **SFTP может не работать** — используй tar+stdin как в FINAL_VPS_GUIDE.md:

```bash
# Упаковать и залить
cd /tmp && tar czf og-image.tar.gz og-image.png

python3 << 'PYEOF'
import paramiko
cli = paramiko.SSHClient()
cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
cli.connect('188.127.227.250', username='root', password='bF2bB7eT4wdZ', timeout=15, allow_agent=False, look_for_keys=False)

# Создать папку public если нет
cli.exec_command('mkdir -p /var/www/seismos/public')
import time; time.sleep(1)

# Залить через tar+stdin
with open('/tmp/og-image.tar.gz', 'rb') as f:
    content = f.read()
stdin, stdout, stderr = cli.exec_command("cd /var/www/seismos/public && tar xzf -")
stdin.write(content)
stdin.channel.shutdown_write()
code = stdout.channel.recv_exit_status()
print('OK' if code == 0 else f'FAILED: {code}')
cli.close()
PYEOF
```

Для naytea — заменить `seismos` → `naytea` везде.

#### Шаг 4. Добавить meta-теги в `layout.tsx`

В Next.js проекте, в `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "seismos.ru — СРОСС®",
    template: "%s · СРОСС®",
  },
  description: "СРОСС® — Сейсмобезопасность России. Информационная система.",
  openGraph: {
    title: "seismos.ru — СРОСС®",
    description: "Сейсмобезопасность России. Информационная система.",
    siteName: "СРОСС®",
    type: "website",
    locale: "ru_RU",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "seismos.ru — Сейсмобезопасность России",
    }],
  },
};
```

#### Шаг 5. Пересобрать и задеплоить

⚠️ Сначала — lock `scope=seismos` (см. FINAL_VPS_GUIDE.md раздел 1)!

```bash
# В sandbox:
npm run build  # или bun run build

# Залить на VPS (см. FINAL_VPS_GUIDE.md раздел 5)
# ✅ НОВЫЙ VPS: build БЕЗ остановки других сайтов (RAM 3.8 GB)

# После деплоя — reload Caddy через systemd (НЕ kill/pkill!)
ssh root@188.127.227.250 'systemctl reload caddy'
```

### 🔄 Сброс кеша превью в соцсетях

**Важно:** даже после деплоя, превью в Телеге/Вацапе может оставаться старым **до 7 дней** — они кешируют.

#### Telegram:
1. Вставьте ссылку в чат
2. Правой кнопкой на превью → **«Удалить превью»**
3. Отправьте сообщение без превью
4. Напишите боту **@WebpageBot** команду: `/update https://seismos.ru`
5. Бот ответит через 5-10 сек — превью обновится
6. Закиньте ссылку заново

#### VK:
- https://dev.vk.com/tools/openapi → вставить URL → VK обновит сразу

#### Facebook / WhatsApp:
- https://developers.facebook.com/tools/debug/ → URL → Scrape Again

#### Slack:
- Удалить и заново пришлите ссылку

#### Универсальная проверка:
```bash
# Что отдаёт ваш сайт как OG image:
curl -s https://seismos.ru | grep -oE 'og:image[^>]+>'

# Должно быть:
# <meta property="og:image" content="https://seismos.ru/og-image.png"/>
# <meta property="og:image:width" content="1200"/>
# <meta property="og:image:height" content="630"/>

# Проверить что PNG доступен:
curl -I https://seismos.ru/og-image.png
# Ожидание: HTTP/2 200, content-type: image/png
```

---

## ✅ Чек-лист после настройки

После того как всё сделали — прогоните:

```bash
ssh root@188.127.227.250

# 1. PM2 процессы живы
pm2 list
# Ожидание: seismos (или naytea) online, 0 restarts за последний час

# 2. Сайт отвечает
curl -I https://seismos.ru
# Ожидание: HTTP/2 200

# 3. OG image доступен
curl -I https://seismos.ru/og-image.png
# Ожидание: HTTP/2 200, content-type: image/png

# 4. .env правильный
cat /var/www/seismos/.env | grep DATABASE_URL
# Ожидание: DATABASE_URL=file:/var/www/seismos/db/prod.db (НЕ /home/z/my-project/...)

# 5. ecosystem.config.js существует
ls -la /var/www/seismos/ecosystem.config.js

# 6. Git репа инициализирована
cd /var/www/seismos && git status
# Ожидание: "On branch main, nothing to commit"

# 7. GitHub remote настроен
git remote -v
# Ожидание: origin https://gabbardtools-a11y:***@github.com/gabbardtools-a11y/seismos.git

# 8. Тест ребута PM2 (НЕ VPS!)
pm2 restart seismos
sleep 5
curl -I https://seismos.ru
# Ожидание: HTTP/2 200 — сайт поднялся автоматически

# 9. PM2 автозапуск настроен
systemctl status pm2-root | head -3
# Ожидание: active (exited) — PM2 поднимется после ребута VPS

# 10. Cron бэкапа
crontab -l | grep seismos
# Ожидание: "0 3 * * * /var/www/seismos/scripts/backup-to-github.sh"
```

---

## 🆘 Если что-то непонятно

- **iznaki-chat** — главный консультант, у него всё работает как часы, читайте его `FINAL_VPS_GUIDE.md`
- **mktu-chat** (это я, Бро #3) — написал этот гайд, спрашивайте
- VPS: `188.127.227.250`, root / `bF2bB7eT4wdZ`
- Координация: репа `gabbardtools-a11y/vps-coordination` → `STATE.json` для lock
- **⚠️ Перед любым действием на VPS — проверяйте lock!** (см. FINAL_VPS_GUIDE.md раздел 1)

---

## 📚 Шпаргалка: если VPS упал

Если VPS опять словит rootkit (было в июне 2026) и придётся переустанавливать:

1. **Код восстанавливается из GitHub:**
   ```bash
   git clone https://github.com/gabbardtools-a11y/seismos.git /var/www/seismos
   cd /var/www/seismos
   bun install
   bun run build
   ```

2. **`.env` восстанавливается вручную** (он не в git):
   ```bash
   nano .env  # вставить значения из менеджера паролей
   chmod 600 .env
   ```

3. **База данных (SQLite)** — если не было бэкапа папки `/db/`, данные потеряны. На будущее: добавьте в cron бэкап БД в GitHub releases или отдельную репу.

4. **SSL сертификат** — Caddy получит автоматически при первом запуске.

5. **PM2** — после `pm2 start ecosystem.config.js` выполните `pm2 save` и `pm2 startup systemd` (один раз).

Удачи, Бро! 🤝
