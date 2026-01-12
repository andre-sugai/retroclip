import json

# Read the JSON file
try:
    with open('data/1980.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1980.json', 'r') as f:
        data = json.load(f)

# Genre mapping based on artist name
genre_mapping = {
    # Rock Alternativo
    'Queen': 'Rock Alternativo',
    'Genesis': 'Rock Alternativo',
    'Dire Straits': 'Rock Alternativo',
    'U2': 'Rock Alternativo',
    'XTC': 'Rock Alternativo',
    'The Psychedelic Furs': 'Rock Alternativo',
    'David Bowie': 'Rock Alternativo',
    'The Who': 'Rock Alternativo',
    'The Cars': 'Rock Alternativo',
    'Toto': 'Rock Alternativo',
    'The Alan Parsons Project': 'Rock Alternativo',
    'Journey': 'Rock Alternativo',
    'REO Speedwagon': 'Rock Alternativo',
    'Loverboy': 'Rock Alternativo',
    'Téléphone': 'Rock Alternativo',
    'Split Enz': 'Rock Alternativo',
    'Cold Chisel': 'Rock Alternativo',
    'Icehouse': 'Rock Alternativo',
    'Sparks': 'Rock Alternativo',
    'Squeeze': 'Rock Alternativo',
    'The Stranglers': 'Rock Alternativo',
    '10cc': 'Rock Alternativo',
    'Huey Lewis': 'Rock Alternativo',
    'Steve Winwood': 'Rock Alternativo',
    'The Buggles': 'Rock Alternativo',
    'Ultravox': 'Rock Alternativo',
    'Spandau Ballet': 'Rock Alternativo',
    
    # Metal
    'AC/DC': 'Metal',
    'Judas Priest': 'Metal',
    'Iron Maiden': 'Metal',
    'Motörhead': 'Metal',
    'Accept': 'Metal',
    'Def Leppard': 'Metal',
    'Kiss': 'Metal',
    
    # Punk
    'The Clash': 'Punk',
    'The Undertones': 'Punk',
    'Stray Cats': 'Punk',
    'Adam And The Ants': 'Punk',
    'Bow Wow Wow': 'Punk',
    'Madness': 'Punk',
    
    # Pop
    'Abba': 'Pop',
    'Billy Joel': 'Pop',
    'Elton John': 'Pop',
    'Rod Stewart': 'Pop',
    'Cliff Richard': 'Pop',
    'Sheena Easton': 'Pop',
    'Kim Carnes': 'Pop',
    'Christopher Cross': 'Pop',
    'Air Supply': 'Pop',
    'Michael Jackson': 'Pop',
    'Jermaine Jackson': 'Pop',
    'Robert Palmer': 'Pop',
    'The Isley Brothers': 'Pop',
    
    # Rock
    'Heart': 'Rock',
    'Jefferson Starship': 'Rock',
    'Pat Benatar': 'Rock',
    'Headpins': 'Rock',
    'The J. Geils Band': 'Rock',
    
    # Punk/New Wave
    'Siouxsie & The Banshees': 'Punk',
    'The Cure': 'Punk',
    'Joy Division': 'Punk',
    'Bauhaus': 'Punk',
    'The Vapors': 'Punk',
    'Secret Affair': 'Punk',
    'The Pirahnas': 'Punk',
    
    # Eletronico
    'Orchestral Manoeuvres In The Dark': 'Eletronico',
    'Godley & Creme': 'Eletronico',
    'Jacno': 'Eletronico',
    'Elli & Jacno': 'Eletronico',
    
    # Dance/Disco
    'Lipps, Inc.': 'Dance',
    'Village People': 'Dance',
    'Grace Jones': 'Dance',
    
    # Funk/R&B/Soul
    'Prince': 'Funk',
    'The Rolling Stones': 'Rock Alternativo',
    'The Police': 'Rock Alternativo',
    'John Lennon': 'Rock Alternativo',
    'Iggy Pop': 'Punk',
    'Kate Bush': 'Pop',
    'Electric Light Orchestra': 'Rock Alternativo',
    'John Mellencamp': 'Rock Alternativo',
    'Robin Lane & The Chartbusters': 'Rock Alternativo',
    'The B-52\'s': 'Rock Alternativo',
    
    # Reggae
    'UB40': 'Reggae',
    
    # Novelty/Comedy
    'Barnes & Barnes': 'Pop',
    'Blotto': 'Rock Alternativo',
    'Chandra': 'Punk',
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
with open('data/1980.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✓ Successfully updated artist_genre for all entries in data/1980.json")

# Print summary
genres = {}
for item in data:
    genre = item['artist_genre']
    genres[genre] = genres.get(genre, 0) + 1

print("\nGenre distribution:")
for genre, count in sorted(genres.items(), key=lambda x: x[1], reverse=True):
    print(f"  {genre}: {count}")
