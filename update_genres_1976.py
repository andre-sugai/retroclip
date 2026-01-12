import json

# Mapping of artists to genres for 1976
genre_mapping = {
    "Abba": "Pop",
    "AC/DC": "Metal",
    "Queen": "Rock Alternativo",
    "Rod Stewart": "Pop",
    "Elton John": "Pop",
    "Kiss": "Metal",
    "10cc": "Pop",
    "The Rolling Stones": "Rock Alternativo",
    "Genesis": "Rock Alternativo",
    "George Harrison": "Pop",
    "Wings (5)": "Pop",
    "Electric Light Orchestra": "Pop",
    "Cliff Richard": "Pop",
    "The Tubes": "Rock Alternativo"
}

# Normalize function
def normalize_artist(name):
    if not name:
        return "Unknown"
    return str(name).strip()

try:
    with open('data/1976.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1976.json', 'r') as f:
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
with open('data/1976.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Updated {updated_count} entries.")
