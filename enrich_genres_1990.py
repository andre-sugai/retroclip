
import json
import os

# Define the genre mapping
ARTIST_GENRES = {
    # Rock Alternativo
    "Afterhours": "Rock Alternativo",
    "Big Country": "Rock Alternativo",
    "Blues Traveler": "Rock Alternativo",
    "Bob Dylan": "Rock Alternativo",
    "Cocteau Twins": "Rock Alternativo",
    "EMF": "Rock Alternativo",
    "Gruntruck": "Rock Alternativo",
    "Hothouse Flowers": "Rock Alternativo",
    "Icehouse": "Rock Alternativo",
    "Iggy Pop": "Rock Alternativo",
    "Indochine": "Rock Alternativo",
    "Inside Out": "Rock Alternativo",
    "James": "Rock Alternativo",
    "Jane's Addiction": "Rock Alternativo",
    "Litfiba": "Rock Alternativo",
    "Living Colour": "Rock Alternativo",
    "Lush": "Rock Alternativo",
    "Midnight Oil": "Rock Alternativo",
    "New Order": "Rock Alternativo",
    "Oui Oui": "Rock Alternativo",
    "Pixies": "Rock Alternativo",
    "Ride": "Rock Alternativo",
    "Robert Forster": "Rock Alternativo",
    "Rush": "Rock Alternativo",
    "Sonic Youth": "Rock Alternativo",
    "Soundgarden": "Rock Alternativo",
    "Suzanne Vega": "Rock Alternativo",
    "The Breeders": "Rock Alternativo",
    "The Charlatans": "Rock Alternativo",
    "The Connells": "Rock Alternativo",
    "The Cure": "Rock Alternativo",
    "The Rolling Stones": "Rock Alternativo",
    "The Sundays": "Rock Alternativo",
    "Urge Overkill": "Rock Alternativo",
    "ZZ Top": "Rock Alternativo",

    # Metal
    "AC/DC": "Metal",
    "Aerosmith": "Metal",
    "Aftershock": "Metal",
    "Alice Cooper": "Metal",
    "Cinderella": "Metal",
    "Danzig": "Metal",
    "Iron Maiden": "Metal",
    "Johnny Crash": "Metal",
    "Judas Priest": "Metal",
    "Kiss": "Metal",
    "Lita Ford": "Metal",
    "Megadeth": "Metal",
    "Mötley Crüe": "Metal",
    "Pantera": "Metal",
    "Queensrÿche": "Metal",
    "Ratt": "Metal",
    "Slayer": "Metal",
    "Tesla": "Metal",
    "Xentrix (2)": "Metal",
    "Yngwie Malmsteen": "Metal",
    "Suicidal Tendencies": "Metal",

    # Punk
    "Bad Religion": "Punk", # If present
    "Libido Boyz": "Punk",

    # Rap
    "Another Bad Creation": "Rap",
    "Bell Biv DeVoe": "Rap",
    "CPO": "Rap",
    "Eric B. & Rakim": "Rap",
    "Ice Cube": "Rap",
    "Kid Frost": "Rap",
    "N.W.A.": "Rap",
    "Salt 'N' Pepa": "Rap",

    # Pop
    "Alannah Myles": "Pop",
    "Alias (2)": "Pop",
    "Alphaville": "Pop",
    "Andrew Ridgeley": "Pop",
    "Arcangel": "Pop",
    "Bananarama": "Pop",
    "Bart Simpson": "Pop",
    "Basia": "Pop",
    "Belinda Carlisle": "Pop",
    "Bette Midler": "Pop",
    "Billy Idol": "Pop",
    "Billy Joel": "Pop",
    "Chayanne": "Pop",
    "Cliff Richard": "Pop",
    "Corey Hart": "Pop",
    "Daryl Braithwaite": "Pop",
    "EAV (Erste Allgemeine Verunsicherung)": "Pop",
    "En Vogue": "Pop",
    "Erasure": "Pop",
    "Eurythmics": "Pop",
    "Everything But The Girl": "Pop",
    "Falco": "Pop",
    "Harry Connick, Jr.": "Pop",
    "Herbert Grönemeyer": "Pop",
    "Kim Appleby": "Pop",
    "Kim Wilde": "Pop",
    "Klymaxx": "Pop",
    "Lisa Stansfield": "Pop",
    "Madonna": "Pop",
    "Nenah Cherry": "Pop",
    "Paul Simon": "Pop",
    "Pet Shop Boys": "Pop",
    "Phil Collins": "Pop",
    "Rainhard Fendrich": "Pop",
    "Rod Stewart": "Pop",
    "Sandra": "Pop",
    "Seal": "Pop",
    "Seduction": "Pop",
    "Soul II Soul": "Pop",
    "Styx": "Pop",
    "Taylor Dayne": "Pop",
    "Texas": "Pop",
    "Thalía": "Pop",
    "The Outfield": "Pop",
    "The Pointer Sisters": "Pop",
    "Toto": "Pop",
    "Whitney Houston": "Pop",

    # Dance
    "Black Box": "Dance",
    "Dr. Baker": "Dance",

    # Eletronico
    "808 State": "Eletronico",
    "Claudio Simonetti": "Eletronico",
    "Information Society": "Eletronico",

    # Country
    "Los Tigres Del Norte": "Country",
    "Rodney Crowell": "Country",
    "Rosanne Cash": "Country",
    "Steve Earle": "Country",
}

def enrich_genres():
    input_path = 'data/1990.json'
    
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated_count = 0
    missing_artists = set()

    for video in data:
        # Normalize key: 'artist_name' -> 'artist'
        if 'artist_name' in video:
            video['artist'] = video.pop('artist_name')
        
        artist = str(video.get('artist', '')).strip()
        
        # Try exact match
        if artist in ARTIST_GENRES:
            video['artist_genre'] = ARTIST_GENRES[artist]
            updated_count += 1
        else:
            # Fallback
            # Check matches from previous scripts for safety if needed, or leave as Desconhecido
            missing_artists.add(artist)
            video['artist_genre'] = "Desconhecido"

    # Save back
    with open(input_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Updated {updated_count} videos.")
    print(f"Missing mappings for {len(missing_artists)} artists.")
    if missing_artists:
        print("Sample missing:", list(missing_artists)[:20])

if __name__ == "__main__":
    enrich_genres()
