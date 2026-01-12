import json

# Read the JSON file
try:
    with open('data/1983.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1983.json', 'r') as f:
        data = json.load(f)

# Genre mapping based on artist name
genre_mapping = {
    # Rock Alternativo
    'U2': 'Rock Alternativo',
    'R.E.M.': 'Rock Alternativo',
    'The Smiths': 'Rock Alternativo',
    'XTC': 'Rock Alternativo',
    'The Police': 'Rock Alternativo',
    'The Rolling Stones': 'Rock Alternativo',
    'Genesis': 'Rock Alternativo',
    'Rush': 'Rock Alternativo',
    'Journey': 'Rock Alternativo',
    'Toto': 'Rock Alternativo',
    'The Kinks': 'Rock Alternativo',
    'Yes': 'Rock Alternativo',
    'Big Country': 'Rock Alternativo',
    'The Fixx': 'Rock Alternativo',
    'The Alarm': 'Rock Alternativo',
    'Alarm (3)': 'Rock Alternativo',
    'The Tubes': 'Rock Alternativo',
    'The Motels': 'Rock Alternativo',
    'Men At Work': 'Rock Alternativo',
    'INXS': 'Rock Alternativo',
    'Icehouse': 'Rock Alternativo',
    'Australian Crawl': 'Rock Alternativo',
    'Loverboy': 'Rock Alternativo',
    'REO Speedwagon': 'Rock Alternativo',
    'Supertramp': 'Rock Alternativo',
    'Jefferson Starship': 'Rock Alternativo',
    'The B-52\'s': 'Rock Alternativo',
    'Talking Heads': 'Rock Alternativo',
    'Wall Of Voodoo': 'Rock Alternativo',
    'Wang Chung': 'Rock Alternativo',
    'The Icicle Works': 'Rock Alternativo',
    'The Three O\'Clock': 'Rock Alternativo',
    'The Bongos': 'Rock Alternativo',
    'Translator (3)': 'Rock Alternativo',
    'The The': 'Rock Alternativo',
    'Killing Joke': 'Rock Alternativo',
    'Theatre Of Hate': 'Rock Alternativo',
    'The Monochrome Set': 'Rock Alternativo',
    'The Escape': 'Rock Alternativo',
    'Friends Again': 'Rock Alternativo',
    'PlanB': 'Rock Alternativo',
    'Litfiba': 'Rock Alternativo',
    'Sparks': 'Rock Alternativo',
    'America': 'Rock Alternativo',
    'Corey Hart': 'Rock Alternativo',
    'John Mellencamp': 'Rock Alternativo',
    'Bryan Adams': 'Rock Alternativo',
    'Neil Young': 'Rock Alternativo',
    'Jackson Browne': 'Rock Alternativo',
    'Bob Dylan': 'Rock Alternativo',
    'Peter Gabriel': 'Rock Alternativo',
    'Robert Plant': 'Rock Alternativo',
    'Ric Ocasek': 'Rock Alternativo',
    'Paul Kantner': 'Rock Alternativo',
    'Styx': 'Rock Alternativo',
    'Status Quo': 'Rock Alternativo',
    '10cc': 'Rock Alternativo',
    'Cheap Trick': 'Rock Alternativo',
    'Europe': 'Rock Alternativo',
    'The Stranglers': 'Rock Alternativo',
    'The Undertones': 'Rock Alternativo',
    'Marine Girls': 'Rock Alternativo',
    'Burning Sensations': 'Rock Alternativo',
    'Palais Schaumburg': 'Rock Alternativo',
    
    # Metal
    'AC/DC': 'Metal',
    'Iron Maiden': 'Metal',
    'Judas Priest': 'Metal',
    'Def Leppard': 'Metal',
    'Motörhead': 'Metal',
    'Mötley Crüe': 'Metal',
    'Kiss': 'Metal',
    'Ozzy Osbourne': 'Metal',
    'Dio (2)': 'Metal',
    'Twisted Sister': 'Metal',
    'Dokken': 'Metal',
    'Queensrÿche': 'Metal',
    'ZZ Top': 'Metal',
    
    # Punk
    'The Cure': 'Punk',
    'Siouxsie & The Banshees': 'Punk',
    'Bauhaus': 'Punk',
    'Billy Idol': 'Punk',
    'Adam Ant': 'Punk',
    'Bow Wow Wow': 'Punk',
    'Madness': 'Punk',
    'Stray Cats': 'Punk',
    'Fun Boy Three': 'Punk',
    'The Clash': 'Punk',
    'Misfits': 'Punk',
    'Public Image Limited': 'Punk',
    'Dead Or Alive': 'Punk',
    
    # Pop
    'Billy Joel': 'Pop',
    'Elton John': 'Pop',
    'Rod Stewart': 'Pop',
    'Paul McCartney': 'Pop',
    'Phil Collins': 'Pop',
    'Lionel Richie': 'Pop',
    'Stevie Nicks': 'Pop',
    'Cyndi Lauper': 'Pop',
    'Madonna': 'Pop',
    'Kim Wilde': 'Pop',
    'Kim Carnes': 'Pop',
    'Laura Branigan': 'Pop',
    'Sheena Easton': 'Pop',
    'Tracey Ullman': 'Pop',
    'Diana Ross': 'Pop',
    'Donna Summer': 'Pop',
    'Bonnie Tyler': 'Pop',
    'Rick Springfield': 'Pop',
    'Michael Bolton': 'Pop',
    'Barry Manilow': 'Pop',
    'Kenny Rogers': 'Pop',
    'Kenny Loggins': 'Pop',
    'Cliff Richard': 'Pop',
    'Dolly Parton': 'Pop',
    'Frida': 'Pop',
    'Irene Cara': 'Pop',
    'Air Supply': 'Pop',
    'Taco': 'Pop',
    'Righeira': 'Pop',
    'Klaus Nomi': 'Pop',
    'Alvin Stardust': 'Pop',
    'Nik Kershaw': 'Pop',
    'Jona Lewie': 'Pop',
    'Carmel': 'Pop',
    'Pat Wilson': 'Pop',
    'Toto Coelo': 'Pop',
    'Haysi Fantayzee': 'Pop',
    'Peter Schilling': 'Pop',
    'Rainhard Fendrich': 'Pop',
    'Blitz (11)': 'Pop',
    
    # Rock
    'Pat Benatar': 'Rock',
    'Heart': 'Rock',
    'Survivor': 'Rock',
    'Scandal (4)': 'Rock',
    'Berlin': 'Rock',
    'Meat Loaf': 'Rock',
    'The Belle Stars': 'Rock',
    
    # Eletronico
    'Depeche Mode': 'Eletronico',
    'Duran Duran': 'Eletronico',
    'The Human League': 'Eletronico',
    'Eurythmics': 'Eletronico',
    'New Order': 'Eletronico',
    'Orchestral Manoeuvres In The Dark': 'Eletronico',
    'Thompson Twins': 'Eletronico',
    'Tears For Fears': 'Eletronico',
    'Ultravox': 'Eletronico',
    'Spandau Ballet': 'Eletronico',
    'Howard Jones': 'Eletronico',
    'Talk Talk': 'Eletronico',
    'Yello': 'Eletronico',
    'Kraftwerk': 'Eletronico',
    'Naked Eyes': 'Eletronico',
    'Men Without Hats': 'Eletronico',
    'Real Life': 'Eletronico',
    'Indochine': 'Eletronico',
    'My Mine': 'Eletronico',
    'Godley & Creme': 'Eletronico',
    
    # Dance
    'Culture Club': 'Dance',
    'Bananarama': 'Dance',
    'Frankie Goes To Hollywood': 'Dance',
    'Shannon': 'Dance',
    
    # Funk/R&B
    'Prince': 'Funk',
    'Rick James': 'Funk',
    'Kool & The Gang': 'Funk',
    'The Gap Band': 'Funk',
    'Ray Parker Jr.': 'Funk',
    'The Whispers': 'Funk',
    'Rufus & Chaka Khan': 'Funk',
    'Stephanie Mills': 'Funk',
    'Herbie Hancock': 'Jazz',
    'Kenny G': 'Jazz',
    
    # Reggae
    'UB40': 'Reggae',
    
    # Rap/Hip-Hop
    'Grandmaster Flash': 'Rap',
    
    # Country
    'Bee Gees': 'Pop',
    
    # Novelty/Comedy
    'Weird Al Yankovic': 'Pop',
    'Barnes & Barnes': 'Pop',
    'Jump \'N the Saddle Band': 'Pop',
    
    # Other
    'David Bowie': 'Rock Alternativo',
    'The Pointer Sisters': 'Pop',
    'Electric Light Orchestra': 'Eletronico',
    'Simple Minds': 'Rock Alternativo',
    'Huey Lewis': 'Rock Alternativo',
    'Was (Not Was)': 'Funk',
    'Zebra One': 'Rock Alternativo',
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
with open('data/1983.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✓ Successfully updated artist_genre for all entries in data/1983.json")

# Print summary
genres = {}
for item in data:
    genre = item['artist_genre']
    genres[genre] = genres.get(genre, 0) + 1

print("\nGenre distribution:")
for genre, count in sorted(genres.items(), key=lambda x: x[1], reverse=True):
    print(f"  {genre}: {count}")
