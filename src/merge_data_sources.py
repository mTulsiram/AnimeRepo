#!/usr/bin/env python3
"""
Advanced Anime Data Processor
Merges multiple anime data sources and enriches with metadata
"""

import json
import re
from pathlib import Path
from collections import defaultdict
import os

class AnimeDataProcessor:
    def __init__(self):
        self.anime_map = {}  # By title
        self.sources = {
            'myanimelist': 'myanimelist-minified.json',
            'anilist': 'anilist-minified.json',
            'kitsu': 'kitsu-minified.json',
            'anidb': 'anidb-minified.json'
        }
        
    def load_source(self, filename):
        """Load a JSON source file"""
        try:
            if Path(filename).exists():
                with open(filename, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"⚠️  Error loading {filename}: {e}")
        return []
    
    def normalize_title(self, title):
        if not title:
            return ""
        return re.sub(r'[^a-z0-9]', '', str(title).lower())
    
    def extract_genres(self, anime_data, source_name):
        """Extract genres from different source formats"""
        genres = []
        
        if source_name == 'myanimelist':
            if isinstance(anime_data.get('genres'), list):
                genres = [g.get('name', '') for g in anime_data['genres'] if g]
        elif source_name == 'anilist':
            if isinstance(anime_data.get('genres'), list):
                genres = anime_data['genres']
        elif source_name == 'kitsu':
            if isinstance(anime_data.get('attributes', {}).get('genres'), list):
                genres = anime_data['attributes']['genres']
        elif source_name == 'anidb':
            if isinstance(anime_data.get('tags'), dict):
                genres = [tag.get('name', '') for tag in anime_data.get('tags', []) if tag]
        
        return [g for g in genres if g and len(g.strip()) > 0][:6]  # Max 6 genres
    
    def extract_image(self, anime_data, source_name):
        """Extract image URL from different sources"""
        if source_name == 'myanimelist':
            if anime_data.get('images', {}).get('jpg', {}).get('image_url'):
                return anime_data['images']['jpg']['image_url']
        elif source_name == 'anilist':
            if anime_data.get('coverImage', {}).get('large'):
                return anime_data['coverImage']['large']
        elif source_name == 'kitsu':
            if anime_data.get('attributes', {}).get('posterImage', {}).get('large'):
                return anime_data['attributes']['posterImage']['large']
        elif source_name == 'anidb':
            if anime_data.get('image'):
                return anime_data['image']
        return None
    
    def extract_languages(self, anime_data, source_name):
        """Extract available languages/dub info"""
        languages = set()
        
        if source_name == 'myanimelist':
            # MAL has broadcasting info but limited language info
            languages.add('Japanese')  # Assume Japanese always available
            if anime_data.get('status') == 'Finished Airing':
                languages.add('English')  # Assume English dub exists for finished
        elif source_name == 'anilist':
            languages.add('Japanese')
        elif source_name == 'kitsu':
            if anime_data.get('attributes', {}).get('subtype'):
                languages.add('Japanese')
        
        return list(languages)
    
    def extract_rating(self, anime_data, source_name):
        """Extract rating/score"""
        if source_name == 'myanimelist':
            return float(anime_data.get('score', 0)) or 7.0
        elif source_name == 'anilist':
            return float(anime_data.get('meanScore', 0)) / 10.0 or 7.0
        elif source_name == 'kitsu':
            return float(anime_data.get('attributes', {}).get('averageRating', 0)) / 10.0 or 7.0
        elif source_name == 'anidb':
            return float(anime_data.get('rating', {}).get('average', 0)) or 7.0
        return 7.0
    
    def extract_year(self, anime_data, source_name):
        """Extract release year"""
        if source_name == 'myanimelist':
            aired = anime_data.get('aired', {})
            if isinstance(aired, dict) and aired.get('from'):
                return int(aired['from'][:4])
        elif source_name == 'anilist':
            if anime_data.get('startDate', {}).get('year'):
                return anime_data['startDate']['year']
        elif source_name == 'kitsu':
            start_date = anime_data.get('attributes', {}).get('startDate')
            if start_date:
                return int(start_date[:4])
        elif source_name == 'anidb':
            if anime_data.get('startDate'):
                return int(anime_data['startDate'][:4])
        return 2024
    
    def extract_type(self, anime_data, source_name):
        """Extract anime type (TV, Movie, OVA, etc.)"""
        if source_name == 'myanimelist':
            return anime_data.get('type', 'TV')
        elif source_name == 'anilist':
            return anime_data.get('format', 'TV')
        elif source_name == 'kitsu':
            type_map = {
                'TV': 'TV',
                'movie': 'Movie',
                'OVA': 'OVA',
                'special': 'Special'
            }
            return type_map.get(anime_data.get('attributes', {}).get('subtype', 'TV'), 'TV')
        elif source_name == 'anidb':
            return anime_data.get('type', 'TV')
        return 'TV'
    
    def extract_synopsis(self, anime_data, source_name):
        """Extract synopsis/description"""
        if source_name == 'myanimelist':
            return anime_data.get('synopsis', '')[:300]
        elif source_name == 'anilist':
            return anime_data.get('description', '')[:300]
        elif source_name == 'kitsu':
            return anime_data.get('attributes', {}).get('synopsis', '')[:300]
        elif source_name == 'anidb':
            return anime_data.get('description', '')[:300]
        return ''
    
    def process_all_sources(self):
        """Process all data sources and merge"""
        print("=" * 70)
        print("🎬 ADVANCED ANIME DATA PROCESSOR")
        print("=" * 70)
        
        for source_name, filename in self.sources.items():
            print(f"\n📥 Processing {source_name}...")
            
            # First try from parent directory
            file_path = f'../{filename}'
            data = None
            try:
                if Path(file_path).exists():
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
            except:
                pass
            
            # If not found, try current directory
            if data is None:
                data = self.load_source(filename)
            
            if isinstance(data, list):
                anime_list = data
            elif isinstance(data, dict):
                # Try multiple possible keys where anime data could be
                anime_list = data.get('deadEntries', data.get('data', data.get('entries', [])))
            else:
                print(f"   ⚠️  Unexpected format, skipping")
                continue
            
            print(f"   Found {len(anime_list)} entries")
            
            for anime in anime_list:  # Process all anime from this source
                try:
                    title = anime.get('title') or anime.get('name') or anime.get('romaji')
                    if not title:
                        continue
                    
                    title = str(title).strip()
                    norm_title = self.normalize_title(title)
                    
                    # Extract all metadata
                    metadata = {
                        'title': title,
                        'genres': self.extract_genres(anime, source_name),
                        'image': self.extract_image(anime, source_name),
                        'languages': self.extract_languages(anime, source_name),
                        'rating': self.extract_rating(anime, source_name),
                        'year': self.extract_year(anime, source_name),
                        'type': self.extract_type(anime, source_name),
                        'synopsis': self.extract_synopsis(anime, source_name),
                        'sources': [source_name],
                        'mal_id': anime.get('mal_id'),
                        'anilist_id': anime.get('id'),
                    }
                    
                    # Merge or create entry
                    if norm_title in self.anime_map:
                        existing = self.anime_map[norm_title]
                        existing['sources'].append(source_name)
                        # Enhance existing with better data
                        if not existing['image'] and metadata['image']:
                            existing['image'] = metadata['image']
                        if len(existing['genres']) < len(metadata['genres']):
                            existing['genres'] = metadata['genres']
                        existing['languages'] = list(set(existing['languages'] + metadata['languages']))
                    else:
                        self.anime_map[norm_title] = metadata
                
                except Exception as e:
                    print(f"   ⚠️  Error processing entry: {e}")
                    continue
        
        return self.anime_map
    
    def export_json(self, output_file):
        """Export processed data as JSON"""
        anime_list = list(self.anime_map.values())
        anime_list.sort(key=lambda x: x['title'])
        
        output = {
            'total': len(anime_list),
            'data': anime_list,
            'timestamp': __import__('datetime').datetime.now().isoformat()
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        
        file_size_mb = Path(output_file).stat().st_size / (1024 * 1024)
        print(f"\n✅ Exported {len(anime_list)} anime to {output_file}")
        print(f"   File size: {file_size_mb:.2f} MB")
        return output

def main():
    processor = AnimeDataProcessor()
    
    # Process all sources
    anime_map = processor.process_all_sources()
    
    print(f"\n{'=' * 70}")
    print(f"📊 MERGE SUMMARY")
    print(f"{'=' * 70}")
    print(f"Total unique anime: {len(anime_map)}")
    
    # Export as JSON
    output_data = processor.export_json('../data/anime_merged.json')
    
    # Stats
    print(f"\n📈 DATA QUALITY STATS:")
    with_genres = sum(1 for a in anime_map.values() if len(a.get('genres', [])) > 0)
    with_images = sum(1 for a in anime_map.values() if a.get('image'))
    with_ratings = sum(1 for a in anime_map.values() if a.get('rating', 0) > 0)
    
    print(f"   With genres: {with_genres}/{len(anime_map)} ({100*with_genres/len(anime_map):.1f}%)")
    print(f"   With images: {with_images}/{len(anime_map)} ({100*with_images/len(anime_map):.1f}%)")
    print(f"   With ratings: {with_ratings}/{len(anime_map)} ({100*with_ratings/len(anime_map):.1f}%)")
    
    print(f"\n{'=' * 70}")
    print(f"✨ Processing complete!")
    print(f"{'=' * 70}\n")

if __name__ == '__main__':
    main()
