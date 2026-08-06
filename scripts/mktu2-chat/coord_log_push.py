#!/usr/bin/env python3
"""Записать событие в STATE.json + AUDIT_LOG.md coordination-репо."""
import json
import sys
import subprocess
from datetime import datetime, timezone
from pathlib import Path

REPO = Path('/home/z/my-project/vps-coordination-repo')
CHAT_ID = 'mktu2-chat'
ACTION = sys.argv[1] if len(sys.argv) > 1 else 'DEPLOY'
DETAILS = sys.argv[2] if len(sys.argv) > 2 else 'deploy'
FILES = sys.argv[3] if len(sys.argv) > 3 else ''


def run(cmd, cwd=REPO, check=True):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if check and r.returncode != 0:
        print(f'FAILED: {" ".join(cmd)}\nstdout: {r.stdout}\nstderr: {r.stderr}', file=sys.stderr)
        sys.exit(1)
    return r


def now_iso():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def main():
    print('[1/3] git fetch + pull...')
    run(['git', 'fetch', 'origin'])
    run(['git', 'pull', '--rebase', 'origin', 'main'])

    print('[2/3] updating STATE.json + AUDIT_LOG.md...')
    state_path = REPO / 'STATE.json'
    state = json.loads(state_path.read_text())

    # Обновим sites.мкту.рус status
    MKTU_DOMAIN = 'xn--j1adte.xn--p1acf'
    if 'sites' in state and MKTU_DOMAIN in state.get('sites', {}):
        state['sites'][MKTU_DOMAIN]['status'] = 'running'
        state['sites'][MKTU_DOMAIN]['last_deploy'] = now_iso()
        state['sites'][MKTU_DOMAIN]['pm2_name'] = 'mktu'
        state['sites'][MKTU_DOMAIN]['port'] = 3000

    # known_issues — очистим iznaki-pending-deploy
    if 'known_issues' in state:
        state['known_issues'] = [i for i in state['known_issues'] if 'mktu-pending' not in str(i).lower()]

    history = state.setdefault('history', [])
    history.insert(0, {
        'ts': now_iso(),
        'session': CHAT_ID,
        'action': ACTION,
        'scope': 'mktu',  # PM2 name
        'details': DETAILS,
        'files': FILES,
    })
    state['updated_at'] = now_iso()
    state_path.write_text(json.dumps(state, indent=2, ensure_ascii=False) + '\n')

    audit_path = REPO / 'AUDIT_LOG.md'
    audit = audit_path.read_text()
    new_line = f'\n[{now_iso()}] {ACTION} by {CHAT_ID}: {DETAILS}'
    if FILES:
        new_line += f' (files: {FILES})'
    new_line += '\n'
    parts = audit.split('---', 1)
    if len(parts) == 2:
        audit = parts[0] + '---' + new_line + parts[1]
    else:
        audit = audit + new_line
    audit_path.write_text(audit)

    print('[3/3] commit + push...')
    run(['git', 'add', 'STATE.json', 'AUDIT_LOG.md'])
    run(['git', 'commit', '-m', f'{ACTION} by {CHAT_ID}: {DETAILS}'])

    for attempt in range(3):
        r = run(['git', 'push', 'origin', 'main'], check=False)
        if r.returncode == 0:
            print(f'{ACTION} LOGGED AND PUSHED')
            return
        print(f'[retry {attempt+1}] pull --rebase...')
        run(['git', 'pull', '--rebase', 'origin', 'main'])

    print('FATAL: could not push', file=sys.stderr)
    sys.exit(1)


if __name__ == '__main__':
    main()
