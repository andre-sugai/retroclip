
import json
import os

# Define the genre mapping
ARTIST_GENRES = {
    # Rock Alternativo / Indie / Grunge
    "Alice In Chains": "Rock Alternativo",
    "All About Eve": "Rock Alternativo",
    "Big Audio Dynamite": "Rock Alternativo",
    "Big Country": "Rock Alternativo",
    "Blur": "Rock Alternativo",
    "BoDeans": "Rock Alternativo",
    "Chris Whitley": "Rock Alternativo",
    "Crash Test Dummies": "Rock Alternativo",
    "Drivin' N' Cryin'": "Rock Alternativo",
    "EMF": "Rock Alternativo",
    "fIREHOSE": "Rock Alternativo",
    "Fish": "Rock Alternativo",
    "Fishbone": "Rock Alternativo",
    "Follow For Now": "Rock Alternativo",
    "Hole": "Rock Alternativo",
    "Indochine": "Rock Alternativo",
    "Infectious Grooves": "Rock Alternativo",
    "Inside Out": "Rock Alternativo",
    "Jellyfish (2)": "Rock Alternativo",
    "Joe Henry": "Rock Alternativo",
    "Joy Division": "Rock Alternativo",
    "L7": "Rock Alternativo",
    "Last Crack": "Rock Alternativo",
    "Les Objets": "Rock Alternativo",
    "Litfiba": "Rock Alternativo",
    "Live": "Rock Alternativo",
    "Living Colour": "Rock Alternativo",
    "Lush": "Rock Alternativo",
    "Magnolias": "Rock Alternativo",
    "Manic Street Preachers": "Rock Alternativo",
    "Material Issue": "Rock Alternativo",
    "Meat Puppets": "Rock Alternativo",
    "Morrissey": "Rock Alternativo",
    "My Bloody Valentine": "Rock Alternativo",
    "Nirvana": "Rock Alternativo",
    "Pale Saints": "Rock Alternativo",
    "Pearl Jam": "Rock Alternativo",
    "Pixies": "Rock Alternativo",
    "Pop's Cool Love": "Rock Alternativo",
    "Primal Scream": "Rock Alternativo",
    "Primus": "Rock Alternativo",
    "R.E.M.": "Rock Alternativo",
    "Red Hot Chili Peppers": "Rock Alternativo",
    "Ride": "Rock Alternativo",
    "Screaming Trees": "Rock Alternativo",
    "Siouxsie & The Banshees": "Rock Alternativo",
    "Sonic Youth": "Rock Alternativo",
    "Soundgarden": "Rock Alternativo",
    "Spirea X": "Rock Alternativo",
    "Stan Ridgeway": "Rock Alternativo",
    "Teenage Fanclub": "Rock Alternativo",
    "The Afghan Whigs": "Rock Alternativo",
    "The Blue Aeroplanes": "Rock Alternativo",
    "The Charlatans": "Rock Alternativo",
    "The Connells": "Rock Alternativo",
    "The Dream Academy": "Rock Alternativo",
    "The Godfathers": "Rock Alternativo",
    "The Lightning Seeds": "Rock Alternativo",
    "The Psychedelic Furs": "Rock Alternativo",
    "The Smashing Pumpkins": "Rock Alternativo",
    "The Tragically Hip": "Rock Alternativo",
    "The Wolfgang Press": "Rock Alternativo",
    "This Mortal Coil": "Rock Alternativo",
    "Throwing Muses": "Rock Alternativo",
    "Tin Machine": "Rock Alternativo",
    "Toad The Wet Sprocket": "Rock Alternativo",
    "Tori Amos": "Pop", # Alt Pop
    "Violent Femmes": "Rock Alternativo",
    "Voice Of The Beehive": "Rock Alternativo",
    "Warren Zevon": "Rock Alternativo",
    "Xymox": "Rock Alternativo",
    "Ziggy Marley": "Pop", # Reggae
    
    # Metal / Hard Rock
    "AC/DC": "Metal",
    "Aerosmith": "Metal",
    "Alice Cooper": "Metal",
    "Asphalt Ballet": "Metal",
    "Bad English": "Metal", # Hard Rock
    "Cheap Trick": "Metal", # Classic/Hard Rock
    "Cinderella": "Metal",
    "Corrosion Of Conformity": "Metal",
    "Cycle Sluts From Hell": "Metal",
    "Drop Hammer": "Metal",
    "Entombed": "Metal",
    "Europe": "Metal",
    "Extreme": "Metal",
    "Firehouse": "Metal",
    "Great White": "Metal",
    "Guns N' Roses": "Metal",
    "House Of Lords (2)": "Metal",
    "Kane Roberts": "Metal",
    "Kik Tracee": "Metal",
    "Lita Ford": "Metal",
    "Little Angels": "Metal",
    "Megadeth": "Metal",
    "Meshuggah": "Metal",
    "Metallica": "Metal",
    "Mötley Crüe": "Metal",
    "Motörhead": "Metal",
    "Mr. Big": "Metal",
    "Nitro": "Metal",
    "Nymphs": "Metal",
    "Ozzy Osbourne": "Metal",
    "Poison": "Metal",
    "Queen": "Metal", # Classic Rock
    "Queensrÿche": "Metal",
    "Ratt": "Metal",
    "Razor (2)": "Metal",
    "Richie Sambora": "Metal",
    "Rush": "Rock Alternativo", # Prog
    "Scorpions": "Metal",
    "Sepultura": "Metal",
    "Steelheart": "Metal",
    "Survivor": "Metal", # Rock
    "Tesla": "Metal",
    "The Almighty": "Metal",
    "The Wild Boyz": "Metal",
    "Ugly Kid Joe": "Metal",
    "Van Halen": "Metal",
    "Voïvod": "Metal",
    "Warrant": "Metal",
    "Winger": "Metal",
    "Zodiac Mindwarp": "Metal",

    # Rap / Hip Hop
    "2Pac": "Rap",
    "Another Bad Creation": "Rap",
    "Bell Biv DeVoe": "Rap", # R&B/HipHop
    "Bytches With Problems": "Rap",
    "Cypress Hill": "Rap",
    "De La Soul": "Rap",
    "DJ Quik": "Rap",
    "Dream Warriors": "Rap",
    "Gerardo": "Rap", # Pop Rap
    "Heavy D. & The Boyz": "Rap",
    "Ice Cube": "Rap",
    "K9 Posse": "Rap",
    "LL Cool J": "Rap",
    "Marky Mark & The Funky Bunch": "Rap",
    "MC Hammer": "Rap",
    "Naughty By Nature": "Rap",
    "N.W.A.": "Rap", # Often under known names
    "Oaktown's 3-5-7": "Rap",
    "P.M. Dawn": "Rap",
    "Public Enemy": "Rap",
    "Salt 'N' Pepa": "Rap",
    "Slick Rick": "Rap",
    "Stereo MCs": "Rap",
    "Vanilla Ice": "Rap",
    "Young MC": "Rap",

    # Pop / R&B / Mainstream
    "a-ha": "Pop",
    "ABC": "Pop",
    "Acosta/Russell": "Pop",
    "Alanis Morissette": "Pop", # Pop era
    "Alison Moyet": "Pop",
    "Amy Grant": "Pop",
    "B Angie B": "Pop", # R&B
    "Baby Animals": "Pop", # Rock
    "Bananarama": "Pop",
    "Barry White": "Pop", # R&B
    "Beckie Bell": "Pop",
    "Bee Gees": "Pop",
    "Belinda Carlisle": "Pop",
    "Billy Joel": "Pop",
    "Bob Dylan": "Rock Alternativo",
    "Boyz II Men": "Pop", # R&B
    "Bros": "Pop",
    "Bryan Adams": "Pop", # Rock
    "Carmen Electra": "Pop",
    "Cathy Dennis": "Pop",
    "Céline Dion": "Pop",
    "Chayanne": "Pop",
    "Cher": "Pop",
    "Chesney Hawkes": "Pop",
    "Choirboys, The": "Pop",
    "Chris Cuevas": "Pop",
    "Chris Isaak": "Pop", # Rock
    "Chris Rea": "Pop",
    "Color Me Badd": "Pop", # R&B
    "David Hasselhoff": "Pop",
    "Debbie Gibson": "Pop",
    "Des'ree": "Pop",
    "Die Prinzen": "Pop",
    "Dire Straits": "Pop", # Rock
    "Divinyls": "Pop", # Rock
    "Donny Osmond": "Pop",
    "Eddie Money": "Pop", # Rock
    "Enya": "Pop", # New Age
    "Everything But The Girl": "Pop",
    "Genesis": "Pop",
    "George Michael": "Pop",
    "Glass Tiger": "Pop",
    "Glenn Frey": "Pop",
    "Gloria Estefan": "Pop",
    "Go-Go's": "Pop",
    "Harry Connick, Jr.": "Pop",
    "Huey Lewis": "Pop",
    "Jermaine Jackson": "Pop",
    "Jody Watley": "Pop",
    "John Mellencamp": "Pop", # Rock
    "Johnny Hates Jazz": "Pop",
    "Jon Lucien": "Pop",
    "Karyn White": "Pop",
    "Keedy": "Pop",
    "Kenny Loggins": "Pop",
    "Kim Appleby": "Pop",
    "Kylie Minogue": "Pop",
    "Lenny Kravitz": "Pop", # Rock
    "Lio": "Pop",
    "Lisa Stansfield": "Pop",
    "Little Richard": "Pop",
    "Lonnie Gordon": "Pop",
    "Marc Cohn": "Pop",
    "Mariah Carey": "Pop",
    "Martika": "Pop",
    "Mecano": "Pop",
    "Men Without Hats": "Pop",
    "Michael Bolton": "Pop",
    "Michael Jackson": "Pop",
    "Michael Learns To Rock": "Pop",
    "Mint Condition": "Pop",
    "Natalie Cole": "Pop",
    "New Kids On The Block": "Pop",
    "Nik Kershaw": "Pop",
    "Noiseworks": "Pop", # Rock
    "Nuclear Valdez": "Pop",
    "Pat Benatar": "Pop",
    "Paula Abdul": "Pop",
    "Peace Choir": "Pop",
    "Peter Kitsch": "Pop",
    "Prince": "Pop",
    "R. Kelly": "Pop", # R&B
    "Ricky Martin": "Pop",
    "Robbie Nevil": "Pop",
    "Robert Cray": "Pop", # Blues
    "Rod Stewart": "Pop",
    "Roxette": "Pop",
    "Sarah McLachlan": "Pop",
    "Scritti Politti": "Pop",
    "Seal": "Pop",
    "Selena": "Pop",
    "Shakespear's Sister": "Pop",
    "Shanice": "Pop",
    "Sheena Easton": "Pop",
    "Simple Minds": "Pop",
    "Simply Red": "Pop",
    "Sinéad O'Connor": "Pop",
    "Soft Cell": "Pop",
    "Southside Johnny": "Pop",
    "Spagna": "Pop",
    "State Of Art": "Pop",
    "Stereo MCs": "Pop", # / Electronic
    "Steve Winwood": "Pop",
    "Stevie Nicks": "Pop",
    "Sting": "Pop",
    "Stress (6)": "Pop",
    "Swimming The Nile": "Pop",
    "T'Pau": "Pop",
    "Texas": "Pop",
    "Thalía": "Pop",
    "The Christians": "Pop",
    "The Rolling Stones": "Pop", # Rock
    "Thompson Twins": "Pop",
    "Tina Turner": "Pop",
    "Tom Petty And The Heartbreakers": "Pop", # Rock
    "Transvision Vamp": "Pop",
    "Traveling Wilburys": "Pop", # Rock
    "U2": "Rock Alternativo", # Pop/Rock
    "UB40": "Pop",
    "Vanessa Williams": "Pop",
    "Vic Reeves": "Pop",
    "Wet Wet Wet": "Pop",
    "Yes": "Pop", # Prog
    "Zucchero": "Pop",

    # Dance / Electronic
    "2 Unlimited": "Dance",
    "808 State": "Eletronico",
    "Adamski": "Dance",
    "CeCe Peniston": "Dance",
    "Crystal Waters": "Dance",
    "Depeche Mode": "Eletronico",
    "Dr. Alban": "Dance",
    "Dr. Baker": "Dance",
    "Erasure": "Eletronico", # Synth-pop
    "Frankie Knuckles": "Dance",
    "Kraftwerk": "Eletronico",
    "Massive Attack": "Eletronico",
    "Moodswings": "Eletronico",
    "Mr. Lee": "Dance",
    "Orbital": "Eletronico",
    "Orchestral Manoeuvres In The Dark": "Eletronico", # Synth-pop
    "Pet Shop Boys": "Pop", # Synth-pop
    "Right Said Fred": "Pop",
    "The Brand New Heavies": "Dance", # Acid Jazz
    "The KLF": "Eletronico",
    "The Prodigy": "Eletronico",
    "The Shamen": "Eletronico",
    "Yello": "Eletronico",

    # Country
    "Alan Jackson": "Country",
    "Brooks & Dunn": "Country",
    "Clint Black": "Country",
    "Collin Raye": "Country",
    "Darden Smith": "Country",
    "Diamond Rio": "Country",
    "Dwight Yoakam": "Country",
    "George Strait": "Country",
    "Holly Dunn": "Country",
    "Joe Diffie": "Country",
    "Kathy Mattea": "Country",
    "Los Tigres Del Norte": "Country",
    "Martina McBride": "Country",
    "Marty Stuart": "Country",
    "Pete Anderson & The Archives": "Country",
    "Prairie Oyster": "Country",
    "Reba McEntire": "Country",
    "Roadhouse": "Country", # ?
    "Sammy Kershaw": "Country",
    "Trisha Yearwood": "Country",

    # Punk
    "Bad Religion": "Punk",
}

def enrich_genres():
    input_path = 'data/1991.json'
    
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
