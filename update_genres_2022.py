import json

# Mapping of artists to genres for 2022
genre_mapping = {
    # Pop
    "Harry Styles": "Pop",
    "Taylor Swift": "Pop",
    "Lizzo": "Pop",
    "Adele": "Pop",
    "Doja Cat": "Pop",
    "ROSALÍA": "Pop",
    "Rosalía": "Pop",
    "Anitta": "Pop",
    "Karol G": "Pop",
    "Camila Cabello": "Pop",
    "Charlie Puth": "Pop",
    "Shawn Mendes": "Pop",
    "Ed Sheeran": "Pop",
    "Justin Bieber": "Pop",
    "Ariana Grande": "Pop",
    "Dua Lipa": "Pop",
    "Miley Cyrus": "Pop",
    "Beyoncé": "Pop",
    "Lady Gaga": "Pop",
    "Rihanna": "Pop",
    "Sia": "Pop",
    "Katy Perry": "Pop",
    "Billie Eilish": "Pop",
    "Olivia Rodrigo": "Pop",
    "Sabrina Carpenter": "Pop",
    "Halsey": "Pop",
    "Tate McRae": "Pop",
    "Ava Max": "Pop",
    "Bebe Rexha": "Pop",
    "Meghan Trainor": "Pop",
    "Kim Petras": "Pop",
    "Charli XCX": "Pop",
    "Rina Sawayama": "Pop",
    "Carly Rae Jepsen": "Pop",
    "Dove Cameron": "Pop",
    "Conan Gray": "Pop",
    "Lewis Capaldi": "Pop",
    "Sam Smith": "Pop",
    "Post Malone": "Pop", # Crossover
    "The Weeknd": "Pop",
    "SZA": "Pop", # R&B
    "Joji": "Pop",
    "Pink": "Pop",
    "P!nk": "Pop",
    "Shakira": "Pop",
    "Jennifer Lopez": "Pop",
    "Blackpink": "Pop",
    "BTS": "Pop",
    "Twice": "Pop",
    "Stray Kids": "Pop",
    "(G)I-DLE": "Pop",
    "NewJeans": "Pop",
    "IVE": "Pop",
    "LE SSERAFIM": "Pop",
    "ITZY": "Pop",
    "Itzy": "Pop",
    "Aespa": "Pop",
    "SEVENTEEN": "Pop",
    "TXT": "Pop",
    "NCT 127": "Pop",
    "NCT DREAM": "Pop",
    "Psy": "Pop",
    "Coldplay": "Pop", # Pop Rock
    "OneRepublic": "Pop",
    "Imagine Dragons": "Pop",
    "Maroon 5": "Pop",
    
    # Rock / Alternativo
    "Arctic Monkeys": "Rock Alternativo",
    "The 1975": "Rock Alternativo",
    "Florence + The Machine": "Rock Alternativo",
    "Paramore": "Rock Alternativo",
    "Red Hot Chili Peppers": "Rock Alternativo",
    "Gorillaz": "Rock Alternativo",
    "Wet Leg": "Rock Alternativo",
    "Muse": "Rock Alternativo",
    "The Killers": "Rock Alternativo",
    "Phoenix": "Rock Alternativo",
    "Yeah Yeah Yeahs": "Rock Alternativo",
    "Interpol": "Rock Alternativo",
    "The Strokes": "Rock Alternativo",
    "Arcade Fire": "Rock Alternativo",
    "Vampire Weekend": "Rock Alternativo",
    "The Black Keys": "Rock Alternativo",
    "Jack White": "Rock Alternativo",
    "Mitski": "Rock Alternativo",
    "Phoebe Bridgers": "Rock Alternativo",
    "Clairo": "Rock Alternativo",
    "Beabadoobee": "Rock Alternativo",
    "Girl In Red": "Rock Alternativo",
    "Maggie Rogers": "Rock Alternativo",
    "Haim": "Rock Alternativo",
    "St. Vincent": "Rock Alternativo",
    "Lana Del Rey": "Rock Alternativo",
    "Lorde": "Rock Alternativo",
    "Marina": "Rock Alternativo",
    "MARINA": "Rock Alternativo",
    "Björk": "Rock Alternativo",
    "Alt-J": "Rock Alternativo",
    "Glass Animals": "Rock Alternativo",
    "Tame Impala": "Rock Alternativo",
    "Foals": "Rock Alternativo",
    "Two Door Cinema Club": "Rock Alternativo",
    "Wallows": "Rock Alternativo",
    "Cage The Elephant": "Rock Alternativo",
    "Twenty One Pilots": "Rock Alternativo",
    "twenty one pilots": "Rock Alternativo",
    "Panic! at the Disco": "Rock Alternativo",
    "Fall Out Boy": "Rock Alternativo",
    "All Time Low": "Rock Alternativo",
    "5 Seconds of Summer": "Rock Alternativo",
    "WILLOW": "Rock Alternativo",
    "Machine Gun Kelly": "Rock Alternativo", # Pop Punk era
    "YUNGBLUD": "Rock Alternativo",
    "Avril Lavigne": "Rock Alternativo",
    "Simple Plan": "Rock Alternativo",
    "Blink-182": "Rock Alternativo",
    "My Chemical Romance": "Rock Alternativo",
    "Maneskin": "Rock Alternativo",
    "Måneskin": "Rock Alternativo",
    "Fontaines D.C.": "Rock Alternativo",
    "IDLES": "Rock Alternativo",
    "Wet Leg": "Rock Alternativo",
    "Sam Fender": "Rock Alternativo",
    "Wolf Alice": "Rock Alternativo",
    
    # Metal / Hard Rock
    "Ghost": "Metal",
    "Slipknot": "Metal",
    "Rammstein": "Metal",
    "Metallica": "Metal",
    "Megadeth": "Metal",
    "Ozzy Osbourne": "Metal",
    "Korn": "Metal",
    "Disturbed": "Metal",
    "Five Finger Death Punch": "Metal",
    "Volbeat": "Metal",
    "Sabaton": "Metal",
    "Amon Amarth": "Metal",
    "Arch Enemy": "Metal",
    "Behemoth": "Metal",
    "Lamb of God": "Metal",
    "Lamb Of God": "Metal",
    "Parkway Drive": "Metal",
    "Bring Me The Horizon": "Metal",
    "Architects": "Metal",
    "Falling In Reverse": "Metal",
    "Bad Omens": "Metal",
    "Spiritbox": "Metal",
    "Halestorm": "Metal",
    "The Pretty Reckless": "Metal",
    "Evanescence": "Metal",
    "Within Temptation": "Metal",
    "Nightwish": "Metal",
    "Epica": "Metal",
    "Alter Bridge": "Metal",
    "Shinedown": "Metal",
    "Three Days Grace": "Metal",
    "Breaking Benjamin": "Metal",
    "Papa Roach": "Metal",
    "Skillet": "Metal",
    "Turnstile": "Metal", # Hardcore
    "Polyphia": "Metal", # Prog
    "Meshuggah": "Metal",
    "Lorna Shore": "Metal",
    "Gojira": "Metal",
    "Mastodon": "Metal",
    "Deftones": "Metal",
    "Tool": "Metal",
    "Nine Inch Nails": "Metal",
    
    # Rap / Hip Hop
    "Kendrick Lamar": "Rap",
    "Drake": "Rap",
    "Future": "Rap",
    "Kanye West": "Rap",
    "Ye": "Rap",
    "Jay-Z": "Rap",
    "Eminem": "Rap",
    "Nas": "Rap",
    "J. Cole": "Rap",
    "Travis Scott": "Rap",
    "Playboi Carti": "Rap",
    "Lil Uzi Vert": "Rap",
    "21 Savage": "Rap",
    "Gunna": "Rap",
    "Lil Baby": "Rap",
    "Young Thug": "Rap",
    "DaBaby": "Rap",
    "Roddy Ricch": "Rap",
    "Jack Harlow": "Rap",
    "Megan Thee Stallion": "Rap",
    "Cardi B": "Rap",
    "Nicki Minaj": "Rap",
    "Doja Cat": "Rap", # Often mapped to Pop due to hits, but Rap is primary origin/style for many
    "Latto": "Rap",
    "GloRilla": "Rap",
    "Ice Spice": "Rap",
    "City Girls": "Rap",
    "Coi Leray": "Rap",
    "Saweetie": "Rap",
    "A$AP Rocky": "Rap",
    "Tyler, The Creator": "Rap",
    "Kid Cudi": "Rap",
    "Mac Miller": "Rap",
    "Juice WRLD": "Rap",
    "XXXTentacion": "Rap",
    "Pop Smoke": "Rap",
    "Lil Durk": "Rap",
    "Polo G": "Rap",
    "Moneybagg Yo": "Rap",
    "Kodak Black": "Rap",
    "YoungBoy Never Broke Again": "Rap",
    "Rod Wave": "Rap",
    "Central Cee": "Rap",
    "Stormzy": "Rap",
    "Dave": "Rap",
    "Skepta": "Rap",
    "Little Simz": "Rap",
    "Migos": "Rap",
    "Quavo": "Rap",
    "Offset": "Rap",
    "Takeoff": "Rap",
    "Denzel Curry": "Rap",
    "JID": "Rap",
    "J.I.D": "Rap",
    "EarthGang": "Rap",
    "Brockhampton": "Rap",
    "Pusha T": "Rap",
    "Freddie Gibbs": "Rap",
    "Joey Bada$$": "Rap",
    "Logic": "Rap",
    "NF": "Rap",
    
    # Eletronico / Dance
    "Calvin Harris": "Eletronico",
    "David Guetta": "Eletronico",
    "Tiësto": "Eletronico",
    "Tiesto": "Eletronico",
    "Swedish House Mafia": "Eletronico",
    "Diplo": "Eletronico",
    "Skrillex": "Eletronico",
    "Marshmello": "Eletronico",
    "The Chainsmokers": "Eletronico",
    "Kygo": "Eletronico",
    "Alan Walker": "Eletronico",
    "Alesso": "Eletronico",
    "Zedd": "Eletronico",
    "Martin Garrix": "Eletronico",
    "DJ Snake": "Eletronico",
    "Major Lazer": "Eletronico",
    "Galantis": "Eletronico",
    "Clean Bandit": "Eletronico",
    "Disclosure": "Eletronico",
    "Flume": "Eletronico",
    "Odesza": "Eletronico",
    "Rüfüs Du Sol": "Eletronico",
    "Rufus Du Sol": "Eletronico",
    "Fred again..": "Eletronico",
    "Four Tet": "Eletronico",
    "Bonobo": "Eletronico",
    "Jamie xx": "Eletronico",
    "Caribou": "Eletronico",
    "Kaytranada": "Eletronico",
    "Thundercat": "Eletronico", # Fusion
    "Flying Lotus": "Eletronico",
    "Aphex Twin": "Eletronico",
    "Grimes": "Eletronico",
    "Arca": "Eletronico",
    "SOPHIE": "Eletronico",
    "100 gecs": "Eletronico", # Hyperpop
    "Charli XCX": "Eletronico", # Or Pop
    
    # Latin / Reggaeton (Map to appropriate broad genre if 'Latin' not available, usually Pop or create new? Using existing set: Pop, Rap, etc. 'Latin' is not in standard set, will map to Pop for mainstream or Rap for Urban)
    "Bad Bunny": "Pop", # Global Icon, huge pop appeal
    "J Balvin": "Pop",
    "Maluma": "Pop",
    "Daddy Yankee": "Pop",
    "Rauw Alejandro": "Pop",
    "Ozuna": "Pop",
    "Nicky Jam": "Pop",
    "Sech": "Pop",
    "Farruko": "Pop",
    "Anuel AA": "Rap", # Latin Trap
    "Myke Towers": "Rap",
    "Eladio Carrion": "Rap",
    "Bizarrap": "Eletronico", # Producer
    "Peso Pluma": "Country", # Corridos Tumbados -> Regional Mexican -> Country equivalent? Or Pop.
    
    # Country
    "Morgan Wallen": "Country",
    "Luke Combs": "Country",
    "Chris Stapleton": "Country",
    "Kane Brown": "Country",
    "Carrie Underwood": "Country",
    "Miranda Lambert": "Country",
    "Kacey Musgraves": "Country",
    "Maren Morris": "Country",
    "Thomas Rhett": "Country",
    "Eric Church": "Country",
    "Jason Aldean": "Country",
    "Blake Shelton": "Country",
    "Keith Urban": "Country",
    "Tim McGraw": "Country",
    "Kenny Chesney": "Country",
    "Zac Brown Band": "Country",
    "Dan + Shay": "Country",
    "Old Dominion": "Country",
    "Brothers Osborne": "Country",
    "Carly Pearce": "Country",
    "Ashley McBryde": "Country",
    "Lainey Wilson": "Country",
    "Hardy": "Country",
    "HARDY": "Country",
    "Bailey Zimmerman": "Country",
    "Zach Bryan": "Country",
    "Tyler Childers": "Country",
    "Sturgill Simpson": "Country",
    "Orville Peck": "Country",
    
    # Punk
    "The Offspring": "Punk",
    "Green Day": "Punk",
    "Sum 41": "Punk",
    "Rise Against": "Punk",
    "Rancid": "Punk",
    "NOFX": "Punk",
    "Bad Religion": "Punk",
    "Pennywise": "Punk",
    "Descendents": "Punk",
    "Social Distortion": "Punk",
    "Viagra Boys": "Punk",
    "Amyl and the Sniffers": "Punk",
    "The Chats": "Punk",
    "Turnstile": "Punk", # Or Hardcore/Metal
    "IDLES": "Punk",
    "Pup": "Punk",
    "Jeff Rosenstock": "Punk",
    "Soul Glo": "Punk",
    
    # New additions (Top Unknowns)
    "FKA Twigs": "Pop", # Avant-pop / R&B
    "Tove Lo": "Pop",
    "††† (Crosses)": "Rock Alternativo", # Electronic Rock
    "iamamiwhoami": "Eletronico",
    "Palaye Royale": "Rock Alternativo", # Art Rock
    "Shiva": "Rap", # Italian Trap
    "Shiva (2)": "Rap",
    "Kakkmaddafakka": "Pop", # Indie Pop
    "Queensrÿche": "Metal",
    "Blind Channel": "Rock Alternativo", # Violent Pop / Nu Metal
    "Samuel": "Pop", # Italian
    "Achille Lauro": "Pop", # Italian Pop/Rock
    "Bengala Fire": "Rock Alternativo",
    "The Rasmus": "Rock Alternativo",
    "Elodie": "Pop",
    "Giusy Ferreri": "Pop",
    "Sleeping With Sirens": "Rock Alternativo", # Post-hardcore
    "zalagasper": "Pop", # Indie Pop
    "Jovanotti": "Pop",
    "Manuel Agnelli": "Rock Alternativo",
    "Softcult": "Rock Alternativo", # Shoegaze
    "Cavetown": "Pop", # Bedroom Pop
    "Distant": "Metal", # Deathcore
    "Coma_Cose": "Pop", # Indie Pop / Rap
    "Sanguisugabogg": "Metal", # Death Metal
    "Finem": "Rock Alternativo",
    "sangiovanni": "Pop",
    "Macklemore": "Rap",
    "Rkomi": "Pop", # Rap / Pop
    "Insomnium": "Metal",
    "Vended": "Metal",
    "Irama": "Pop",
    "WHOKILLEDXIX": "Eletronico", # Hyperpop / Trap Metal
    "Marracash": "Rap",
    "Stromae": "Pop",
    "Paky": "Rap",
    "LEEPA": "Pop",
    "Madonna": "Pop",
    "Subwoolfer": "Pop",
    "ionnalee": "Eletronico",
    "Sethu": "Rock Alternativo", # Punk / Rap
    "Allison Ponthier": "Pop",
    "Ardian Bujupi": "Pop",
    "VV": "Rock Alternativo", # Ville Valo
    "PGF Nuk": "Rap",
    "The Offering": "Metal",
    "Fabri Fibra": "Rap",
    "Billy Idol": "Rock Alternativo",
    "Eros Ramazzotti": "Pop",
    "Don Xhoni": "Rap",
    "Sam Ryder": "Pop",
    "Michele Bravi": "Pop",
    "Joshua Bassett": "Pop",
    "Dhurata Dora": "Pop",
    "Imperial Triumphant": "Metal",
    "Apocalyptica": "Metal",
    "Kalush Orchestra": "Rap", # Folk Rap
    "Sfera Ebbasta": "Rap",
    "Bella Poarch": "Pop",
    "Alfie Templeman": "Pop", # Indie Pop
    "Rosa Linn": "Pop",
    "Chiello": "Pop", # Trap / Pop
    "P38": "Rap",
    "GIGLIO": "Pop",
    "Omar Apollo": "Pop", # R&B / Pop
    "Chlöe": "Pop", # R&B
    "Tyga": "Rap",
    "Son Lux": "Rock Alternativo", # Experimental
    "Sigrid": "Pop",
    "Capital T": "Rap", # Pop / Rap
    "Teddy Swims": "Pop", # Soul / Pop
    "Sub Urban": "Pop", # Alt Pop
    "Chappell Roan": "Pop",
    "Lacuna Coil": "Metal",
    "G Flip": "Pop", # Indie Pop
    "La rappresentante di lista": "Pop",
    "Hope Tala": "Pop", # R&B / Bossa
    "Noah Cyrus": "Pop",
    "Romeo Santos": "Pop", # Bachata / Latin Pop
    "Louis Tomlinson": "Pop",
    "Fabrizio Moro": "Pop",
    "Miya Folick": "Rock Alternativo",
    "Suicide Silence": "Metal",
    "LA SAD": "Rock Alternativo", # Pop Punk
    "Finneas": "Pop",
    "Jenna Raine": "Pop",
    "Chris Brown": "Pop", # R&B
    "Luna Li": "Pop", # Indie Pop
    "The Regrettes": "Rock Alternativo",
    "Pierce The Veil": "Rock Alternativo", # Post-hardcore
    "Haiku Hands": "Eletronico", # Dance Pop
    "Black Veil Brides": "Metal", # Glam Metal / Hard Rock
    "Lindsey Stirling": "Eletronico", # Violin / Dubstep
    "Yves Tumor": "Rock Alternativo", # Experimental Rock
    "Rich Homie Quan": "Rap",
    "In Flames": "Metal",
    "Lostboycrow": "Pop",
    "DALHIA": "Pop",
    "OhGeesy": "Rap",
    "Lorn": "Eletronico",
    "Volores": "Rock Alternativo"
}

# Normalize function
def normalize_artist(name):
    if not name:
        return "Unknown"
    return str(name).strip()

# Load the file
with open('data/2022.json', 'r') as f:
    data = json.load(f)

# Update the artist_genre
updated_count = 0
for item in data:
    artist_raw = item.get('artist_name')
    artist = normalize_artist(artist_raw)
    
    # Direct match
    if artist in genre_mapping:
        item['artist_genre'] = genre_mapping[artist]
        updated_count += 1
    # Check if artist contains mapped artist
    else:
        for mapped_artist, genre in genre_mapping.items():
            if mapped_artist in artist:
                 item['artist_genre'] = genre
                 updated_count += 1
                 break

# Save back to file
with open('data/2022.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Updated {updated_count} entries.")
