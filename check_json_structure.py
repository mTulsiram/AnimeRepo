#!/usr/bin/env python3
import json

files = [
    'myanimelist-minified.json',
    'anilist-minified.json',
    'kitsu-minified.json',
    'anidb-minified.json',
    'animenewsnetwork-minified.json'
]

for f in files:
    try:
        d = json.load(open(f))
        if isinstance(d, dict):
            keys = list(d.keys())
            print(f"\n{f}:")
            print(f"  Root keys: {keys}")
            for key in keys:
                if isinstance(d[key], list):
                    print(f"  '{key}' list: {len(d[key])} items")
                elif isinstance(d[key], dict):
                    print(f"  '{key}' dict: {len(d[key])} items")
        elif isinstance(d, list):
            print(f"\n{f}: List with {len(d)} items")
    except Exception as e:
        print(f"\n{f}: Error - {e}")
