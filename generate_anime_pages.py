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
    def __init__(self, output_dir='anime', minimal=False):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.generated_pages = 0
        self.failed_pages = 0
        self.language_dubs = self.load_language_dubs()
        self.minimal = minimal  # If True, output minimal HTML + external CSS/JS (no inline styles)
    
    def load_language_dubs(self):
        """Load language dubs mapping"""
        try:
            with open('language_dubs.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {'english_dubbed': [], 'hindi_dubbed': []}
    
    def get_anime_languages(self, title):
        """Determine which languages the anime is dubbed in"""
        languages = []
        if title in self.language_dubs.get('english_dubbed', []):
            languages.append('English Dubbed')
        if title in self.language_dubs.get('hindi_dubbed', []):
            languages.append('Hindi Dubbed')
        if not languages:
            languages.append('Subtitled')
        return languages
    
    def load_anime_data(self, jsonl_file):
        """Load anime data from JSONL file (one JSON object per line)"""
        try:
            print(f"📥 Loading {jsonl_file}...")
            anime_list = []
            with open(jsonl_file, 'r', encoding='utf-8') as f:
                # Skip metadata line
                f.readline()
                
                # Load each anime entry
                for line in f:
                    try:
                        anime = json.loads(line.strip())
                        anime_list.append(anime)
                    except json.JSONDecodeError:
                        continue
            
            print(f"✅ Loaded {len(anime_list)} anime")
            return anime_list
        except Exception as e:
            print(f"❌ Error loading {jsonl_file}: {e}")
            return []
    
    def generate_anime_page_minimal(self, anime):
        """Generate minimal HTML: external CSS/JS, embedded JSON. No inline styles."""
        try:
            title = anime.get('title', 'Unknown')
            safe_title = title.replace('/', '_').replace('\\', '_')
            safe_title = safe_title.replace('?', '').replace('*', '').replace(':', '_')
            safe_title = safe_title.replace('<', '').replace('>', '').replace('|', '_')
            for q in '"\'"\u201c\u201d\u201f\u2018\u2019\u201a`\u00b4':
                safe_title = safe_title.replace(q, '')
            safe_title = safe_title.strip()[:200]
            safe_filename = safe_title + '.html' if safe_title else 'Unknown.html'
            file_path = self.output_dir / safe_filename

            duration = anime.get('duration', {})
            duration_secs = duration.get('value', 0) if isinstance(duration, dict) else 0
            duration_mins = duration_secs // 60 if duration_secs else 0
            score = anime.get('score', {})
            score_avg = score.get('arithmeticMean', 0) if isinstance(score, dict) else 0
            payload = {
                'score_avg': score_avg,
                'duration_mins': duration_mins,
                'languages': self.get_anime_languages(title),
            }
            import json
            payload_anime = dict(anime)
            payload_anime['payload'] = payload
            json_str = json.dumps(payload_anime, ensure_ascii=False).replace('</', '<\\/')

            html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{self.escape_html(title)} - AnimeRepo</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="../assets/anime-detail.css">
</head>
<body>
<div id="anime-root"></div>
<script type="application/json" id="anime-data">{json_str}</script>
<script src="../assets/anime-detail.js"></script>
</body>
</html>'''
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html)
            self.generated_pages += 1
            return True
        except Exception as e:
            self.failed_pages += 1
            print(f"❌ Minimal page failed for {anime.get('title', 'Unknown')}: {e}")
            return False

    def generate_anime_page(self, anime):
        """Generate HTML page for a single anime"""
        if self.minimal:
            return self.generate_anime_page_minimal(anime)
        try:
            title = anime.get('title', 'Unknown')
            
            # Create safe filename - handle all special characters
            # Windows forbidden: < > : " / \ | ? *
            # Also handle smart quotes and other Unicode variants
            safe_title = title
            # Replace forward/backward slashes
            safe_title = safe_title.replace('/', '_').replace('\\', '_')
            # Remove or replace problematic chars
            safe_title = safe_title.replace('?', '').replace('*', '').replace(':', '_')
            safe_title = safe_title.replace('<', '').replace('>', '').replace('|', '_')
            # Handle all quote types (straight, smart, etc)
            safe_title = safe_title.replace('"', '').replace('"', '').replace('"', '')  # Smart quotes
            safe_title = safe_title.replace("'", '').replace("'", '').replace("'", '')  # Smart single quotes
            safe_title = safe_title.replace('`', '').replace('´', '')
            safe_title = safe_title.strip()
            
            safe_filename = safe_title[:200] + '.html'
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
            languages = self.get_anime_languages(title)
            
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
    <title>{self.escape_html(title)} - AnimeRepo v3.0</title>
    <meta name="description" content="Stream {self.escape_html(title)} online. Get watching links, ratings, reviews and more on AnimeRepo.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        :root {{
            --primary: #667eea;
            --secondary: #764ba2;
            --dark: #1a1a2e;
            --light: #f8f9fa;
            --text: #333;
            --border: #e0e0e0;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: var(--text);
            line-height: 1.6;
        }}
        
        .navbar {{
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }}
        
        .nav-back {{
            display: flex;
            align-items: center;
            gap: 15px;
        }}
        
        .nav-back a {{
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        
        .nav-back a:hover {{
            color: var(--secondary);
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px 20px;
        }}
        
        .hero {{
            position: relative;
            height: 300px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 40px;
            display: flex;
            align-items: flex-end;
            color: white;
        }}
        
        .hero::before {{
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
        }}
        
        .hero-content {{
            position: relative;
            z-index: 1;
            padding: 40px;
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 30px;
            align-items: end;
            width: 100%;
        }}
        
        .hero-poster {{
            width: 150px;
            height: 200px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }}
        
        .hero-poster img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }}
        
        .hero-title {{
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
        }}
        
        .hero-subtitle {{
            opacity: 0.9;
            font-size: 14px;
        }}
        
        .main-grid {{
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }}
        
        .sidebar {{
            display: flex;
            flex-direction: column;
            gap: 20px;
        }}
        
        .info-card {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        
        .info-card-title {{
            font-size: 12px;
            font-weight: bold;
            color: var(--primary);
            text-transform: uppercase;
            margin-bottom: 10px;
        }}
        
        .info-card-value {{
            font-size: 16px;
            color: var(--text);
            font-weight: 500;
        }}
        
        .score-card {{
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-align: center;
        }}
        
        .score-value {{
            font-size: 48px;
            font-weight: bold;
            margin: 10px 0;
        }}
        
        .score-label {{
            opacity: 0.9;
            font-size: 12px;
        }}
        
        .action-buttons {{
            display: flex;
            flex-direction: column;
            gap: 10px;
        }}
        
        .btn {{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 12px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s;
        }}
        
        .btn-primary {{
            background: var(--primary);
            color: white;
        }}
        
        .btn-primary:hover {{
            background: var(--secondary);
            transform: translateY(-2px);
        }}
        
        .btn-secondary {{
            background: white;
            color: var(--text);
            border: 2px solid var(--border);
        }}
        
        .btn-secondary:hover {{
            border-color: var(--primary);
            color: var(--primary);
        }}
        
        .content {{
            display: flex;
            flex-direction: column;
            gap: 30px;
        }}
        
        .section {{
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        
        .section-title {{
            font-size: 22px;
            font-weight: bold;
            color: var(--text);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        
        .section-title i {{
            color: var(--primary);
        }}
        
        .tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }}
        
        .tag {{
            background: #e9ecef;
            color: #495057;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
        }}
        
        .tag:hover {{
            background: var(--primary);
            color: white;
            cursor: pointer;
        }}
        
        .links-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }}
        
        .link-card {{
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            border: 2px solid var(--border);
            border-radius: 8px;
            text-decoration: none;
            color: var(--text);
            transition: all 0.3s;
            background: white;
        }}
        
        .link-card:hover {{
            border-color: var(--primary);
            background: #f8f9ff;
            transform: translateY(-4px);
        }}
        
        .link-card i {{
            font-size: 24px;
            color: var(--primary);
            min-width: 30px;
            text-align: center;
        }}
        
        .link-card-content h4 {{
            font-size: 14px;
            font-weight: 600;
            color: var(--text);
        }}
        
        .link-card-content p {{
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }}
        
        .share-buttons {{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }}
        
        .share-btn {{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            text-decoration: none;
            color: white;
            transition: all 0.3s;
        }}
        
        .share-btn:hover {{
            transform: scale(1.1);
        }}
        
        .share-twitter {{
            background: #1DA1F2;
        }}
        
        .share-facebook {{
            background: #1877F2;
        }}
        
        .share-reddit {{
            background: #FF4500;
        }}
        
        .share-copy {{
            background: #666;
        }}
        
        .footer-section {{
            background: var(--dark);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin-top: 40px;
        }}
        
        .footer-section a {{
            color: var(--primary);
            text-decoration: none;
            margin: 0 15px;
        }}
        
        .footer-section a:hover {{
            text-decoration: underline;
        }}
        
        @media (max-width: 768px) {{
            .hero {{
                height: auto;
                padding: 20px;
            }}
            
            .hero-content {{
                grid-template-columns: 1fr;
                gap: 20px;
                align-items: center;
            }}
            
            .hero-title {{
                font-size: 24px;
            }}
            
            .main-grid {{
                grid-template-columns: 1fr;
            }}
            
            .hero-poster {{
                display: none;
            }}
            
            .navbar {{
                flex-direction: column;
                gap: 10px;
            }}
        }}
    </style>
</head>
<body>
    <div class="navbar">
        <div class="nav-back">
            <a href="../index.html"><i class="fas fa-arrow-left"></i> Back to Database</a>
        </div>
    </div>
    
    <div class="container">
        <div class="hero">
            <div class="hero-content">
                <div class="hero-poster">
                    {f'<img src="{picture}" alt="{self.escape_html(title)}">' if picture else '<div style="background:#ddd;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;"><i class="fas fa-film"></i></div>'}
                </div>
                <div>
                    <div class="hero-title">{self.escape_html(title)}</div>
                    <div class="hero-subtitle">{anime_type} • {episodes} episodes • {season.get('year', 'TBA')}</div>
                </div>
            </div>
        </div>
        
        <div class="main-grid">
            <div class="sidebar">
                <div class="info-card score-card">
                    <div class="score-label">Community Rating</div>
                    <div class="score-value">{score_avg:.1f}</div>
                    <div class="score-label">/ 10.0</div>
                </div>
                
                <div class="info-card">
                    <div class="info-card-title">Type</div>
                    <div class="info-card-value">{anime_type}</div>
                </div>
                
                <div class="info-card">
                    <div class="info-card-title">Episodes</div>
                    <div class="info-card-value">{episodes}</div>
                </div>
                
                <div class="info-card">
                    <div class="info-card-title">Status</div>
                    <div class="info-card-value">{status}</div>
                </div>
                
                {f'''<div class="info-card">
                    <div class="info-card-title">Year</div>
                    <div class="info-card-value">{season.get('year', 'N/A')}</div>
                </div>''' if season.get('year') else ''}
                
                {f'''<div class="info-card">
                    <div class="info-card-title">Season</div>
                    <div class="info-card-value">{season.get('season', 'N/A').title()}</div>
                </div>''' if season.get('season') else ''}
                
                {f'<div class="info-card"><div class="info-card-title">Duration</div><div class="info-card-value">{duration_mins} min/ep</div></div>' if duration_mins else ''}
                
                {f'''<div class="info-card">
                    <div class="info-card-title">Language</div>
                    <div class="info-card-value">{', '.join(languages)}</div>
                </div>'''}
                
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="alert('Share this anime!')"><i class="fas fa-share-alt"></i> Share</button>
                    <button class="btn btn-secondary" onclick="alert('Report issue!')"><i class="fas fa-flag"></i> Report</button>
                </div>
            </div>
            
            <div class="content">
                {f'''<div class="section">
                    <div class="section-title"><i class="fas fa-building"></i> Studios</div>
                    <p>{', '.join([s.title() for s in studios]) or 'Unknown'}</p>
                </div>''' if studios else ''}
                
                {f'''<div class="section">
                    <div class="section-title"><i class="fas fa-handshake"></i> Producers</div>
                    <p>{', '.join([p.title() for p in producers]) or 'Unknown'}</p>
                </div>''' if producers else ''}
                
                {f'''<div class="section">
                    <div class="section-title"><i class="fas fa-tags"></i> Genres & Tags</div>
                    <div class="tags">
                        {chr(10).join([f'<span class="tag">{self.escape_html(tag)}</span>' for tag in self.filter_tags(tags)])}
                    </div>
                </div>''' if tags else ''}
                
                {f'''<div class="section">
                    <div class="section-title"><i class="fas fa-globe"></i> Other Names</div>
                    <p>{', '.join(self.filter_english_synonyms(synonyms)) or 'None'}</p>
                </div>''' if self.filter_english_synonyms(synonyms) else ''}
                
                <div class="section">
                    <div class="section-title"><i class="fas fa-stream"></i> Watch Online</div>
                    <div class="links-grid">
                        {chr(10).join([f'''<a href="{source}" target="_blank" class="link-card">
                            <i class="fas fa-{self.get_icon_for_source(source)}"></i>
                            <div class="link-card-content">
                                <h4>{self.extract_source_name(source)}</h4>
                                <p>Watch now</p>
                            </div>
                        </a>''' for source in sources[:6]])}
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title"><i class="fas fa-share"></i> Share This Anime</div>
                    <div class="share-buttons">
                        <a href="https://twitter.com/intent/tweet?text={{self.escape_html(title)}}&url={anime_type}" class="share-btn share-twitter" title="Share on Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u={anime_type}" class="share-btn share-facebook" title="Share on Facebook"><i class="fab fa-facebook"></i></a>
                        <a href="https://reddit.com/submit?title={{self.escape_html(title)}}" class="share-btn share-reddit" title="Share on Reddit"><i class="fab fa-reddit"></i></a>
                        <button class="share-btn share-copy" onclick="alert('Link copied!')" title="Copy link"><i class="fas fa-copy"></i></button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer-section">
            <h3>Support AnimeRepo</h3>
            <p style="margin: 10px 0 20px 0;">Help us keep this database free and ad-free!</p>
            <div>
                <a href="https://github.com/mTulsiram/AnimeRepo" target="_blank"><i class="fab fa-github"></i> GitHub</a>
                <a href="https://github.com/mTulsiram/AnimeRepo/issues" target="_blank"><i class="fas fa-bug"></i> Report Bug</a>
                <a href="https://github.com/mTulsiram/AnimeRepo/discussions" target="_blank"><i class="fas fa-comments"></i> Support</a>
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
    
    def is_mostly_english(self, text):
        """Check if text is mostly in English (ASCII characters)"""
        if not text:
            return False
        ascii_count = sum(1 for c in text if ord(c) < 128)
        return ascii_count / len(text) > 0.7
    
    def filter_english_synonyms(self, synonyms):
        """Filter synonyms to only English ones"""
        if not synonyms:
            return []
        return [s for s in synonyms if self.is_mostly_english(s)][:8]
    
    def filter_tags(self, tags):
        """Filter tags to only English ones"""
        if not tags:
            return []
        english_tags = [t for t in tags if self.is_mostly_english(t)]
        return english_tags[:15]
    
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
    
    def get_icon_for_source(self, url):
        """Get FontAwesome icon for source"""
        if 'myanimelist' in url:
            return 'tv'
        elif 'anilist' in url:
            return 'link'
        elif 'anidb' in url:
            return 'database'
        elif 'kitsu' in url:
            return 'film'
        elif 'anime-planet' in url:
            return 'globe'
        elif 'animenewsnetwork' in url or 'ann' in url:
            return 'newspaper'
        else:
            return 'external-link-alt'
    
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
    import argparse
    p = argparse.ArgumentParser(description='Generate anime HTML pages')
    p.add_argument('--minimal', action='store_true', help='Minimal HTML + external assets (anime-detail.js/css), no inline styles')
    p.add_argument('--jsonl', default='anime-offline-database.jsonl', help='JSONL data file')
    args = p.parse_args()
    generator = AnimePageGenerator(minimal=args.minimal)
    generator.generate_all(args.jsonl, chunk_size=5000)
