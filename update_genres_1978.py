import json

# Mapping of artists to genres for 1978
genre_mapping = {
    # Pop / Disco / Soft Rock
    "Abba": "Pop",
    "Bee Gees": "Pop",
    "Billy Joel": "Pop",
    "Dan Hartman": "Pop",
    "Elton John": "Pop",
    "Gerry Rafferty": "Pop",
    "Michael Jackson": "Pop",
    "Michael Johnson": "Pop",
    "Village People": "Pop",
    "10cc": "Pop",
    "Rod Stewart": "Pop",
    "The Moody Blues": "Pop",
    "Toto": "Pop",
    "Fleetwood Mac": "Pop",
    "Kate Bush": "Pop", # Art Pop
    
    # Rock / Alternativo / New Wave / Post-Punk / Classic Rock
    "Elvis Costello": "Rock Alternativo",
    "Elvis Costello & The Attractions": "Rock Alternativo",
    "The Police": "Rock Alternativo",
    "The Cure": "Rock Alternativo",
    "Siouxsie & The Banshees": "Rock Alternativo",
    "Siouxsie and the Banshees": "Rock Alternativo",
    "The Stranglers": "Rock Alternativo",
    "Public Image Limited": "Rock Alternativo",
    "XTC": "Rock Alternativo",
    "Dire Straits": "Rock Alternativo",
    "Cold Chisel": "Rock Alternativo",
    "John Mellencamp": "Rock Alternativo",
    "Genesis": "Rock Alternativo",
    "Queen": "Rock Alternativo",
    "The Rolling Stones": "Rock Alternativo",
    "Styx": "Rock Alternativo",
    "Journey": "Rock Alternativo",
    "REO Speedwagon": "Rock Alternativo",
    "Rush": "Rock Alternativo",
    "The Cars": "Rock Alternativo", # New Wave
    
    # Metal / Hard Rock
    "AC/DC": "Metal",
    "Alice Cooper": "Metal",
    
    # Punk
    "The Clash": "Punk",
    "The Undertones": "Punk",
    
    # Eletronico
    "Kraftwerk": "Eletronico",
    
    # Country
    "Kenny Rogers": "Country"
}

# Normalize function
def normalize_artist(name):
    if not name:
        return "Unknown"
    return str(name).strip()

# Try to handle potential BOM or encoding issues
try:
    with open('data/1978.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1978.json', 'r') as f:
        data = json.load(f)

# Update the artist_genre
updated_count = 0
for item in data:
    artist_raw = item.get('artist_name')
    artist = normalize_artist(artist_raw)
    
    # Direct match
    if artist in genre_mapping:
        item['artist_genre'] = genre_mapping[artist]
        updated_count += 1
    # Check if artist contains mapped artist
    else:
        for mapped_artist, genre in genre_mapping.items():
            if mapped_artist in artist:
                 item['artist_genre'] = genre
                 updated_count += 1
                 break

# Save back to file
with open('data/1978.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Updated {updated_count} entries.")
