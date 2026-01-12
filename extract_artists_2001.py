import json

def extract_artists(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)

    artists = set()
    for video in data:
        if 'artist_name' in video:
            artists.add(video['artist_name'])
        elif 'artist' in video:
            artists.add(video['artist'])

    return sorted([str(a) for a in artists])

if __name__ == "__main__":
    artists = extract_artists('data/2001.json')
    for artist in artists:
        print(artist)
