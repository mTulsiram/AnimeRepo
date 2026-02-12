import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Set, Tuple
import time

# German to English anime title translations mapping
GERMAN_TO_ENGLISH = {
    "Die Tagebücher der Apothekerin": "The Apothecary Diaries",
    "Mein Schulgeist Hanako": "Toilet-bound Hanako-kun",
    "Der Schlachthof der Mondstadt": "The Hexologists",
    "Angriff auf Titan": "Attack on Titan",
    "Mein Held Akademie": "My Hero Academia",
    "Demon Slayer": "Demon Slayer",
    "Tödliche Krone": "Crown of Thorns",
}

# Cache for anime metadata (Title -> metadata dict)
ANIME_METADATA_CACHE = {}

# Common genre mappings for quick lookup
GENRE_DATABASE = {
    "attack on titan": ("Action, Dark Fantasy", 2013, "TV", 8.9),
    "demon slayer": ("Action, Supernatural", 2019, "TV", 8.7),
    "my hero academia": ("Action, School", 2016, "TV", 8.4),
    "death note": ("Psychological, Thriller", 2006, "TV", 9.0),
    "naruto": ("Action, Adventure", 2002, "TV", 8.3),
    "one piece": ("Action, Adventure", 1999, "TV", 8.8),
    "bleach": ("Action, Supernatural", 2004, "TV", 7.9),
    "fairy tail": ("Action, Fantasy", 2009, "TV", 7.8),
    "sword art online": ("Action, Adventure", 2012, "TV", 7.6),
    "code geass": ("Action, Sci-Fi", 2006, "TV", 8.6),
    "steins;gate": ("Sci-Fi, Thriller", 2011, "TV", 9.0),
    "full metal alchemist": ("Action, Adventure", 2005, "TV", 8.7),
    "the apothecary diaries": ("Mystery, Drama", 2023, "TV", 8.7),
    "toilet-bound hanako-kun": ("Supernatural, Comedy", 2020, "TV", 8.4),
    "cyberpunk: edgerunners": ("Action, Sci-Fi", 2022, "TV", 8.5),
    "jujutsu kaisen": ("Action, Supernatural", 2020, "TV", 8.6),
    "chainsaw man": ("Action, Dark", 2022, "TV", 8.8),
    "mob psycho 100": ("Action, Comedy", 2016, "TV", 8.5),
    "one punch man": ("Action, Comedy", 2015, "TV", 8.7),
    "my teen romantic comedy snafu": ("Romance, School", 2013, "TV", 7.9),
    "no game no life": ("Adventure, Fantasy", 2014, "TV", 8.2),
    "re:zero": ("Adventure, Fantasy", 2016, "TV", 8.3),
    "that time i got reincarnated as a slime": ("Adventure, Fantasy", 2018, "TV", 7.6),
    "sword art online: alternative gun gale online": ("Action, Sci-Fi", 2018, "TV", 7.4),
    "sword art online iii phantom bullet": ("Action, Sci-Fi", 2018, "TV", 7.4),
    "sword art online ii": ("Action, Sci-Fi", 2014, "TV", 7.5),
    "overlord": ("Action, Fantasy", 2015, "TV", 8.1),
    "inuyasha": ("Action, Adventure", 2000, "TV", 8.0),
    "puella magi madoka magica": ("Drama, Magical Girl", 2011, "TV", 8.2),
    "ergo proxy": ("Sci-Fi, Mystery", 2006, "TV", 7.6),
    "neon genesis evangelion": ("Mecha, Psychological", 1995, "TV", 8.0),
    "cowboy bebop": ("Sci-Fi, Noir", 1998, "TV", 8.8),
    "trigun": ("Action, Sci-Fi", 1998, "TV", 8.2),
    "the devil is a part timer": ("Comedy, Fantasy", 2013, "TV", 7.6),
    "kill la kill": ("Action, Comedy", 2013, "TV", 8.2),
    "fate/zero": ("Action, Fantasy", 2011, "TV", 8.3),
    "fate/stay night": ("Action, Fantasy", 2006, "TV", 7.8),
    "black clover": ("Action, Fantasy", 2017, "TV", 7.6),
    "my dress-up darling": ("Romance, Comedy", 2022, "TV", 8.0),
    "toradora": ("Romance, Comedy", 2008, "TV", 8.3),
    "clannad": ("Romance, Drama", 2007, "TV", 8.1),
    "angel beats": ("Drama, School", 2010, "TV", 8.1),
    "your lie in april": ("Drama, Music", 2014, "TV", 8.5),
    "erased": ("Mystery, Thriller", 2016, "TV", 8.4),
    "a place further than the universe": ("Adventure, School", 2018, "TV", 8.3),
    "made in abyss": ("Adventure, Drama", 2017, "TV", 8.5),
    "vinland saga": ("Action, Drama", 2019, "TV", 8.7),
    "spy x family": ("Action, Comedy", 2022, "TV", 8.6),
    "kaguya-sama: love is war": ("Comedy, Romance", 2019, "TV", 8.3),
    "horimiya": ("Romance, Comedy", 2021, "TV", 8.1),
    "assassination classroom": ("Action, Comedy", 2015, "TV", 8.2),
    "grand blue dreaming": ("Comedy, School", 2018, "TV", 8.0),
    "toilet-bound hanako-kun": ("Supernatural, Comedy", 2020, "TV", 8.4),
    "rent-a-girlfriend": ("Romance, Comedy", 2020, "TV", 7.4),
    "saekano": ("Comedy, Romance", 2015, "TV", 7.2),
    "classroom of the elite": ("Drama, Psychological", 2017, "TV", 7.9),
    "bunny girl senpai": ("Romance, Supernatural", 2018, "TV", 8.0),
    "weathering with you": ("Romance, Drama", 2019, "Movie", 7.9),
    "your name": ("Romance, Supernatural", 2016, "Movie", 8.4),
    "a silent voice": ("Drama, School", 2016, "Movie", 8.2),
    "garden of words": ("Romance, Drama", 2013, "Movie", 8.0),
    "five centimeters per second": ("Romance, Drama", 2007, "Movie", 7.9),
    "spirited away": ("Fantasy, Adventure", 2001, "Movie", 8.6),
    "howl's moving castle": ("Fantasy, Adventure", 2004, "Movie", 8.5),
    "nausicaa of the valley of the wind": ("Fantasy, Adventure", 1984, "Movie", 8.0),
    "princess mononoke": ("Fantasy, Adventure", 1997, "Movie", 8.3),
    "perfect blue": ("Psychological, Thriller", 1997, "Movie", 8.0),
    "millennium actress": ("Drama, Psychological", 2001, "Movie", 8.1),
    "tokyo godfathers": ("Comedy, Drama", 2003, "Movie", 8.0),
    "paprika": ("Psychological, Sci-Fi", 2006, "Movie", 8.1),
    "summer wars": ("Adventure, Sci-Fi", 2009, "Movie", 7.9),
    "madoka magica movie": ("Drama, Magical Girl", 2012, "Movie", 8.0),
    "akira": ("Sci-Fi, Action", 1987, "Movie", 8.1),
    "ghost in the shell": ("Sci-Fi, Action", 1995, "Movie", 8.1),
    "vampire hunter d": ("Action, Horror", 1985, "Movie", 7.3),
    "gundam": ("Mecha, Sci-Fi", 1979, "TV", 7.7),
    "natsume's book of friends": ("Supernatural, Slice of Life", 2008, "TV", 8.2),
    "barakamon": ("Comedy, School", 2014, "TV", 8.3),
    "irrational fear": ("Comedy, Slice of Life", 2020, "TV", 7.9),
    "k-on": ("Music, School", 2009, "TV", 7.8),
    "nichijou": ("Comedy, School", 2011, "TV", 8.1),
    "daily lives of high school boys": ("Comedy, School", 2012, "TV", 8.3),
    "low tide": ("Comedy, Slice of Life", 2021, "TV", 7.8),
    "foods wars": ("Comedy, Culinary", 2015, "TV", 7.9),
}

def clean_title(title: str) -> str:
    """Clean and normalize anime title."""
    if not title or not isinstance(title, str):
        return ""
    
    # Remove junk patterns
    title = re.sub(r'img/main/\S+\.(jpg|png|gif)', '', title)
    title = re.sub(r'(LogoDonate|Discord)', '', title, flags=re.IGNORECASE)
    
    # Remove extra whitespace
    title = title.strip()
    title = ' '.join(title.split())
    
    # Skip empty or very short titles
    if len(title) < 2:
        return ""
    
    return title

def translate_german_to_english(title: str) -> str:
    """Translate German titles to English."""
    title_lower = title.lower()
    
    # Check direct translation mapping
    for german, english in GERMAN_TO_ENGLISH.items():
        if german.lower() in title_lower:
            return english
    
    return title

def normalize_title(title: str) -> str:
    """Normalize title for comparison (lowercase, remove special chars)."""
    return re.sub(r'[^a-z0-9]', '', title.lower())

def get_anime_metadata(title: str) -> Tuple[str, int, str, float]:
    """Fetch anime metadata (genre, year, type, rating)."""
    title_lower = title.lower()
    
    # Check cache first
    if title_lower in ANIME_METADATA_CACHE:
        return ANIME_METADATA_CACHE[title_lower]
    
    # Check genre database
    if title_lower in GENRE_DATABASE:
        metadata = GENRE_DATABASE[title_lower]
        ANIME_METADATA_CACHE[title_lower] = metadata
        return metadata
    
    # Try partial matches in database
    for db_title, metadata in GENRE_DATABASE.items():
        if title_lower in db_title or db_title in title_lower:
            ANIME_METADATA_CACHE[title_lower] = metadata
            return metadata
    
    # Default metadata for unknown titles
    default = ("Anime", 2024, "TV", 7.0)
    ANIME_METADATA_CACHE[title_lower] = default
    return default

def process_anime_data(input_file: str) -> List[Dict]:
    """Process anime data from JSONL file."""
    anime_dict = {}  # Key: normalized title, Value: {title, languages, ...}
    
    print("Reading anime database...")
    line_count = 0
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            for line in f:
                line_count += 1
                if line_count % 100 == 0:
                    print(f"  Processed {line_count} lines...")
                
                try:
                    data = json.loads(line.strip())
                except json.JSONDecodeError:
                    continue
                
                # Extract title
                title = data.get('title', '').strip() if isinstance(data.get('title'), str) else ''
                
                if not title or len(title) < 2:
                    continue
                
                # Remove junk
                title = clean_title(title)
                if not title:
                    continue
                
                # Translate German titles
                title = translate_german_to_english(title)
                
                # Proper capitalization
                title = title.title() if isinstance(title, str) else title
                
                # Get language info
                language = data.get('language', 'Unknown')
                rel_date = data.get('releasedDate', '')
                
                # Normalize for deduplication
                norm_title = normalize_title(title)
                
                if norm_title in anime_dict:
                    # Merge languages
                    existing_langs = anime_dict[norm_title]['languages']
                    if language not in existing_langs:
                        existing_langs.append(language)
                else:
                    anime_dict[norm_title] = {
                        'title': title,
                        'languages': [language] if language != 'Unknown' else [],
                        'releaseDate': rel_date
                    }
    
    except UnicodeDecodeError as e:
        print(f"Unicode error at line {line_count}: {e}")
    
    print(f"✓ Parsed {line_count} total lines, {len(anime_dict)} unique anime")
    
    # Convert to list and add metadata
    result = []
    for norm_title, anime in anime_dict.items():
        title = anime['title']
        languages = ', '.join(anime['languages']) if anime['languages'] else 'Unknown'
        
        # Get enriched metadata
        genre, year, type_, rating = get_anime_metadata(title)
        
        result.append({
            'title': title,
            'languages': languages,
            'genre': genre,
            'year': year,
            'type': type_,
            'rating': rating
        })
    
    # Sort by title
    result.sort(key=lambda x: x['title'].lower())
    
    return result

def generate_markdown_table(data: List[Dict]) -> str:
    """Generate Markdown table from anime data."""
    markdown = "| Title | Dub Languages | Genre | Year | Type | Rating |\n"
    markdown += "| :--- | :--- | :--- | :--- | :--- | :--- |\n"
    
    for anime in data:
        markdown += f"| {anime['title']} | {anime['languages']} | {anime['genre']} | {anime['year']} | {anime['type']} | {anime['rating']} |\n"
    
    return markdown

def main():
    input_file = "anime-offline-database.jsonl"
    output_file = "anime_cleaned_metadata.md"
    
    if not Path(input_file).exists():
        print(f"Error: {input_file} not found")
        return
    
    print("Starting anime data processing...")
    print("=" * 60)
    
    # Process data
    anime_data = process_anime_data(input_file)
    
    print(f"\n✓ Total unique anime: {len(anime_data)}")
    
    # Generate markdown
    print("\nGenerating Markdown table...")
    markdown = generate_markdown_table(anime_data)
    
    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Comprehensive Anime Database\n\n")
        f.write(f"**Total Anime: {len(anime_data)}**\n\n")
        f.write(markdown)
    
    print(f"✓ Output saved to {output_file}")
    print("=" * 60)
    
    # Print sample
    print("\nSample output (first 10 anime):")
    print(markdown.split('\n')[0])
    print(markdown.split('\n')[1])
    for line in markdown.split('\n')[2:12]:
        if line.strip():
            print(line)

if __name__ == "__main__":
    main()
