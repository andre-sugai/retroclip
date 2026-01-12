import json

with open('data/1986.json', 'r') as f:
    data = json.load(f)

artists = sorted(list(set(item['artist_name'] for item in data)))
for artist in artists:
    print(artist)
