#!/usr/bin/env python3
"""
Convert anime markdown data to JSON format for faster client-side filtering
"""

import json
import re
from pathlib import Path

def parse_markdown_to_json(markdown_file):
    """Parse markdown table and convert to JSON."""
    print(f"📖 Reading {markdown_file}...")
    
    with open(markdown_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    anime_data = []
    
    # Skip header lines (first 5 lines contain title and separator)
    for line in lines[5:]:
        line = line.strip()
        
        # Skip empty lines and lines that don't start with |
        if not line or not line.startswith('|'):
            continue
        
        # Split by | and clean up
        parts = [p.strip() for p in line.split('|')]
        parts = [p for p in parts if p]  # Remove empty strings
        
        if len(parts) < 6:
            continue
        
        try:
            anime = {
                'title': parts[0],
                'languages': parts[1],
                'genre': parts[2],
                'year': int(parts[3]),
                'type': parts[4],
                'rating': float(parts[5])
            }
            anime_data.append(anime)
        except (ValueError, IndexError) as e:
            print(f"⚠️  Skipping invalid row: {parts} - {e}")
            continue
    
    return anime_data

def save_json(data, output_file):
    """Save data to JSON file."""
    print(f"💾 Writing {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    file_size_mb = Path(output_file).stat().st_size / (1024 * 1024)
    print(f"✅ Saved {len(data)} anime ({file_size_mb:.2f} MB)")

def main():
    markdown_file = Path('../data/anime_database.md')
    json_file = Path('../data/anime_data.json')
    
    if not markdown_file.exists():
        print(f"❌ Error: {markdown_file} not found")
        return
    
    print("=" * 60)
    print("Anime Data Converter - Markdown to JSON")
    print("=" * 60)
    
    # Parse markdown
    anime_data = parse_markdown_to_json(str(markdown_file))
    
    # Save as JSON
    save_json(anime_data, str(json_file))
    
    print("=" * 60)
    print("✨ Conversion complete!")
    print(f"   Markdown: {markdown_file}")
    print(f"   JSON: {json_file}")

if __name__ == '__main__':
    main()
