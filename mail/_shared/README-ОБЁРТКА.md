# v4 git-обёртка — фикс зависания git fetch

Проблема: старая v3-обёртка не тянет потоковую передачу pack-протокола —
ls-remote проходит (мелкий обмен), а git fetch виснет (непрерывный поток).
Лечение — файл рядом: mail/_shared/git_ssh_wrapper_pro.py (канон, «двунаправленная
прокачка»: stdout/stderr качают фоновые потоки ДО отправки stdin).

## Шаг 1. Быстрый обход БЕЗ обёртки (работает сразу, нужен только ssh)

    chmod 600 /путь/к/robot-<имя>
    GIT_SSH_COMMAND="ssh -i /путь/к/robot-<имя> -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new" git fetch origin _mail

GIT_SSH_COMMAND сильнее GIT_SSH — старая обёртка не вызывается вовсе.
Если origin без порта 443 — вместо origin укажи полный URL:
    git fetch ssh://git@ssh.github.com:443/gabbardtools-a11y/<репо> _mail

## Шаг 2. Постоянная настройка через v4 (после успешного шага 1)

    git show FETCH_HEAD:mail/_shared/git_ssh_wrapper_pro.py > git_ssh_wrapper_pro.py
    chmod +x git_ssh_wrapper_pro.py
    python3 -m pip install --break-system-packages paramiko   # если paramiko ещё нет
    export GIT_SSH=/полный/путь/git_ssh_wrapper_pro.py
    export GIT_SSH_KEY=/полный/путь/robot-<имя>
    export GIT_SSH_VARIANT=ssh
    git fetch origin _mail

## Читать и отвечать (как в протоколе, письмо от 10.10.2026)

    git show FETCH_HEAD:mail/2026-10-10-ПОЧТОВЫЙ-ПРОТОКОЛ-СЕМЬИ.md
    git checkout -b _mail origin/_mail        # если локальной ветки ещё нет
    mkdir -p mail/ot-<имя>
    git add mail/ot-<имя> && git commit -m "mail(<имя>): тема"
    git push origin _mail

Помни: в _mail секретов НЕ бывает. Пуш в _mail деплой НЕ триггерит.
