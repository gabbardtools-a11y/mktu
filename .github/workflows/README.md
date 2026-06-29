# GitHub Actions — мкту.рус

Автоматизация деплоя и бэкапов через GitHub Actions.

## 📁 Workflows

| Файл | Когда | Что делает |
|---|---|---|
| `deploy.yml` | `git push` в `main`, релиз, вручную | Собирает Next.js → деплоит на VPS → health check |
| `backup-db.yml` | Каждый день 03:00 UTC, вручную | Дамп SQLite → коммитит в ветку `db-backups` |

## 🔧 Настройка (один раз)

### 1. Добавить Secrets в репозиторий

GitHub → `gabbardtools-a11y/mktu` → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Имя секрета | Значение |
|---|---|
| `VPS_PASSWORD` | `iY4nY2rV7hqL` (пароль root на VPS) |
| `ROUTERAI_API_KEY` | `sk-vYu9e0NIHwEgj9AZuVOiPPtB__TiK0A5` |

### 2. Создать ветку `db-backups` для nightly-бэкапов БД

```bash
git checkout -b db-backups
git push -u origin db-backups
git checkout main
```

Эта ветка будет хранить `db-backup-YYYY-MM-DD.sql` файлы (хранение 30 дней).

## 🚀 Использование деплоя

### Автоматически (после `git push`)

```bash
git add .
git commit -m "Feature: что-то новое"
git push origin main
```

Дальше GitHub сам:
1. Поднимает Ubuntu-контейнер (7 ГБ RAM, без OOM как на VPS)
2. Ставит Node.js 20
3. `npm ci` + `npm run build`
4. Упаковывает standalone в tarball
5. Бэкапит текущую версию на VPS → `/var/www/mktu.bak.<timestamp>`
6. Заливает tarball, распаковывает
7. Пишет `.env` с секретами
8. `pm2 reload mktu`
9. Health check `https://мкту.рус/` — ожидает 200

**Время:** ~2-3 минуты от push до готового прода.

### Вручную (кнопкой)

GitHub → `mktu` → **Actions** → **Deploy to VPS** → **Run workflow** → кнопка.

### По тегу (release)

```bash
git tag v1.2.3
git push origin v1.2.3
# или создать Release в GitHub UI — тоже триггернет деплой
```

## 💾 Бэкапы БД

### Автоматически (каждую ночь)

В 03:00 UTC (06:00 МСК) GitHub:
1. Подключается к VPS
2. `sqlite3 /var/www/mktu/db/custom.db .dump` → SQL-дамп
3. Коммитит в ветку `db-backups` как `db-backup-YYYY-MM-DD.sql`
4. Удаляет файлы старше 30 дней

Смотреть историю: https://github.com/gabbardtools-a11y/mktu/tree/db-backups

### Восстановление из бэкапа

```bash
# Скачать дамп
curl -O https://raw.githubusercontent.com/gabbardtools-a11y/mktu/db-backups/db-backup-2026-06-29.sql

# Залить на VPS
scp db-backup-2026-06-29.sql root@91.219.151.57:/tmp/

# На VPS — остановить приложение и восстановить
ssh root@91.219.151.57
pm2 stop mktu
sqlite3 /var/www/mktu/db/custom.db < /tmp/db-backup-2026-06-29.sql
pm2 start mktu
```

## 📊 Мониторинг

- **Статус последних запусков:** https://github.com/gabbardtools-a11y/mktu/actions
- **Лог конкретного запуска:** клик по workflow run →_details
- **Email-уведомления:** GitHub шлёт email если workflow упал
- **Бейдж статуса** (можно вставить в README):
  ```markdown
  ![Deploy](https://github.com/gabbardtools-a11y/mktu/actions/workflows/deploy.yml/badge.svg)
  ```

## ⚠️ Координация с другими чатами

**Перед деплоем через GitHub Actions** — проверяйте lock в `gabbardtools-a11y/vps-coordination/STATE.json`. Если iznaki-chat / naytea-chat / seismos-chat сейчас деплоят — подождите.

GitHub Actions **не умеет** брать lock автоматически (пока). Это ручная ответственность.

## 🆘 Если что-то сломалось

### Деплой упал

1. Открыть https://github.com/gabbardtools-a11y/mktu/actions
2. Кликнуть на упавший run → details
3. Найти шаг с красным крестиком — там лог ошибки
4. Если `.env` не записался — проверить что секреты `VPS_PASSWORD` и `ROUTERAI_API_KEY` добавлены
5. Если health check не прошёл — проверить `pm2 logs mktu` на VPS

### Откатиться назад

```bash
ssh root@91.219.151.57
pm2 stop mktu
rm -rf /var/www/mktu
mv /var/www/mktu.bak.<timestamp> /var/www/mktu
pm2 reload mktu
```

Или через локальный скрипт (старый способ): `python3 scripts/deploy-mktu.py`.

## 🆚 Сравнение с локальным скриптом

| | Локальный `deploy-mktu.py` | GitHub Actions |
|---|---|---|
| Где собирается | Sandbox (мало RAM) | GitHub runner (7 ГБ) |
| Где хранятся секреты | `.env` локально | GitHub Secrets |
| Запуск | `python3 scripts/deploy-mktu.py` | `git push` |
| Виден другим | Нет | Да, в Actions tab |
| История запусков | В логах VPS | В GitHub UI |
| OOM при сборке | Возможен | Невозможен |
| Работает офлайн | Да | Нет |

**Рекомендация:** GitHub Actions — основной способ, локальный скрипт — fallback если GitHub недоступен.
