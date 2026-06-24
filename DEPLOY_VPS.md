# mktu.рус — конфигурация деплоя на VPS

## Структура на VPS

```
/var/www/mktu/                  ← папка проекта
├── server.js                   ← standalone-сервер из .next/standalone/server.js
├── package.json
├── .next/
│   └── (standalone build)
├── public/                     ← статика (логотип, robots и т.д.)
├── .env                        ← секреты (chmod 600)
└── ecosystem.config.cjs        ← PM2 конфиг

/var/log/mktu/                  ← логи PM2
├── out.log
└── error.log
```

## Порты

| Сайт | Порт | PM2 process |
|------|------|-------------|
| iznaki.ru | 3001 | `iznaki` |
| мкту.рус | 3000 | `mktu` |

Оба слушают только `127.0.0.1` (localhost), наружу торчит только Caddy.

## Шаги для запуска (на VPS)

### 1. Подготовить папку

```bash
sudo mkdir -p /var/www/mktu
sudo chown -R $USER:$USER /var/www/mktu
sudo mkdir -p /var/log/mktu
sudo chown -R $USER:$USER /var/log/mktu
```

### 2. Распаковать архив

Загрузить на VPS файл `mktu-deploy.tar.gz` (готовится на sandbox), затем:

```bash
cd /var/www/mktu
tar -xzf /path/to/mktu-deploy.tar.gz
```

### 3. Создать `.env`

```bash
cat > /var/www/mktu/.env <<'EOF'
ROUTERAI_API_KEY=sk-vYu9e0NIHwEgj9AZuVOiPPtB__TiK0A5
ROUTERAI_MODEL=google/gemini-2.5-flash
NEXT_PUBLIC_SITE_URL=https://мкту.рус
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=127.0.0.1
EOF
chmod 600 /var/www/mktu/.env
```

### 4. Проверить Node

```bash
node --version  # нужно v20+
# Если нет — поставить:
# curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
# sudo apt install -y nodejs
```

### 5. Запустить через PM2

```bash
cd /var/www/mktu
pm2 start ecosystem.config.cjs
pm2 save
pm2 list   # должны видеть процесс "mktu" online
```

### 6. Проверить локально

```bash
curl -I http://127.0.0.1:3000/
# Ожидаем: HTTP/1.1 200 OK
```

### 7. Настроить Caddy

Добавить в `/etc/caddy/Caddyfile`:

```caddyfile
мкту.рус {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3000 {
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }

    # Статика Next.js — кешировать агрессивно
    @static path /_next/static/* /robots.txt /sitemap.xml /logo.svg
    handle @static {
        reverse_proxy 127.0.0.1:3000
        header Cache-Control "public, max-age=31536000, immutable"
    }

    # Логи
    log {
        output file /var/log/caddy/mktu.log
        format json
    }
}

# Редирект www → без www
www.мкту.рус {
    redir https://мкту.рус{uri} permanent
}
```

Применить:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy   # если Caddy через systemd
# или если Caddy запущен вручную:
# sudo pkill caddy && sudo caddy run --config /etc/caddy/Caddyfile &
```

### 8. Проверить снаружи

```bash
curl -I https://мкту.рус/
# Ожидаем: HTTP/2 200
```

## Caddy через systemd (рекомендуется)

Сейчас Caddy запущен вручную (`caddy run &`) — упадёт при перезагрузке VPS.
Закрепить через systemd:

```bash
# /etc/systemd/system/caddy.service
[Unit]
Description=Caddy
After=network.target

[Service]
User=root
ExecStart=/usr/bin/caddy run --config /etc/caddy/Caddyfile
ExecReload=/usr/bin/caddy reload --config /etc/caddy/Caddyfile
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Активировать:

```bash
sudo systemctl daemon-reload
sudo systemctl enable caddy
sudo systemctl start caddy
# Убить старый ручной процесс:
sudo pkill caddy
sudo systemctl start caddy
sudo systemctl status caddy
```

## PM2 автозапуск при ребуте VPS

```bash
pm2 startup systemd
# PM2 выведет команду — выполнить её с sudo
pm2 save
```

Это создаст systemd-unit `pm2-$USER`, который поднимет все процессы из `~/.pm2/dump.pm2` при загрузке.

## Откат

```bash
# Остановить
pm2 stop mktu
pm2 delete mktu

# Удалить папку
rm -rf /var/www/mktu

# Убрать блок из Caddyfile и сделать reload
```

## Мониторинг

```bash
# PM2 статус
pm2 status
pm2 monit

# Логи mktu
pm2 logs mktu --lines 100
tail -f /var/log/mktu/out.log

# Логи Caddy для mktu
tail -f /var/log/caddy/mktu.log

# Использование ресурсов
pm2 info mktu
```
