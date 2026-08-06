# GitHub Actions — мкту.рус

Автоматизация деплоя и бэкапов через GitHub Actions.

## 📁 Workflows

| Файл | Когда | Что делает |
|---|---|---|
| `deploy.yml` | `git push` в `main` (по `src/**`, `package.json`, `package-lock.json`, `bun.lock`, конфигам) или вручную | Собирает Next.js → деплоит на VPS → health check (localhost + публичный домен) |
| `backup-db.yml` | Каждый день 03:00 UTC, вручную | Дамп SQLite → коммитит в ветку `db-backups` |

## 🔧 Настройка (один раз)

### 1. Secrets в репозитории

GitHub → `gabbardtools-a11y/mktu` → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Имя секрета | Значение |
|---|---|
| `VPS_HOST` | `188.127.227.250` |
| `VPS_USER` | `root` |
| `VPS_PORT` | `22` |
| `VPS_PASSWORD` | пароль root на VPS (см. ЗАКОН-1 §1) |
| `ROUTERAI_API_KEY` | `sk-...` (ключ RouterAI для ИИ-помощника) |

Управление секретами из CLI:

```bash
gh secret set VPS_HOST -R gabbardtools-a11y/mktu -b "188.127.227.250"
gh secret set VPS_USER -R gabbardtools-a11y/mktu -b "root"
gh secret set VPS_PORT -R gabbardtools-a11y/mktu -b "22"
gh secret set VPS_PASSWORD -R gabbardtools-a11y/mktu
gh secret set ROUTERAI_API_KEY -R gabbardtools-a11y/mktu
gh secret list -R gabbardtools-a11y/mktu
```

### 2. Ветка `db-backups` для nightly-бэкапов БД

```bash
git checkout -b db-backups
git push -u origin db-backups
git checkout main
```

Хранит `db-backup-YYYY-MM-DD.sql` файлы (хранение 30 дней, авто-очистка в workflow).

### 3. Lock-протокол перед деплоем (ОБЯЗАТЕЛЬНО)

GitHub Actions **не умеет** брать lock автоматически. Перед `git push` в `main`, который триггерит деплой, разработчик обязан:

```bash
# Проверить lock
curl -s -H "Authorization: token $GH_TOKEN" \
  https://raw.githubusercontent.com/gabbardtools-a11y/vps-coordination/main/STATE.json | jq '.lock'

# Если lock.held_by != null и scope пересекается с mktu — ждать
# Если свободен — взять lock (см. /home/z/my-project/scripts/coord_acquire.py)
python3 scripts/coord_acquire.py mktu "deploy: <что делаем>"

# ... git push ...

# После успешного деплоя — освободить lock
python3 scripts/coord_release.py "deploy done: <что сделали>"

# И записать в AUDIT_LOG
python3 scripts/coord_log_push.py DEPLOY "mktu: <что задеплоили>"
```

## 🚀 Использование деплоя

### Автоматически (после `git push`)

```bash
git add .
git commit -m "Feature: что-то новое"
git push origin main
```

Дальше GitHub сам:

1. Поднимает Ubuntu-контейнер (7 ГБ RAM, без OOM как на VPS)
2. Ставит Node.js 22 (соответствует VPS)
3. `npm ci` (требуется `package-lock.json` — он в репо)
4. `npm run build` (включая копирование `src/data` в standalone)
5. Упаковывает standalone в tarball
6. Заливает tarball на VPS в `/tmp/`, распаковывает в `/var/www/mktu/`
7. Пишет `.env` с секретами (chmod 600)
8. `pm2 reload mktu` (или `pm2 start` если не запущен)
9. Health check `http://127.0.0.1:3000/` И `https://мкту.рус/` — ожидает 200 от обоих

**Время:** ~2-3 минуты от push до готового прода.

**Бэкап:** на VPS `.bak` НЕ создаётся (ЗАКОН §3.2 запрещает). Бэкап = git-история в `gabbardtools-a11y/mktu` (мы пушим перед деплоем) + ветка `db-backups` для ночных дампов БД.

### Вручную (кнопкой)

GitHub → `mktu` → **Actions** → **🚀 Deploy to VPS** → **Run workflow** → кнопка.

## 💾 Бэкапы БД

### Автоматически (каждую ночь)

В 03:00 UTC (06:00 МСК) GitHub:

1. Подключается к VPS по SSH
2. `sqlite3 /var/www/mktu/db/custom.db .dump` → SQL-дамп
3. Коммитит в ветку `db-backups` как `db-backup-YYYY-MM-DD.sql`
4. Удаляет файлы старше 30 дней

Смотреть историю: https://github.com/gabbardtools-a11y/mktu/tree/db-backups

### Восстановление из бэкапа

```bash
# Скачать дамп
curl -O https://raw.githubusercontent.com/gabbardtools-a11y/mktu/db-backups/db-backup-2026-08-05.sql

# Залить на VPS (через paramiko из sandbox — SSH-клиента нет)
/home/z/.venv/bin/python3 -c "
import paramiko
t = paramiko.Transport(('188.127.227.250', 22))
t.connect(username='root', password='bF2bB7eT4wdZ')
sftp = paramiko.SFTPClient.from_transport(t)
sftp.put('db-backup-2026-08-05.sql', '/tmp/db-backup.sql')
sftp.close(); t.close()
"

# На VPS — остановить приложение и восстановить
ssh root@188.127.227.250
pm2 stop mktu
sqlite3 /var/www/mktu/db/custom.db < /tmp/db-backup.sql
pm2 start mktu
```

## 📊 Мониторинг

- **Статус последних запусков:** https://github.com/gabbardtools-a11y/mktu/actions
- **Лог конкретного запуска:** клик по workflow run → details
- **Email-уведомления:** GitHub шлёт email если workflow упал
- **Бейдж статуса** (можно вставить в README):
  ```markdown
  ![Deploy](https://github.com/gabbardtools-a11y/mktu/actions/workflows/deploy.yml/badge.svg)
  ```

## 🆘 Если что-то сломалось

### Деплой упал

1. Открыть https://github.com/gabbardtools-a11y/mktu/actions
2. Кликнуть на упавший run → details
3. Найти шаг с красным крестиком — там лог ошибки
4. Частые причины:
   - `Dependencies lock file is not found` → `package-lock.json` не закоммичен. Запустить `npm install` локально, закоммитить `package-lock.json`.
   - `.env` не записался → проверить секреты `VPS_PASSWORD` и `ROUTERAI_API_KEY` (через `gh secret list`)
   - `VPS_HOST` пустой → секрет `VPS_HOST` не задан
   - health check failed → `pm2 logs mktu` на VPS

### Откатиться назад

Бэкапа `.bak` на VPS нет (ЗАКОН §3.2). Способы отката:

1. **Через git-историю** (предпочтительно): найти последний успешный коммит, `git revert` или `git push --force` (осторожно), дождаться автодеплоя.
2. **Через re-run предыдущего успешного workflow run**: GitHub → Actions → найти зелёный run → Re-run all jobs.
3. **Вручную через SSH** (если workflow сломан):
   ```bash
   /home/z/.venv/bin/python3 -c "
   import paramiko
   c = paramiko.SSHClient()
   c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
   c.connect('188.127.227.250', 22, 'root', 'bF2bB7eT4wdZ', allow_agent=False, look_for_keys=False)
   _, o, e = c.exec_command('cd /var/www/mktu && pm2 stop mktu && git fetch origin && git reset --hard origin/main~1 && pm2 restart mktu')
   print(o.read().decode()); print(e.read().decode())
   c.close()
   "
   ```

## 🆚 Сравнение стратегий деплоя

| | GitHub Actions (текущий) | Локальный `deploy-mktu-new-vps.py` (устаревший) |
|---|---|---|
| Где собирается | GitHub runner (7 ГБ RAM) | Sandbox (мало RAM) |
| Где хранятся секреты | GitHub Secrets | `.env` локально |
| Запуск | `git push` | `python3 scripts/deploy-mktu-new-vps.py` |
| Виден другим | Да, в Actions tab | Нет |
| История запусков | В GitHub UI | В логах VPS |
| OOM при сборке | Невозможен | Возможен |
| Требует paramiko | Нет | Да |

**Текущая стратегия:** GitHub Actions — единственный канал деплоя. Старый `deploy-mktu-new-vps.py` больше не используется (в репо его нет).
