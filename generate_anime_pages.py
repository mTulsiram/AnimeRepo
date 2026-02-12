#!/usr/bin/env python3
"""
Generate static HTML pages for each anime from anime-offline-database-minified.json
Creates an anime/ folder with individual HTML files for each anime
"""

import json
import os
from pathlib import Path
from urllib.parse import quote
import sys

class AnimePageGenerator:
    def __init__(self, output_dir='anime'):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.generated_pages = 0
        self.failed_pages = 0
        
    def load_anime_data(self, json_file):
        """Load anime data from JSON file"""
        try:
            print(f"📥 Loading {json_file}...")
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Extract anime list based on structure
            if isinstance(data, dict):
                anime_list = data.get('data', [])
            else:
                anime_list = data
            
            print(f"✅ Loaded {len(anime_list)} anime")
            return anime_list
        except Exception as e:
            print(f"❌ Error loading {json_file}: {e}")
            return []
    
    def generate_anime_page(self, anime):
        """Generate HTML page for a single anime"""
        try:
            title = anime.get('title', 'Unknown')
            
            # Create safe filename
            safe_filename = quote(title, safe='')[:100] + '.html'
            file_path = self.output_dir / safe_filename
            
            # Extract data with fallbacks
            sources = anime.get('sources', [])
            anime_type = anime.get('type', 'UNKNOWN')
            episodes = anime.get('episodes', 'Unknown')
            status = anime.get('status', 'UNKNOWN')
            picture = anime.get('picture', '')
            thumbnail = anime.get('thumbnail', '')
            duration = anime.get('duration', {})
            score = anime.get('score', {})
            synonyms = anime.get('synonyms', [])
            studios = anime.get('studios', [])
            producers = anime.get('producers', [])
            tags = anime.get('tags', [])
            season = anime.get('animeSeason', {})
            
            # Calculate duration in minutes
            duration_secs = duration.get('value', 0) if isinstance(duration, dict) else 0
            duration_mins = duration_secs // 60 if duration_secs else 0
            
            # Format score
            score_avg = score.get('arithmeticMean', 0) if isinstance(score, dict) else 0
            
            # Create HTML
            html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{self.escape_html(title)} - Anime Database</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        
        .container {{
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }}
        
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }}
        
        .header a {{
            color: white;
            text-decoration: none;
            margin-bottom: 20px;
            display: inline-block;
            font-size: 14px;
        }}
        
        .header-title {{
            font-size: 32px;
            font-weight: bold;
            margin: 20px 0;
        }}
        
        .content {{
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 30px;
            padding: 30px;
        }}
        
        .sidebar {{
            text-align: center;
        }}
        
        .poster {{
            width: 100%;
            max-width: 250px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            margin-bottom: 20px;
        }}
        
        .meta-section {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            text-align: left;
        }}
        
        .meta-label {{
            font-weight: bold;
            color: #667eea;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }}
        
        .meta-value {{
            font-size: 14px;
            color: #333;
        }}
        
        .main {{
            display: flex;
            flex-direction: column;
            gap: 20px;
        }}
        
        .section {{
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
        }}
        
        .section:last-child {{
            border-bottom: none;
        }}
        
        .section-title {{
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }}
        
        .score-display {{
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #fff3cd;
            padding: 10px 15px;
            border-radius: 6px;
            font-weight: bold;
            color: #856404;
        }}
        
        .score-value {{
            font-size: 24px;
        }}
        
        .tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }}
        
        .tag {{
            display: inline-block;
            background: #e9ecef;
            color: #495057;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
        }}
        
        .sources {{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }}
        
        .source-link {{
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 8px 15px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 12px;
            transition: all 0.3s;
        }}
        
        .source-link:hover {{
            background: #764ba2;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }}
        
        @media (max-width: 768px) {{
            .content {{
                grid-template-columns: 1fr;
            }}
            
            .header-title {{
                font-size: 24px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="../index.html">← Back to Database</a>
            <div class="header-title">{self.escape_html(title)}</div>
        </div>
        
        <div class="content">
            <div class="sidebar">
                {f'<img src="{picture}" alt="{self.escape_html(title)}" class="poster">' if picture else '<div class="poster" style="background:#ddd;display:flex;align-items:center;justify-content:center;font-size:48px;">📺</div>'}
                
                <div class="meta-section">
                    <div class="meta-label">Type</div>
                    <div class="meta-value">{anime_type}</div>
                </div>
                
                <div class="meta-section">
                    <div class="meta-label">Episodes</div>
                    <div class="meta-value">{episodes}</div>
                </div>
                
                <div class="meta-section">
                    <div class="meta-label">Status</div>
                    <div class="meta-value">{status}</div>
                </div>
                
                {f'''<div class="meta-section">
                    <div class="meta-label">Year</div>
                    <div class="meta-value">{season.get('year', 'Unknown')}</div>
                </div>''' if season.get('year') else ''}
                
                {f'''<div class="meta-section">
                    <div class="meta-label">Season</div>
                    <div class="meta-value">{season.get('season', 'Unknown')}</div>
                </div>''' if season.get('season') else ''}
                
                {f'<div class="meta-section"><div class="meta-label">Duration</div><div class="meta-value">{duration_mins} mins/ep</div></div>' if duration_mins else ''}
            </div>
            
            <div class="main">
                <div class="section">
                    <div class="section-title">Rating</div>
                    <div class="score-display">
                        <span class="score-value">{score_avg:.2f}</span>
                        <span>/ 10</span>
                    </div>
                </div>
                
                {f'''<div class="section">
                    <div class="section-title">Studios</div>
                    <p>{', '.join([s.title() for s in studios]) or 'Unknown'}</p>
                </div>''' if studios else ''}
                
                {f'''<div class="section">
                    <div class="section-title">Producers</div>
                    <p>{', '.join([p.title() for p in producers]) or 'Unknown'}</p>
                </div>''' if producers else ''}
                
                {f'''<div class="section">
                    <div class="section-title">Genres & Tags</div>
                    <div class="tags">
                        {chr(10).join([f'<span class="tag">{self.escape_html(tag)}</span>' for tag in tags[:15]])}
                    </div>
                </div>''' if tags else ''}
                
                {f'''<div class="section">
                    <div class="section-title">Synonyms</div>
                    <p>{', '.join(synonyms[:10]) or 'None'}</p>
                </div>''' if synonyms else ''}
                
                <div class="section">
                    <div class="section-title">External Links</div>
                    <div class="sources">
                        {chr(10).join([f'<a href="{source}" target="_blank" class="source-link">{self.extract_source_name(source)}</a>' for source in sources[:10]])}
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>"""
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html)
            
            self.generated_pages += 1
            return True
            
        except Exception as e:
            self.failed_pages += 1
            print(f"❌ Error generating page for {anime.get('title', 'Unknown')}: {e}")
            return False
    
    def escape_html(self, text):
        """Escape HTML special characters"""
        if not text:
            return ""
        return str(text).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#39;')
    
    def extract_source_name(self, url):
        """Extract source name from URL"""
        if 'myanimelist' in url:
            return 'MyAnimeList'
        elif 'anilist' in url:
            return 'AniList'
        elif 'anidb' in url:
            return 'AniDB'
        elif 'kitsu' in url:
            return 'Kitsu'
        elif 'anime-planet' in url:
            return 'Anime Planet'
        elif 'anidb' in url:
            return 'AniDB'
        else:
            return 'View'
    
    def generate_all(self, json_file, chunk_size=1000):
        """Generate pages in chunks"""
        anime_list = self.load_anime_data(json_file)
        
        print(f"\n📊 Starting generation of {len(anime_list)} anime pages...")
        print(f"💾 Output directory: {self.output_dir.absolute()}\n")
        
        for i, anime in enumerate(anime_list):
            if i % chunk_size == 0 and i > 0:
                print(f"✅ Generated {i}/{len(anime_list)} pages ({100*i//len(anime_list)}%)")
            
            self.generate_anime_page(anime)
        
        print(f"\n{'='*70}")
        print(f"✅ Generation complete!")
        print(f"   Total generated: {self.generated_pages}")
        print(f"   Failed: {self.failed_pages}")
        print(f"   Location: {self.output_dir.absolute()}")
        print(f"{'='*70}\n")
        
        return self.generated_pages

if __name__ == '__main__':
    generator = AnimePageGenerator()
    generator.generate_all('anime-offline-database-minified.json', chunk_size=5000)
