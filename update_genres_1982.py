import json

# Read the JSON file
try:
    with open('data/1982.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1982.json', 'r') as f:
        data = json.load(f)

# Genre mapping based on artist name
genre_mapping = {
    # Rock Alternativo
    'Queen': 'Rock Alternativo',
    'Genesis': 'Rock Alternativo',
    'U2': 'Rock Alternativo',
    'XTC': 'Rock Alternativo',
    'The Psychedelic Furs': 'Rock Alternativo',
    'David Bowie': 'Rock Alternativo',
    'The Who': 'Rock Alternativo',
    'The Cars': 'Rock Alternativo',
    'Journey': 'Rock Alternativo',
    'REO Speedwagon': 'Rock Alternativo',
    'Loverboy': 'Rock Alternativo',
    'Icehouse': 'Rock Alternativo',
    'Sparks': 'Rock Alternativo',
    'Squeeze': 'Rock Alternativo',
    'The Rolling Stones': 'Rock Alternativo',
    'The Police': 'Rock Alternativo',
    'Rush': 'Rock Alternativo',
    'Simple Minds': 'Rock Alternativo',
    'Fleetwood Mac': 'Rock Alternativo',
    'The Fixx': 'Rock Alternativo',
    'R.E.M.': 'Rock Alternativo',
    'Peter Gabriel': 'Rock Alternativo',
    'Sting': 'Rock Alternativo',
    'Supertramp': 'Rock Alternativo',
    'Toto': 'Rock Alternativo',
    'The Kinks': 'Rock Alternativo',
    'The Motels': 'Rock Alternativo',
    'Golden Earring': 'Rock Alternativo',
    'Midnight Oil': 'Rock Alternativo',
    'Red Rider': 'Rock Alternativo',
    '10cc': 'Rock Alternativo',
    'Huey Lewis': 'Rock Alternativo',
    'Steve Winwood': 'Rock Alternativo',
    'Ultravox': 'Rock Alternativo',
    'Spandau Ballet': 'Rock Alternativo',
    'The Specials': 'Rock Alternativo',
    'The Stranglers': 'Rock Alternativo',
    'Joe Jackson': 'Rock Alternativo',
    'John Mellencamp': 'Rock Alternativo',
    'Lou Reed': 'Rock Alternativo',
    'Robert Plant': 'Rock Alternativo',
    'Cheap Trick': 'Rock Alternativo',
    'Aerosmith': 'Rock Alternativo',
    'Moving Pictures (2)': 'Rock Alternativo',
    'Translator (3)': 'Rock Alternativo',
    'The Beat': 'Rock Alternativo',
    'Orange Juice (3)': 'Rock Alternativo',
    'The Blades': 'Rock Alternativo',
    'Litfiba': 'Rock Alternativo',
    
    # Metal
    'AC/DC': 'Metal',
    'Judas Priest': 'Metal',
    'Iron Maiden': 'Metal',
    'Motörhead': 'Metal',
    'Kiss': 'Metal',
    'Mötley Crüe': 'Metal',
    
    # Punk
    'The Cure': 'Punk',
    'Siouxsie & The Banshees': 'Punk',
    'Bauhaus': 'Punk',
    'Adam Ant': 'Punk',
    'Bow Wow Wow': 'Punk',
    'Madness': 'Punk',
    'The Undertones': 'Punk',
    'Fun Boy Three': 'Punk',
    'The Clash': 'Punk',
    'Violent Femmes': 'Punk',
    'Nina Hagen': 'Punk',
    
    # Pop
    'Abba': 'Pop',
    'Billy Joel': 'Pop',
    'Elton John': 'Pop',
    'Sheena Easton': 'Pop',
    'Kim Carnes': 'Pop',
    'Kim Wilde': 'Pop',
    'Olivia Newton-John': 'Pop',
    'Phil Collins': 'Pop',
    'Diana Ross': 'Pop',
    'Rick Springfield': 'Pop',
    'Kate Bush': 'Pop',
    'Laura Branigan': 'Pop',
    'Amy Grant': 'Pop',
    'Linda Rondstadt': 'Pop',
    'Franco Battiato': 'Pop',
    'Frida': 'Pop',
    'Rondò Veneziano': 'Pop',
    'Vanessa': 'Pop',
    'Mecano': 'Pop',
    'Klaus Nomi': 'Pop',
    'Amanda Lear': 'Pop',
    'Sylvia & The Sapphires': 'Pop',
    'Lene Lovich': 'Pop',
    'Paul McCartney': 'Pop',
    'Glenn Frey': 'Pop',
    'Kenny Loggins': 'Pop',
    'Phil Lynott': 'Pop',
    'Ric Ocasek': 'Pop',
    
    # Rock
    'Pat Benatar': 'Rock',
    'The J. Geils Band': 'Rock',
    'Go-Go\'s': 'Rock',
    'Heart': 'Rock',
    'Jefferson Starship': 'Rock',
    'Survivor': 'Rock',
    'Eddie Money': 'Rock',
    'Scandal (4)': 'Rock',
    'The Belle Stars': 'Rock',
    
    # Eletronico
    'Orchestral Manoeuvres In The Dark': 'Eletronico',
    'Depeche Mode': 'Eletronico',
    'The Human League': 'Eletronico',
    'Soft Cell': 'Eletronico',
    'Heaven 17': 'Eletronico',
    'Thomas Dolby': 'Eletronico',
    'Duran Duran': 'Eletronico',
    'Electric Light Orchestra': 'Eletronico',
    'Kraftwerk': 'Eletronico',
    'Eurythmics': 'Eletronico',
    'Yazoo': 'Eletronico',
    'A Flock Of Seagulls': 'Eletronico',
    'ABC': 'Eletronico',
    'Thompson Twins': 'Eletronico',
    'Talk Talk': 'Eletronico',
    'Tears For Fears': 'Eletronico',
    'Haircut 100': 'Eletronico',
    'Elli & Jacno': 'Eletronico',
    'Kas Product': 'Eletronico',
    'Indochine': 'Eletronico',
    
    # Funk/R&B/Soul
    'Prince': 'Funk',
    'Rick James': 'Funk',
    'Ray Parker Jr.': 'Funk',
    'The Gap Band': 'Funk',
    'Michael Jackson': 'Funk',
    
    # Reggae
    'UB40': 'Reggae',
    'Eddy Grant': 'Reggae',
    
    # Dance/Disco
    'Bananarama': 'Dance',
    'Culture Club': 'Dance',
    'Kid Creole & The Coconuts': 'Dance',
    'Imagination': 'Dance',
    'Indeep': 'Dance',
    'The Flirts': 'Dance',
    'Lime': 'Dance',
    
    # New Wave
    'Missing Persons': 'Rock Alternativo',
    'Dexys Midnight Runners': 'Rock Alternativo',
    'After The Fire': 'Rock Alternativo',
    'Everything But The Girl': 'Pop',
    
    # Other
    'Billy Idol': 'Punk',
    'Falco': 'Pop',
    'Madonna': 'Pop',
    'Men At Work': 'Rock Alternativo',
    'Robert Palmer': 'Pop',
    'Buster Poindexter': 'Pop',
}

# Update the artist_genre for each item
for item in data:
    artist_name = item.get('artist_name', '')
    if artist_name in genre_mapping:
        item['artist_genre'] = genre_mapping[artist_name]
    else:
        # Keep as "Desconhecido" if not in mapping
        item['artist_genre'] = 'Desconhecido'

# Write back to the file
with open('data/1982.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✓ Successfully updated artist_genre for all entries in data/1982.json")

# Print summary
genres = {}
for item in data:
    genre = item['artist_genre']
    genres[genre] = genres.get(genre, 0) + 1

print("\nGenre distribution:")
for genre, count in sorted(genres.items(), key=lambda x: x[1], reverse=True):
    print(f"  {genre}: {count}")
