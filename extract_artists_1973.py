import json

try:
    with open('data/1973.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
except:
    with open('data/1973.json', 'r') as f:
        data = json.load(f)

artists = sorted(list(set(str(item.get('artist_name', 'Unknown')) for item in data)))
for artist in artists:
    print(artist)
