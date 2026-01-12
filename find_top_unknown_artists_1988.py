import json
from collections import Counter

with open('data/1988.json', 'r') as f:
    data = json.load(f)

unknown_artists = [item.get('artist_name', 'Unknown') for item in data if item.get('artist_genre') == 'Desconhecido']
counter = Counter(unknown_artists)

print("Top unknown artists:")
for artist, count in counter.most_common(100):
    print(f"{artist}: {count}")
