import json

# Mapping of artists to genres for 1974
genre_mapping = {
    "Abba": "Pop",
    "Billy Joel": "Pop",
    "John Lennon": "Rock Alternativo",
    "Queen": "Rock Alternativo",
    "Rod Stewart": "Pop",
    "Sparks": "Rock Alternativo",
    "AC/DC": "Metal",
    "Kraftwerk": "Eletronico",
    "George Harrison": "Pop"
}

# Normalize function
def normalize_artist(name):
    if not name:
        return "Unknown"
    return str(name).strip()

try:
    with open('data/1974.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1974.json', 'r') as f:
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
with open('data/1974.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Updated {updated_count} entries.")
