#!/bin/bash
# ============================================================================
# 🚀 Автоматическая установка МКТУ-проекта на VPS
# ============================================================================
# Этот скрипт:
#   1. Устанавливает Docker
#   2. Загружает проект МКТУ (из GitHub или ZIP-архива)
#   3. Собирает Docker-образ
#   4. Запускает контейнер
#   5. Устанавливает Nginx как reverse proxy
#   6. Получает бесплатный SSL-сертификат Let's Encrypt
#   7. Настраивает автопродление SSL
#
# Запуск:
#   sudo bash install.sh
#
# Или одной командой (после загрузки на сервер):
#   curl -fsSL https://raw.githubusercontent.com/USER/REPO/main/install.sh | sudo bash
# ============================================================================

set -e  # выход при любой ошибке

# --- Цвета для вывода ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'  # No Color

# --- Проверки ---
if [[ $EUID -ne 0 ]]; then
  echo -e "${RED}❌ Этот скрипт нужно запускать от root (sudo).${NC}"
  echo -e "Запустите: ${YELLOW}sudo bash install.sh${NC}"
  exit 1
fi

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   🚀 Автоматическая установка МКТУ-проекта на VPS            ║"
echo "║   Next.js + Docker + Nginx + Let's Encrypt SSL               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# --- Опрос домена ---
DOMAIN=""
echo -e "${YELLOW}🌐 Введите домен для сайта (например, mktu.ru)${NC}"
echo -e "   или нажмите Enter, чтобы использовать IP-адрес (без SSL):"
read -r DOMAIN_INPUT

if [[ -n "$DOMAIN_INPUT" ]]; then
  DOMAIN="$DOMAIN_INPUT"
  echo -e "${GREEN}✓ Домен: $DOMAIN${NC}"
else
  # Получаем внешний IP-адрес сервера
  DOMAIN=$(curl -s -4 ifconfig.me || curl -s -4 icanhazip.com || echo "localhost")
  echo -e "${YELLOW}⚠ Домен не указан — будет использован IP: $DOMAIN${NC}"
  echo -e "${YELLOW}  (SSL-сертификат не будет установлен)${NC}"
fi

# --- Опрос источника проекта ---
echo ""
echo -e "${YELLOW}📦 Откуда загрузить проект?${NC}"
echo "  1. Из ZIP-архива (по URL) — рекомендую, просто"
echo "  2. Из Git-репозитория (нужен public repo)"
echo "  3. Проект уже загружен в /opt/mktu"
echo -e "  Введите 1, 2 или 3 [${GREEN}1${NC}]:"
read -r SOURCE_CHOICE
SOURCE_CHOICE=${SOURCE_CHOICE:-1}

PROJECT_DIR="/opt/mktu"

case "$SOURCE_CHOICE" in
  1)
    echo ""
    echo -e "${YELLOW}📎 Введите URL ZIP-архива проекта:${NC}"
    echo -e "   (по умолчанию: tmpfiles.org ссылка на mktu-smartape.zip)"
    read -r ZIP_URL
    ZIP_URL=${ZIP_URL:-"https://tmpfiles.org/dl/wTwRT9HwYNlH/mktu-smartape.zip"}
    # Преобразуем ссылку tmpfiles.org в прямую
    if [[ "$ZIP_URL" == *"tmpfiles.org"* && "$ZIP_URL" != *"/dl/"* ]]; then
      ZIP_URL=$(echo "$ZIP_URL" | sed 's|tmpfiles.org/|tmpfiles.org/dl/|')
    fi
    ;;
  2)
    echo ""
    echo -e "${YELLOW}📎 Введите URL Git-репозитория:${NC}"
    echo -e "   (например, https://github.com/USER/mktu.git)"
    read -r GIT_URL
    if [[ -z "$GIT_URL" ]]; then
      echo -e "${RED}❌ Не указан Git URL${NC}"
      exit 1
    fi
    ;;
  3)
    echo -e "${GREEN}✓ Используем существующий проект в $PROJECT_DIR${NC}"
    ;;
  *)
    echo -e "${RED}❌ Неверный выбор: $SOURCE_CHOICE${NC}"
    exit 1
    ;;
esac

# ============================================================================
# Шаг 1: Установка Docker
# ============================================================================
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📦 Шаг 1/6: Проверка и установка Docker${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

if command -v docker &> /dev/null; then
  echo -e "${GREEN}✓ Docker уже установлен: $(docker --version)${NC}"
else
  echo -e "${YELLOW}→ Устанавливаю Docker...${NC}"
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  echo -e "${GREEN}✓ Docker установлен: $(docker --version)${NC}"
fi

# ============================================================================
# Шаг 2: Загрузка проекта
# ============================================================================
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📥 Шаг 2/6: Загрузка проекта${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

case "$SOURCE_CHOICE" in
  1)
    echo -e "${YELLOW}→ Скачиваю ZIP-архив: $ZIP_URL${NC}"
    mkdir -p /opt
    cd /opt
    # Удаляем старую версию если есть
    rm -rf mktu mktu.zip
    # Скачиваем (с follow redirects)
    curl -fsSL -o mktu.zip "$ZIP_URL" || wget -q -O mktu.zip "$ZIP_URL"
    echo -e "${YELLOW}→ Распаковываю...${NC}"
    unzip -q mktu.zip -d mktu
    rm -f mktu.zip
    # Если внутри ещё одна папка — поднимаемся на уровень вверх
    if [[ -d "$PROJECT_DIR/mktu" && -f "$PROJECT_DIR/mktu/package.json" ]]; then
      mv "$PROJECT_DIR/mktu"/* "$PROJECT_DIR/mktu"/.[!.]* "$PROJECT_DIR/" 2>/dev/null || true
      rmdir "$PROJECT_DIR/mktu" 2>/dev/null || true
    fi
    echo -e "${GREEN}✓ Проект загружен в $PROJECT_DIR${NC}"
    ;;
  2)
    echo -e "${YELLOW}→ Клонирую Git-репозиторий: $GIT_URL${NC}"
    rm -rf "$PROJECT_DIR"
    git clone "$GIT_URL" "$PROJECT_DIR"
    echo -e "${GREEN}✓ Проект клонирован в $PROJECT_DIR${NC}"
    ;;
  3)
    echo -e "${GREEN}✓ Проект уже в $PROJECT_DIR${NC}"
    ;;
esac

# Проверяем что package.json существует
if [[ ! -f "$PROJECT_DIR/package.json" ]]; then
  echo -e "${RED}❌ В $PROJECT_DIR нет package.json — это не Next.js проект${NC}"
  echo -e "Содержимое $PROJECT_DIR:"
  ls -la "$PROJECT_DIR"
  exit 1
fi

# ============================================================================
# Шаг 3: Сборка Docker-образа
# ============================================================================
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔨 Шаг 3/6: Сборка Docker-образа (может занять 2-4 минуты)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

cd "$PROJECT_DIR"
echo -e "${YELLOW}→ docker build -t mktu:latest .${NC}"
docker build -t mktu:latest .
echo -e "${GREEN}✓ Образ собран${NC}"

# ============================================================================
# Шаг 4: Запуск контейнера
# ============================================================================
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🏃 Шаг 4/6: Запуск контейнера${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

# Останавливаем старый контейнер если есть
docker rm -f mktu 2>/dev/null || true

docker run -d \
  --name mktu \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  mktu:latest

echo -e "${GREEN}✓ Контейнер запущен${NC}"

# Ждём, пока Next.js запустится
echo -e "${YELLOW}→ Жду 10 секунд, пока Next.js стартует...${NC}"
sleep 10

# Проверяем что приложение отвечает
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ | grep -q "200\|307\|308"; then
  echo -e "${GREEN}✓ Приложение отвечает на http://127.0.0.1:3000${NC}"
else
  echo -e "${YELLOW}⚠ Приложение ещё не отвечает — проверю логи...${NC}"
  docker logs mktu --tail 20 || true
  echo -e "${YELLOW}  (продолжу — возможно, нужно больше времени)${NC}"
fi

# ============================================================================
# Шаг 5: Установка Nginx + (опционально) Let's Encrypt SSL
# ============================================================================
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🌐 Шаг 5/6: Настройка Nginx${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

# Устанавливаем Nginx если нет
if ! command -v nginx &> /dev/null; then
  echo -e "${YELLOW}→ Устанавливаю Nginx...${NC}"
  apt-get update -qq
  apt-get install -y -qq nginx
  systemctl enable nginx
  systemctl start nginx
  echo -e "${GREEN}✓ Nginx установлен${NC}"
else
  echo -e "${GREEN}✓ Nginx уже установлен${NC}"
fi

# Создаём конфиг Nginx
NGINX_CONF="/etc/nginx/sites-available/mktu"
echo -e "${YELLOW}→ Создаю конфиг Nginx: $NGINX_CONF${NC}"

cat > "$NGINX_CONF" << 'NGINXEOF'
# МКТУ — Nginx reverse proxy для Next.js (порт 3000)
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER;

    # Логи
    access_log /var/log/nginx/mktu-access.log;
    error_log  /var/log/nginx/mktu-error.log;

    # Увеличенные лимиты для загрузки файлов (если нужны)
    client_max_body_size 50M;

    # Проксирование на Next.js контейнер
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # WebSocket support (если понадобится)
        proxy_read_timeout 86400;
    }

    # Статика Next.js — можно кешировать
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
NGINXEOF

# Подставляем домен
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$NGINX_CONF"

# Активируем сайт
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/mktu
rm -f /etc/nginx/sites-enabled/default  # убираем дефолтный сайт

# Проверяем конфиг и перезагружаем
nginx -t && systemctl reload nginx
echo -e "${GREEN}✓ Nginx настроен на домен: $DOMAIN${NC}"

# ============================================================================
# Шаг 6: Let's Encrypt SSL (только если есть домен, не IP)
# ============================================================================
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔒 Шаг 6/6: SSL-сертификат Let's Encrypt${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"

# Проверяем, что домен — это не IP-адрес
if [[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${YELLOW}⚠ Используется IP-адрес ($DOMAIN) — SSL не получится.${NC}"
  echo -e "${YELLOW}  Для HTTPS нужен домен. Сайт будет доступен по http://$DOMAIN${NC}"
  echo -e "${YELLOW}  Привяжите домен к этому IP и запустите скрипт снова.${NC}"
else
  # Устанавливаем Certbot
  if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}→ Устанавливаю Certbot...${NC}"
    apt-get install -y -qq certbot python3-certbot-nginx
  else
    echo -e "${GREEN}✓ Certbot уже установлен${NC}"
  fi

  echo -e "${YELLOW}→ Получаю SSL-сертификат для $DOMAIN...${NC}"
  echo -e "${YELLOW}  (это может занять 30-60 секунд)${NC}"

  # Запрашиваем сертификат
  certbot --nginx \
    -d "$DOMAIN" \
    --non-interactive \
    --agree-tos \
    --register-unsafely-without-email \
    --redirect \
    || {
      echo -e "${RED}⚠ Не удалось автоматически получить SSL.${NC}"
      echo -e "${YELLOW}  Возможные причины:${NC}"
      echo -e "${YELLOW}  1. Домен $DOMAIN ещё не указывает на этот сервер${NC}"
      echo -e "${YELLOW}  2. Порты 80/443 закрыты фаерволом${NC}"
      echo -e "${YELLOW}  3. DNS ещё не обновился (подождите 10-30 минут)${NC}"
      echo ""
      echo -e "${YELLOW}  Сайт доступен по http://$DOMAIN${NC}"
      echo -e "${YELLOW}  После настройки DNS запустите: sudo certbot --nginx -d $DOMAIN${NC}"
    }

  # Проверяем автопродление
  echo -e "${YELLOW}→ Проверяю автопродление...${NC}"
  certbot renew --dry-run --quiet && \
    echo -e "${GREEN}✓ Автопродление настроено${NC}" || \
    echo -e "${YELLOW}⚠ Проверьте автопродление: sudo certbot renew --dry-run${NC}"
fi

# ============================================================================
# Финал — показываем результат
# ============================================================================
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    ✅  УСТАНОВКА ЗАВЕРШЕНА                    ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"

if [[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${CYAN}║  🌐 Сайт:         ${GREEN}http://$DOMAIN${NC}                    ${CYAN}║${NC}"
else
  echo -e "${CYAN}║  🌐 Сайт:         ${GREEN}https://$DOMAIN${NC}                   ${CYAN}║${NC}"
fi
echo -e "${CYAN}║  📊 API статус:   ${GREEN}https://$DOMAIN/api/ai-chat${NC}        ${CYAN}║${NC}"
echo -e "${CYAN}║  📁 Проект:       $PROJECT_DIR                       ${CYAN}║${NC}"
echo -e "${CYAN}║  🐳 Контейнер:    mktu (запущен, автоперезапуск)     ${CYAN}║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  Полезные команды:                                           ║${NC}"
echo -e "${CYAN}║  • Логи:          ${YELLOW}docker logs -f mktu${NC}               ${CYAN}║${NC}"
echo -e "${CYAN}║  • Перезапуск:    ${YELLOW}docker restart mktu${NC}               ${CYAN}║${NC}"
echo -e "${CYAN}║  • Стоп:          ${YELLOW}docker stop mktu${NC}                  ${CYAN}║${NC}"
echo -e "${CYAN}║  • Обновление:    ${YELLOW}cd $PROJECT_DIR && git pull && docker build -t mktu:latest . && docker restart mktu${NC} ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${GREEN}🎉 Готово! Откройте сайт в браузере.${NC}"
echo -e "${YELLOW}💡 Если сайт не открывается:${NC}"
echo -e "   1. Проверьте, что порты 80 и 443 открыты в фаерволе SmartApe"
echo -e "   2. Если используете домен — убедитесь, что DNS указывает на этот IP"
echo -e "   3. Подождите 5-10 минут (DNS может обновляться)"
echo ""
echo -e "${YELLOW}📖 Логи Nginx: /var/log/nginx/mktu-*.log${NC}"
echo -e "${YELLOW}📖 Логи приложения: docker logs mktu${NC}"
