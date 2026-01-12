import json

# Read the JSON file
try:
    with open('data/1981.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1981.json', 'r') as f:
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
    'Split Enz': 'Rock Alternativo',
    'Icehouse': 'Rock Alternativo',
    'Sparks': 'Rock Alternativo',
    'Squeeze': 'Rock Alternativo',
    'The Rolling Stones': 'Rock Alternativo',
    'The Police': 'Rock Alternativo',
    'Rush': 'Rock Alternativo',
    'Styx': 'Rock Alternativo',
    'Tom Petty And The Heartbreakers': 'Rock Alternativo',
    'The Pretenders': 'Rock Alternativo',
    'Simple Minds': 'Rock Alternativo',
    'Fleetwood Mac': 'Rock Alternativo',
    'The Tubes': 'Rock Alternativo',
    'Todd Rundgren': 'Rock Alternativo',
    'Dave Edmunds': 'Rock Alternativo',
    'April Wine': 'Rock Alternativo',
    'Red Rider': 'Rock Alternativo',
    '38 Special': 'Rock Alternativo',
    'The Buggles': 'Rock Alternativo',
    'Ultravox': 'Rock Alternativo',
    'Spandau Ballet': 'Rock Alternativo',
    'Skids': 'Rock Alternativo',
    'The Specials': 'Rock Alternativo',
    
    # Metal
    'AC/DC': 'Metal',
    'Judas Priest': 'Metal',
    'Def Leppard': 'Metal',
    'Meat Loaf': 'Metal',
    
    # Punk
    'The Cure': 'Punk',
    'Siouxsie & The Banshees': 'Punk',
    'Bauhaus': 'Punk',
    'Adam And The Ants': 'Punk',
    'Bow Wow Wow': 'Punk',
    'Madness': 'Punk',
    'Stray Cats': 'Punk',
    'The Undertones': 'Punk',
    'The Vapors': 'Punk',
    'Fun Boy Three': 'Punk',
    'The Birthday Party': 'Punk',
    'Tenpole Tudor': 'Punk',
    
    # Pop
    'Abba': 'Pop',
    'Billy Joel': 'Pop',
    'Elton John': 'Pop',
    'Rod Stewart': 'Pop',
    'Cliff Richard': 'Pop',
    'Sheena Easton': 'Pop',
    'Kim Carnes': 'Pop',
    'Kim Wilde': 'Pop',
    'Olivia Newton-John': 'Pop',
    'Phil Collins': 'Pop',
    'Stevie Nicks': 'Pop',
    'Diana Ross': 'Pop',
    'Bee Gees': 'Pop',
    'Kate Bush': 'Pop',
    'Rick Springfield': 'Pop',
    'Smokey Robinson': 'Pop',
    'The Jacksons': 'Pop',
    'Herb Alpert': 'Pop',
    'Aneka': 'Pop',
    'France Gall': 'Pop',
    'Franco Battiato': 'Pop',
    'Rondò Veneziano': 'Pop',
    'The Kelly Family': 'Pop',
    'The Twins': 'Pop',
    'Rainhard Fendrich': 'Pop',
    
    # Rock
    'Pat Benatar': 'Rock',
    'The J. Geils Band': 'Rock',
    'Go-Go\'s': 'Rock',
    'Blondie': 'Rock',
    
    # Eletronico
    'Orchestral Manoeuvres In The Dark': 'Eletronico',
    'Godley & Creme': 'Eletronico',
    'Depeche Mode': 'Eletronico',
    'Gary Numan': 'Eletronico',
    'The Human League': 'Eletronico',
    'Soft Cell': 'Eletronico',
    'Heaven 17': 'Eletronico',
    'Thomas Dolby': 'Eletronico',
    'Yello': 'Eletronico',
    'Jean-Michel Jarre': 'Eletronico',
    'Klaus Nomi': 'Eletronico',
    'Duran Duran': 'Eletronico',
    'Electric Light Orchestra': 'Eletronico',
    
    # Funk/R&B/Soul
    'Prince': 'Funk',
    'Rick James': 'Funk',
    'The Whispers': 'Funk',
    'Frankie Smith': 'Funk',
    
    # Reggae
    'UB40': 'Reggae',
    
    # Dance/Disco
    'Village People': 'Dance',
    'Grace Jones': 'Dance',
    
    # New Wave
    'Missing Persons': 'Rock Alternativo',
    'Romeo Void': 'Rock Alternativo',
    'Ph.D.': 'Pop',
    
    # Novelty/Comedy
    'Barnes & Barnes': 'Pop',
    'Tommy Tutone': 'Rock Alternativo',
    
    # Jazz/Instrumental
    'Lee Ritenour': 'Jazz',
    
    # Unknown/Other
    'Alarm (3)': 'Rock Alternativo',
    'Ray Parker Jr.': 'Funk',
    'John Mellencamp': 'Rock Alternativo',
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
with open('data/1981.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✓ Successfully updated artist_genre for all entries in data/1981.json")

# Print summary
genres = {}
for item in data:
    genre = item['artist_genre']
    genres[genre] = genres.get(genre, 0) + 1

print("\nGenre distribution:")
for genre, count in sorted(genres.items(), key=lambda x: x[1], reverse=True):
    print(f"  {genre}: {count}")
