#!/usr/bin/env python3
"""Extract MKTU class data from Next.js static chunk JS file."""

import re
import json
import os

JS_PATH = '/home/z/my-project/mktu-extracted/_next/static/chunks/ea88a3293ac6548b.js'
OUT_PATH = '/home/z/my-project/scripts/mktu_data.json'

with open(JS_PATH, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Find start of the classes array
start_marker = 'let h=[{id:1,name:"Класс 1"'
start_idx = content.find(start_marker)
if start_idx < 0:
    raise SystemExit("Cannot find data start")

# Find end of array - look for `];` after start
# We need to find balanced brackets. Walk forward counting brackets.
# Start at the `[` after `let h=`
arr_start = content.find('[', start_idx)
assert arr_start == start_idx + len('let h=')

depth = 0
i = arr_start
in_str = False
str_char = None
escape = False
end_idx = None
while i < len(content):
    ch = content[i]
    if in_str:
        if escape:
            escape = False
        elif ch == '\\':
            escape = True
        elif ch == str_char:
            in_str = False
    else:
        if ch == '"' or ch == "'":
            in_str = True
            str_char = ch
        elif ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                end_idx = i
                break
    i += 1

if end_idx is None:
    raise SystemExit("Cannot find end of array")

arr_text = content[arr_start:end_idx+1]
print(f"Array length: {len(arr_text)} chars")
print(f"Last 200 chars: {arr_text[-200:]!r}")

# Now parse: convert JS object literal to JSON.
# Replace bare keys with quoted keys, and unquoted values where needed.
# Strategy: regex transform.

# Step 1: Wrap keys like `id:` -> `"id":`
js_text = arr_text
# Quote bareword keys: id, name, shortName, description, type, items
for key in ['id', 'name', 'shortName', 'description', 'type', 'items']:
    pattern = r'(?<=[{,])\s*' + key + r'\s*:'
    replacement = '"' + key + '":'
    js_text = re.sub(pattern, replacement, js_text)

# Step 2: Convert single-quoted strings to double-quoted JSON strings.
# A single-quoted string is `'...'` where `...` may contain escaped `\'` and
# literal `"`. We need to convert it to `"..."` with all internal `"` escaped
# and `\'` -> `'`.
def convert_single_quoted(match):
    inner = match.group(1)
    # Unescape \' -> '
    inner = inner.replace("\\'", "'")
    # Escape " -> \"
    inner = inner.replace('"', '\\"')
    # Escape backslash (but not the ones we just added)
    # Actually, JSON requires \\ for literal backslash. The JS source may have
    # \\ already, so we don't touch other backslashes.
    return '"' + inner + '"'

# Match '...' but not greedy, and allow escaped \' inside
js_text = re.sub(r"'((?:[^'\\]|\\.)*)'", convert_single_quoted, js_text)

# Step 3: Try to parse JSON
try:
    data = json.loads(js_text)
    print(f"Successfully parsed {len(data)} classes")
except json.JSONDecodeError as e:
    print(f"JSON parse error: {e}")
    # Show context
    pos = e.pos
    print(f"Context around pos {pos}: {js_text[max(0,pos-100):pos+100]!r}")
    raise

# Verify class count and items
total_items = 0
for cls in data:
    items_count = len(cls.get('items', []))
    total_items += items_count
    print(f"Class {cls['id']:2d} ({cls['type']}): {items_count:4d} items - {cls['name']}")

print(f"\nTotal items: {total_items}")
print(f"Goods classes: {sum(1 for c in data if c['type'] == 'goods')}")
print(f"Services classes: {sum(1 for c in data if c['type'] == 'services')}")

# Save
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nSaved to {OUT_PATH}")
print(f"File size: {os.path.getsize(OUT_PATH)} bytes")
