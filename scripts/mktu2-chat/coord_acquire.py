#!/usr/bin/env python3
"""Взять lock в coordination-репо."""
import json
import sys
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO = Path('/home/z/my-project/vps-coordination-repo')
SESSION_ID = 'mktu2-chat-2026-08-05'
CHAT_ID = 'mktu2-chat'

SCOPE = sys.argv[1] if len(sys.argv) > 1 else 'vps-shared'
PURPOSE = sys.argv[2] if len(sys.argv) > 2 else 'security incident'
TTL_SECONDS = 900


def run(cmd, cwd=REPO, check=True):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if check and r.returncode != 0:
        print(f'FAILED: {" ".join(cmd)}\nstdout: {r.stdout}\nstderr: {r.stderr}', file=sys.stderr)
        sys.exit(1)
    return r


def now_iso():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def now_plus_ttl_iso():
    return (datetime.now(timezone.utc) + timedelta(seconds=TTL_SECONDS)).strftime('%Y-%m-%dT%H:%M:%SZ')


def main():
    print('[1/5] git fetch + pull...')
    run(['git', 'fetch', 'origin'])
    run(['git', 'pull', '--rebase', 'origin', 'main'])

    print('[2/5] reading STATE.json...')
    state_path = REPO / 'STATE.json'
    state = json.loads(state_path.read_text())

    lock = state.get('lock', {})
    if lock.get('held_by'):
        exp = lock.get('expires_at')
        if exp:
            exp_dt = datetime.fromisoformat(exp.replace('Z', '+00:00'))
            if exp_dt > datetime.now(timezone.utc):
                print(f'ERROR: lock held by {lock["held_by"]}, scope={lock.get("scope")}, expires_at={exp}', file=sys.stderr)
                print(f'Purpose: {lock.get("purpose")}', file=sys.stderr)
                sys.exit(2)
            else:
                print(f'[warn] previous lock from {lock["held_by"]} EXPIRED at {exp} — force-take')
        else:
            print(f'ERROR: lock held by {lock["held_by"]} without expires_at', file=sys.stderr)
            sys.exit(2)

    print('[3/5] acquiring lock...')
    state['lock'] = {
        'held_by': CHAT_ID,
        'session_id': SESSION_ID,
        'acquired_at': now_iso(),
        'expires_at': now_plus_ttl_iso(),
        'ttl_seconds': TTL_SECONDS,
        'scope': SCOPE,
        'purpose': PURPOSE,
    }
    state['updated_at'] = now_iso()

    history = state.setdefault('history', [])
    history.insert(0, {
        'ts': now_iso(),
        'session': CHAT_ID,
        'action': 'LOCK_ACQUIRED',
        'scope': SCOPE,
        'details': PURPOSE,
    })

    state_path.write_text(json.dumps(state, indent=2, ensure_ascii=False) + '\n')

    print('[4/5] updating AUDIT_LOG.md...')
    audit_path = REPO / 'AUDIT_LOG.md'
    audit = audit_path.read_text()
    new_line = f'\n[{now_iso()}] LOCK_ACQUIRED by {CHAT_ID} (scope={SCOPE}): {PURPOSE}\n'
    parts = audit.split('---', 1)
    if len(parts) == 2:
        audit = parts[0] + '---' + new_line + parts[1]
    else:
        audit = audit + new_line
    audit_path.write_text(audit)

    print('[5/5] git commit + push...')
    run(['git', 'add', 'STATE.json', 'AUDIT_LOG.md'])
    run(['git', 'commit', '-m', f'Lock acquired by {CHAT_ID} scope={SCOPE}: {PURPOSE}'])

    for attempt in range(3):
        r = run(['git', 'push', 'origin', 'main'], check=False)
        if r.returncode == 0:
            print('LOCK ACQUIRED SUCCESSFULLY')
            print(f'  held_by: {CHAT_ID}')
            print(f'  scope: {SCOPE}')
            print(f'  expires_at: {state["lock"]["expires_at"]}')
            return
        print(f'[retry {attempt+1}] push failed, pull --rebase and retry...')
        run(['git', 'pull', '--rebase', 'origin', 'main'])

    print('FATAL: could not push lock after 3 attempts', file=sys.stderr)
    sys.exit(1)


if __name__ == '__main__':
    main()
