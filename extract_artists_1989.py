import json

with open('data/1989.json', 'r') as f:
    data = json.load(f)

artists = sorted(list(set(str(item.get('artist_name', 'Unknown')) for item in data)))
for artist in artists:
    print(artist)
