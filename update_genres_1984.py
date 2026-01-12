import json

# Read the JSON file
try:
    with open('data/1984.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1984.json', 'r') as f:
        data = json.load(f)

# Genre mapping based on artist name (1984 - peak MTV era)
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
    'The Cars': 'Rock Alternativo',
    'Men At Work': 'Rock Alternativo',
    'INXS': 'Rock Alternativo',
    'Icehouse': 'Rock Alternativo',
    'Loverboy': 'Rock Alternativo',
    'REO Speedwagon': 'Rock Alternativo',
    'Supertramp': 'Rock Alternativo',
    'Jefferson Starship': 'Rock Alternativo',
    'The Pretenders': 'Rock Alternativo',
    'Simple Minds': 'Rock Alternativo',
    'Echo & The Bunnymen': 'Rock Alternativo',
    'The Psychedelic Furs': 'Rock Alternativo',
    'Wang Chung': 'Rock Alternativo',
    'The Alarm': 'Rock Alternativo',
    'Corey Hart': 'Rock Alternativo',
    'John Mellencamp': 'Rock Alternativo',
    'Bryan Adams': 'Rock Alternativo',
    'Bruce Springsteen': 'Rock Alternativo',
    'Huey Lewis': 'Rock Alternativo',
    'Peter Gabriel': 'Rock Alternativo',
    'Robert Plant': 'Rock Alternativo',
    'Ric Ocasek': 'Rock Alternativo',
    'Styx': 'Rock Alternativo',
    'Status Quo': 'Rock Alternativo',
    '10cc': 'Rock Alternativo',
    'Cheap Trick': 'Rock Alternativo',
    'The Stranglers': 'Rock Alternativo',
    'The Undertones': 'Rock Alternativo',
    'Talking Heads': 'Rock Alternativo',
    'Devo': 'Rock Alternativo',
    'The Tubes': 'Rock Alternativo',
    'The Motels': 'Rock Alternativo',
    'Missing Persons': 'Rock Alternativo',
    'Oingo Boingo': 'Rock Alternativo',
    'The Romantics': 'Rock Alternativo',
    'Night Ranger': 'Rock Alternativo',
    'Foreigner': 'Rock Alternativo',
    'Asia': 'Rock Alternativo',
    'Saga': 'Rock Alternativo',
    'Autograph': 'Rock Alternativo',
    'Ratt': 'Rock Alternativo',
    'Quiet Riot': 'Rock Alternativo',
    'Zebra': 'Rock Alternativo',
    'Nena': 'Pop',
    
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
    'Van Halen': 'Metal',
    'Scorpions': 'Metal',
    'Accept': 'Metal',
    'W.A.S.P.': 'Metal',
    'Y&T': 'Metal',
    'Krokus': 'Metal',
    
    # Punk/New Wave
    'The Cure': 'Punk',
    'Siouxsie & The Banshees': 'Punk',
    'Bauhaus': 'Punk',
    'Billy Idol': 'Punk',
    'Adam Ant': 'Punk',
    'Bow Wow Wow': 'Punk',
    'Madness': 'Punk',
    'Stray Cats': 'Punk',
    'The Clash': 'Punk',
    'Dead Or Alive': 'Punk',
    'The Damned': 'Punk',
    'Sigue Sigue Sputnik': 'Punk',
    
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
    'Diana Ross': 'Pop',
    'Tina Turner': 'Pop',
    'Bonnie Tyler': 'Pop',
    'Rick Springfield': 'Pop',
    'Michael Bolton': 'Pop',
    'Barry Manilow': 'Pop',
    'Kenny Loggins': 'Pop',
    'Cliff Richard': 'Pop',
    'Dolly Parton': 'Pop',
    'Irene Cara': 'Pop',
    'Air Supply': 'Pop',
    'Hall & Oates': 'Pop',
    'Wham!': 'Pop',
    'George Michael': 'Pop',
    'Nik Kershaw': 'Pop',
    'Howard Jones': 'Pop',
    'Sade': 'Pop',
    'Alison Moyet': 'Pop',
    'Sting': 'Pop',
    'Paul Young': 'Pop',
    'Rockwell': 'Pop',
    'Deniece Williams': 'Pop',
    'Rebbie Jackson': 'Pop',
    'Jermaine Jackson': 'Pop',
    'The Jacksons': 'Pop',
    'Julio Iglesias': 'Pop',
    'Olivia Newton-John': 'Pop',
    'Kenny Rogers': 'Pop',
    'Lionel Richie': 'Pop',
    'Stevie Wonder': 'Pop',
    'Ray Parker Jr.': 'Funk',
    
    # Rock
    'Pat Benatar': 'Rock',
    'Heart': 'Rock',
    'Survivor': 'Rock',
    'Scandal (4)': 'Rock',
    'Berlin': 'Rock',
    'The Go-Go\'s': 'Rock',
    'Joan Jett': 'Rock',
    'Lita Ford': 'Rock',
    
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
    'Talk Talk': 'Eletronico',
    'Yello': 'Eletronico',
    'Kraftwerk': 'Eletronico',
    'Naked Eyes': 'Eletronico',
    'Frankie Goes To Hollywood': 'Eletronico',
    'Bronski Beat': 'Eletronico',
    'Alphaville': 'Eletronico',
    'Propaganda': 'Eletronico',
    'Yazoo': 'Eletronico',
    'Soft Cell': 'Eletronico',
    'Pet Shop Boys': 'Eletronico',
    'Visage': 'Eletronico',
    'A Flock Of Seagulls': 'Eletronico',
    'ABC': 'Eletronico',
    'Heaven 17': 'Eletronico',
    'Thomas Dolby': 'Eletronico',
    'Herbie Hancock': 'Jazz',
    
    # Dance
    'Culture Club': 'Dance',
    'Bananarama': 'Dance',
    'Shannon': 'Dance',
    'The Pointer Sisters': 'Dance',
    'Chaka Khan': 'Dance',
    'Sister Sledge': 'Dance',
    
    # Funk/R&B
    'Prince': 'Funk',
    'Rick James': 'Funk',
    'Kool & The Gang': 'Funk',
    'The Gap Band': 'Funk',
    'The Whispers': 'Funk',
    'Cameo': 'Funk',
    'Midnight Star': 'Funk',
    'Evelyn King': 'Funk',
    'Michael Jackson': 'Funk',
    
    # Reggae
    'UB40': 'Reggae',
    'Musical Youth': 'Reggae',
    
    # Rap/Hip-Hop
    'Run-DMC': 'Rap',
    'Grandmaster Flash': 'Rap',
    'Herbie Hancock': 'Jazz',
    
    # Country
    'Willie Nelson': 'Country',
    'Alabama': 'Country',
    
    # Other
    'David Bowie': 'Rock Alternativo',
    'Electric Light Orchestra': 'Eletronico',
    'Weird Al Yankovic': 'Pop',
    'Tracey Ullman': 'Pop',
    'Taco': 'Pop',
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
with open('data/1984.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✓ Successfully updated artist_genre for all entries in data/1984.json")

# Print summary
genres = {}
for item in data:
    genre = item['artist_genre']
    genres[genre] = genres.get(genre, 0) + 1

print("\nGenre distribution:")
for genre, count in sorted(genres.items(), key=lambda x: x[1], reverse=True):
    print(f"  {genre}: {count}")
