import json

def extract_artists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    artists = set()
    for entry in data:
        if 'artist_name' in entry:
            artists.add(entry['artist_name'])
    
    sorted_artists = sorted(list(str(a) for a in artists))
    
    for artist in sorted_artists:
        print(artist)

if __name__ == "__main__":
    extract_artists('data/2004.json')
