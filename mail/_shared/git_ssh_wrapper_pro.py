#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GIT_SSSH-обёртка на paramiko — ИСПРАВЛЕННАЯ (v2, «двунаправленная прокачка»).

Почему старая висла: git-receive-pack — ДВУНАПРАВЛЕННЫЙ поток. Если обёртка
сначала целиком льёт stdin (packfile) и только потом читает stdout, канал
мертвится: сервер шлёт статус/прогресс в stdout, окно канала переполняется,
оба ждут друг друга (sideband disconnect). Лечение: stdout и stderr качают
ФОНОВЫЕ ПОТОКИ, запущенные ДО отправки stdin; stdin льём через os.read
(порциями по мере поступления); в конце shutdown_write.

Установка:
  chmod +x git_ssh_wrapper_pro.py
  export GIT_SSH=/полный/путь/git_ssh_wrapper_pro.py
  export GIT_SSH_KEY=/полный/путь/robot-<сайт>     # приватный ключ деплой-ключа
  # (опц.) export GIT_SSH_HOSTKEY_FP='SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU'
  git fetch origin
  git push --no-thin origin HEAD:main

Опционально можно пин отпечатка сервера (GIT_SSH_HOSTKEY_FP): если задан и
не совпал — обёртка умирает до авторизации.
"""
import os
import sys
import time
import socket
import threading

import paramiko

RC_AUTH = 255


def die(msg):
    sys.stderr.write("git-ssh-wrapper-pro: " + msg + "\n")
    sys.exit(RC_AUTH)


def load_key(path):
    for cls in (paramiko.Ed25519Key, paramiko.RSAKey, paramiko.ECDSAKey):
        try:
            return cls.from_private_key_file(path)
        except Exception:
            continue
    return None


def main():
    args = sys.argv[1:]
    port = 22
    while args and args[0].startswith("-"):
        a = args.pop(0)
        if a == "-p":
            port = int(args.pop(0))
        elif a == "-o":
            args.pop(0)  # опции git'а игнорируем
        # остальное (-4/-6/-v) тоже игнорируем
    if len(args) < 2:
        die("ожидался вызов от git: wrapper host command")
    host, cmd = args[0], args[1]
    # git передаёт user@host одной строкой (git@github.com) — user отрезаем:
    if "@" in host:
        host = host.split("@", 1)[1]

    if not cmd.startswith(("git-upload-pack", "git-upload-archive", "git-receive-pack")):
        die("прокидываю только git-команды, получено: " + cmd[:60])

    key_path = os.environ.get("GIT_SSH_KEY", "")
    if not key_path or not os.path.exists(key_path):
        die("задай GIT_SSH_KEY=/полный/путь/robot-ключ")
    key = load_key(key_path)
    if key is None:
        die("не смог загрузить ключ: " + key_path)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(host, port=port, username="git", pkey=key,
                       look_for_keys=False, allow_agent=False,
                       timeout=30, banner_timeout=60, auth_timeout=30)
    except Exception as e:
        die("connect/auth: " + repr(e))

    if os.environ.get("GIT_SSH_HOSTKEY_FP"):
        hk = client.get_transport().get_remote_server_key()
        import base64 as b64mod
        import hashlib as hl
        fp = "SHA256:" + b64mod.b64encode(hl.sha256(hk.get_fingerprint()).digest()).decode().rstrip("=")
        if fp != os.environ["GIT_SSH_HOSTKEY_FP"]:
            die("отпечаток сервера " + fp + " != ожидаемого, отменяю")

    chan = client.get_transport().open_session()
    chan.settimeout(120.0)
    chan.exec_command(cmd)

    def pump_out():
        try:
            while True:
                try:
                    d = chan.recv(32768)
                except socket.timeout:
                    continue
                if not d:
                    break
                sys.stdout.buffer.write(d)
                sys.stdout.buffer.flush()
        except Exception:
            pass

    def pump_err():
        try:
            while True:
                try:
                    d = chan.recv_stderr(32768)
                except socket.timeout:
                    continue
                if not d:
                    break
                sys.stderr.buffer.write(d)
                sys.stderr.buffer.flush()
        except Exception:
            pass

    t_out = threading.Thread(target=pump_out, daemon=True)
    t_err = threading.Thread(target=pump_err, daemon=True)
    t_out.start()
    t_err.start()

    # stdin -> канал: git льёт packfile, читаем по мере поступления
    try:
        while True:
            d = os.read(0, 65536)
            if not d:
                break
            while d:
                sent = chan.send(d)
                if sent <= 0:
                    raise IOError("channel send blocked/failed")
                d = d[sent:]
        try:
            chan.shutdown_write()
        except Exception:
            pass
    except Exception:
        pass

    rc = RC_AUTH
    for _ in range(300):
        st = chan.exit_status_ready()
        if st:
            rc = chan.recv_exit_status()
            break
        if not t_out.is_alive() and chan.eof_received:
            rc = chan.recv_exit_status()
            break
        time.sleep(0.1)
    else:
        rc = chan.recv_exit_status() if chan.exit_status_ready() else RC_AUTH

    t_out.join(timeout=60)
    t_err.join(timeout=10)
    try:
        client.close()
    except Exception:
        pass
    sys.exit(rc)


if __name__ == "__main__":
    main()
