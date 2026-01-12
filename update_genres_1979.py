import json

# Mapping of artists to genres for 1979
genre_mapping = {
    "Abba": "Pop",
    "AC/DC": "Metal",
    "Queen": "Rock Alternativo",
    "Rod Stewart": "Pop",
    "Aerosmith": "Metal",
    "Bee Gees": "Pop",
    "Billy Joel": "Pop",
    "David Bowie": "Rock Alternativo",
    "Pink Floyd": "Rock Alternativo",
    "The Clash": "Punk",
    "Kiss": "Metal",
    "Blondie": "Rock Alternativo",
    "The Police": "Rock Alternativo",
    "Michael Jackson": "Pop",
    "Prince": "Pop",
    "Styx": "Rock Alternativo",
    "Sparks": "Rock Alternativo",
    "The Stranglers": "Rock Alternativo",
    "Cliff Richard": "Pop",
    "Bonnie Tyler": "Pop",
    "Electric Light Orchestra": "Pop",
    "George Harrison": "Pop",
    "Kate Bush": "Pop",
    "Elvis Costello & The Attractions": "Rock Alternativo",
    "The Cars": "Rock Alternativo",
    "Supertramp": "Pop",
    "Toto": "Pop",
    "Journey": "Rock Alternativo",
    "The Pretenders": "Rock Alternativo",
    "Gary Numan": "Eletronico",
    "The Human League": "Eletronico",
    "Yellow Magic Orchestra": "Eletronico",
    "The Buggles": "Pop",
    "M": "Pop",
    "Village People": "Pop",
    "Donna Summer": "Pop",
    "Carly Simon": "Pop",
    "The B-52's": "Rock Alternativo",
    "Tom Petty And The Heartbreakers": "Rock Alternativo",
    "Cheap Trick": "Rock Alternativo",
    "The Jam": "Punk",
    "Siouxsie & The Banshees": "Rock Alternativo",
    "Bauhaus": "Rock Alternativo",
    "Iggy Pop": "Punk",
    "Motörhead": "Metal",
    "Simple Minds": "Rock Alternativo",
    "XTC": "Rock Alternativo",
    "Madness": "Pop",
    "Squeeze": "Rock Alternativo",
    "The Boomtown Rats": "Rock Alternativo",
    "Secret Affair": "Rock Alternativo",
    "The Tubes": "Rock Alternativo",
    "Godley & Creme": "Pop",
    "John Mellencamp": "Rock Alternativo",
    "Cold Chisel": "Rock Alternativo",
    "Earth And Fire": "Rock Alternativo",
    "Lio": "Pop",
    "Eddy Grant": "Pop",
    "The Whispers": "Pop",
    "Ray Parker Jr.": "Pop",
    "Cory Daye": "Pop",
    "Rockestra": "Rock Alternativo",
    "Shoes": "Rock Alternativo",
    "Tom Johnston": "Rock Alternativo"
}

# Normalize function
def normalize_artist(name):
    if not name:
        return "Unknown"
    return str(name).strip()

try:
    with open('data/1979.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1979.json', 'r') as f:
        data = json.load(f)

# Update the artist_genre
updated_count = 0
for item in data:
    artist_raw = item.get('artist_name')
    artist = normalize_artist(artist_raw)
    
    if artist in genre_mapping:
        item['artist_genre'] = genre_mapping[artist]
        updated_count += 1
    else:
        for mapped_artist, genre in genre_mapping.items():
            if mapped_artist in artist:
                 item['artist_genre'] = genre
                 updated_count += 1
                 break

# Save back to file
with open('data/1979.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Updated {updated_count} entries.")
