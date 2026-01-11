
import json
import os

# Define the genre mapping for 1985
ARTIST_GENRES = {
    # Rock / Alternativo / New Wave / Classic Rock
    "'Til Tuesday": "Rock Alternativo", # New Wave
    "a-ha": "Pop", # New Wave
    "ABC": "Pop", # New Wave / Synth-pop
    "AC/DC": "Metal", # Hard Rock
    "Accept": "Metal",
    "Aerosmith": "Rock Alternativo", # Hard Rock
    "Air Supply": "Pop", # Soft Rock
    "Alarm (3)": "Rock Alternativo", # New Wave
    "Alcatrazz": "Metal",
    "Alphaville": "Eletronico", # Synth-pop
    "Amy Grant": "Pop", # Christian Pop
    "Animotion": "Pop", # New Wave
    "Arcadia": "Pop", # New Wave (Duran Duran spin-off)
    "Art Of Noise": "Eletronico",
    "Artists United Against Apartheid": "Rock Alternativo",
    "B.B. King": "Rock Alternativo", # Blues
    "Bad Boys Blue": "Dance", # Euro Disco
    "Baltimora": "Dance", # Italo Disco
    "Beastie Boys": "Rap", # Early Hip Hop
    "Big Audio Dynamite": "Rock Alternativo", # Post-Punk
    "Big Country": "Rock Alternativo",
    "Billy Joel": "Pop", # Rock
    "Bob Dylan": "Rock Alternativo", # Folk Rock
    "Bolshoi, The": "Rock Alternativo", # Post-Punk
    "Bon Jovi": "Rock Alternativo", # Glam Metal
    "Bonnie Tyler": "Pop", # Rock
    "Bruce Springsteen": "Rock Alternativo", # Heartland Rock
    "Bryan Adams": "Pop", # Rock
    "Bryan Ferry": "Pop", # Art Pop
    "Candy": "Rock Alternativo", # Power Pop
    "Cheap Trick": "Rock Alternativo", # Power Pop
    "Claudio Simonetti": "Eletronico",
    "Corey Hart": "Pop",
    "Cyndi Lauper": "Pop",
    "Dan Hartman": "Pop",
    "David Bowie": "Rock Alternativo", # Art Rock
    "David Lee Roth": "Rock Alternativo", # Hard Rock
    "Dead Or Alive": "Dance", # Hi-NRG
    "Depeche Mode": "Eletronico", # Synth-pop
    "Dire Straits": "Rock Alternativo", # Rock
    "Dokken": "Metal", # Glam Metal
    "Duran Duran": "Pop", # New Wave
    "EAV (Erste Allgemeine Verunsicherung)": "Pop",
    "Echo & The Bunnymen": "Rock Alternativo", # Post-Punk
    "Electric Light Orchestra": "Rock Alternativo",
    "Elton John": "Pop", # Rock
    "Erasure": "Pop", # Synth-pop
    "Eurythmics": "Pop", # New Wave / Synth-pop
    "Everything But The Girl": "Pop", # Sophisti-pop
    "Faith No More": "Rock Alternativo", # Funk Metal
    "Falco": "Pop", # New Wave
    "Fishbone": "Rock Alternativo", # Ska Punk
    "George Strait": "Country",
    "Glenn Frey": "Pop", # Rock
    "Godley & Creme": "Rock Alternativo",
    "Goon Squad": "Dance",
    "Gowan": "Rock Alternativo", # Prog Pop
    "Heart": "Rock Alternativo", # Hard Rock
    "Herva Doce": "Rock Alternativo", # Rock Brasileiro
    "Honeymoon Suite": "Rock Alternativo",
    "Howard Jones": "Pop", # Synth-pop
    "Huey Lewis": "Pop", # Rock
    "Icehouse": "Rock Alternativo", # New Wave
    "Indochine": "Rock Alternativo", # New Wave
    "INXS": "Rock Alternativo", # New Wave
    "Jayhawks": "Rock Alternativo", # Alt-Country
    "Jeff Beck": "Rock Alternativo", # Rock Instrumental
    "Jimmy Barnes": "Rock Alternativo", # Pub Rock
    "Joe Walsh": "Rock Alternativo",
    "John Fogerty": "Rock Alternativo", # Heartland Rock
    "John Mellencamp": "Rock Alternativo", # Heartland Rock
    "John Parr": "Pop", # Rock
    "Joni Mitchell": "Pop", # Folk
    "Kate Bush": "Rock Alternativo", # Art Pop
    "Killing Joke": "Rock Alternativo", # Post-Punk
    "Kirlian Camera": "Eletronico", # Dark Wave
    "Kiss": "Metal", # Glam Metal
    "Legião Urbana": "Rock Alternativo", # Rock Brasileiro
    "Level 42": "Pop", # Jazz-Funk
    "Litfiba": "Rock Alternativo", # New Wave / Rock Italiano
    "Loverboy": "Rock Alternativo", # Hard Rock
    "Madness": "Pop", # Ska
    "Makin' Time": "Rock Alternativo", # Mod Revival
    "Marc Almond": "Pop", # Synth-pop
    "Matt Bianco": "Pop", # Sophisti-pop
    "Mecano": "Pop", # Synth-pop
    "Men At Work": "Pop", # New Wave
    "Michael Bolton": "Pop", # Rock (early)
    "Mick Jagger": "Rock Alternativo",
    "Mike + The Mechanics": "Pop", # Rock
    "Miko Mission": "Dance", # Italo Disco
    "Modern Rocketry": "Dance", # Hi-NRG
    "Modern Talking": "Pop", # Euro Disco
    "Mötley Crüe": "Metal", # Glam Metal
    "Mr. Mister": "Pop", # Pop Rock
    "Murray Head": "Pop", # New Wave
    "New Order": "Eletronico", # Synth-pop / New Wave
    "Night Ranger": "Rock Alternativo", # Hard Rock
    "Nik Kershaw": "Pop", # Synth-pop
    "Oingo Boingo": "Rock Alternativo", # New Wave
    "Opus": "Pop", # Pop Rock
    "Orchestral Manoeuvres In The Dark": "Eletronico", # Synth-pop
    "Pat Benatar": "Rock Alternativo", # Rock
    "Paul Young": "Pop", # Blue-eyed Soul
    "Pet Shop Boys": "Pop", # Synth-pop
    "Peter Himmelman": "Rock Alternativo",
    "Phil Collins": "Pop", # Pop Rock
    "Platinum Blonde": "Rock Alternativo", # New Wave
    "Prefab Sprout": "Pop", # Sophisti-pop
    "Prince": "Pop", # Funk / Rock
    "Queen": "Rock Alternativo", # Rock
    "R. Bias": "Eletronico", # Italo Disco
    "Radiorama": "Dance", # Italo Disco
    "RAH Band": "Eletronico", # Synth-pop
    "Ratt": "Metal", # Glam Metal
    "REO Speedwagon": "Rock Alternativo", # Hard Rock
    "Rick Springfield": "Pop", # Power Pop
    "Robert Plant": "Rock Alternativo",
    "Robin Gibb": "Pop",
    "Roger Daltrey": "Rock Alternativo",
    "RPM (3)": "Rock Alternativo", # Rock Brasileiro
    "Rush": "Rock Alternativo", # Prog Rock
    "Ryuichi Sakamoto": "Eletronico",
    "Santana": "Rock Alternativo",
    "Sawyer Brown": "Country",
    "Scorpions": "Metal", # Hard Rock
    "Scritti Politti": "Pop", # Synth-pop
    "Shriekback": "Rock Alternativo", # Post-Punk
    "Simon Fellowes": "Pop",
    "Simple Minds": "Rock Alternativo", # New Wave
    "Simply Red": "Pop", # Soul/Pop
    "Siouxsie & The Banshees": "Rock Alternativo", # Post-Punk / Goth
    "Smash Palace": "Rock Alternativo",
    "Sparks": "Pop", # Synth-pop
    "Starship (2)": "Pop", # Rock
    "Steve Earle": "Country", # Alt-Country
    "Steve Perry": "Pop", # Rock
    "Stevie Ray Vaughan & Double Trouble": "Rock Alternativo", # Blues Rock
    "Stiff All Stars": "Pop",
    "Sting": "Pop", # Rock / Jazz Pop
    "Suicidal Tendencies": "Hardcore", # Crossover Thrash
    "Supertramp": "Pop", # Prog Pop
    "Survivor": "Rock Alternativo", # Hard Rock
    "Talk Talk": "Rock Alternativo", # Synth-pop / Art Rock
    "Talking Heads": "Rock Alternativo", # New Wave
    "Tears For Fears": "Pop", # New Wave
    "The Alan Parsons Project": "Rock Alternativo", # Prog Rock
    "The Beach Boys": "Pop", # Rock
    "The Blow Monkeys": "Pop", # New Wave
    "The Cars": "Rock Alternativo", # New Wave
    "The Cult": "Rock Alternativo", # Post-Punk / Hard Rock
    "The Cure": "Rock Alternativo", # Post-Punk / New Wave
    "The Dream Academy": "Pop", # Dream Pop
    "The Hooters": "Rock Alternativo",
    "The Jesus And Mary Chain": "Rock Alternativo", # Noise Pop / Shoegaze
    "The Kelly Family": "Pop", # Folk Pop
    "The Motels": "Pop", # New Wave
    "The Outfield": "Pop", # Power Pop
    "The Power Station": "Rock Alternativo", # New Wave / Funk Rock
    "The Rolling Stones": "Rock Alternativo",
    "The Sisters Of Mercy": "Rock Alternativo", # Goth Rock
    "The Smiths": "Rock Alternativo", # Indie Pop
    "The Tubes": "Rock Alternativo", # New Wave
    "The Twins": "Eletronico", # Synth-pop
    "Thomas Dolby": "Eletronico", # Synth-pop
    "Thompson Twins": "Pop", # Synth-pop
    "Tom Petty And The Heartbreakers": "Rock Alternativo",
    "Tom Waits": "Rock Alternativo", # Experimental
    "Toto": "Rock Alternativo", # Pop Rock
    "Translator (3)": "Rock Alternativo", # New Wave
    "Twisted Sister": "Metal", # Glam Metal
    "U2": "Rock Alternativo",
    "Uns E Outros": "Rock Alternativo", # Rock Brasileiro
    "USA For Africa": "Pop",
    "Violent Femmes": "Rock Alternativo", # Folk Punk
    "W.A.S.P.": "Metal", # Glam Metal / Shock Rock
    "Wang Chung": "Pop", # New Wave
    "Warrior (6)": "Metal",
    "Weird Al Yankovic": "Pop", # Comedy
    "X": "Punk",
    "Yello": "Eletronico", # Synth-pop
    "ZZ Top": "Rock Alternativo", # Blues Rock

    # Pop / R&B / Dance
    "Alison Moyet": "Pop",
    "Allee Willis": "Pop",
    "Atlantic Starr": "Pop", # R&B
    "Bananarama": "Pop",
    "Barbra Streisand": "Pop",
    "Billy Ocean": "Pop", # R&B
    "C.C. Catch": "Dance", # Euro Disco
    "Chaka Khan": "Pop", # Funk / R&B
    "Chess": "Pop", # Musical
    "Cliff Richard": "Pop",
    "DeBarge": "Pop", # R&B
    "Dionne Warwick": "Pop", # R&B
    "Eddie Murphy": "Pop",
    "Exposé": "Dance", # Freestyle
    "Full Force (3)": "Rap", # Hip Hop / R&B
    "Gloria Estefan": "Pop",
    "Go West": "Pop",
    "Jermaine Jackson": "Pop", # R&B
    "Julie Brown": "Pop", # Comedy
    "Kathy Mattea": "Country",
    "Kenny Loggins": "Pop",
    "Kim Carnes": "Pop",
    "Klymaxx": "Pop", # R&B
    "Kurtis Blow": "Rap", # Old School Hip Hop
    "Laura Branigan": "Pop",
    "Laurent Voulzy": "Pop",
    "Lionel Richie": "Pop", # R&B
    "Lisa Lisa & Cult Jam": "Dance", # Freestyle
    "Madonna": "Pop",
    "Maurice White": "Pop", # R&B
    "New Edition": "Pop", # R&B
    "Nu Shooz": "Dance", # Freestyle / R&B
    "Olivia Newton-John": "Pop",
    "Ray Parker Jr.": "Pop", # R&B
    "Rene & Angela": "Pop", # R&B
    "Rick James": "Pop", # Funk / R&B
    "Run-DMC": "Rap", # Hip Hop
    "Sade": "Pop", # Smooth Jazz / R&B
    "Sandra": "Pop", # Euro Disco
    "Shannon": "Dance", # Freestyle
    "Sheena Easton": "Pop",
    "Simon Fellowes": "Pop",
    "The Chicago Bears Shufflin' Crew": "Rap", # Novelty
    "The Pointer Sisters": "Pop", # R&B
    "Tina Arena": "Pop",
    "UB40": "Pop", # Reggae
    "Village People": "Dance", # Disco
    "Whitney Houston": "Pop", # R&B
}

def enrich_genres():
    input_path = 'data/1985.json'
    
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
