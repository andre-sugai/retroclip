import json

# Mapping of artists to genres for 2023
genre_mapping = {
    # Pop
    "Taylor Swift": "Pop",
    "Miley Cyrus": "Pop",
    "Dua Lipa": "Pop",
    "Olivia Rodrigo": "Pop",
    "Billie Eilish": "Pop",
    "SZA": "Pop", # R&B
    "Harry Styles": "Pop",
    "Pink": "Pop",
    "Kylie Minogue": "Pop",
    "Bebe Rexha": "Pop",
    "Tove Lo": "Pop",
    "Charli XCX": "Pop",
    "Rita Ora": "Pop",
    "Demi Lovato": "Pop",
    "Jonas Brothers": "Pop",
    "Ed Sheeran": "Pop",
    "Post Malone": "Pop",
    "The Weeknd": "Pop",
    "Doja Cat": "Pop", # Rap/Pop
    "Nicki Minaj": "Pop", # Rap/Pop
    "Ice Spice": "Pop", # Rap
    "Troye Sivan": "Pop",
    "Sam Smith": "Pop",
    "Kim Petras": "Pop",
    "Ava Max": "Pop",
    "Sabrina Carpenter": "Pop",
    "Tate McRae": "Pop",
    "Renée Rapp": "Pop",
    "Victoria Monét": "Pop",
    "Janelle Monáe": "Pop",
    "Beyoncé": "Pop",
    "Rihanna": "Pop",
    "Lady Gaga": "Pop",
    "Ariana Grande": "Pop",
    "Selena Gomez": "Pop",
    "Justin Timberlake": "Pop",
    "NSYNC": "Pop",
    "Timbaland": "Pop",
    "Nelly Furtado": "Pop",
    "Zara Larsson": "Pop",
    "Ellie Goulding": "Pop",
    "Gracie Abrams": "Pop",
    "Lana Del Rey": "Pop", # Alt Pop
    "Melanie Martinez": "Pop", # Alt Pop
    "Ashnikko": "Pop", # Alt Pop
    "Halsey": "Pop",
    "Madison Beer": "Pop",
    "Nessa Barrett": "Pop",
    "Lauren Spencer Smith": "Pop",
    "Mimi Webb": "Pop",
    "RAYE": "Pop",
    "Raye": "Pop",
    "Lewis Capaldi": "Pop",
    "Niall Horan": "Pop",
    "James Arthur": "Pop",
    "Tom Odell": "Pop",
    "George Ezra": "Pop",
    "Hozier": "Pop", # Rock/Soul
    "Noah Kahan": "Pop", # Folk Pop
    "Benson Boone": "Pop",
    "David Kushner": "Pop",
    "Teddy Swims": "Pop",
    "Jungkook": "Pop",
    "Jimin": "Pop",
    "V": "Pop",
    "NewJeans": "Pop",
    "IVE": "Pop",
    "(G)I-DLE": "Pop",
    "Stray Kids": "Pop",
    "Seventeen": "Pop",
    "TXT": "Pop",
    "Aespa": "Pop",
    "aespa": "Pop",
    "LE SSERAFIM": "Pop",
    "ITZY": "Pop",
    "NMIXX": "Pop",
    "Fifty Fifty": "Pop",
    "XG": "Pop",
    "PinkPantheress": "Pop",
    "Tyla": "Pop",
    "Sia": "Pop",
    "Calvin Harris": "Pop", # Electronic
    "David Guetta": "Pop", # Electronic
    "Tiësto": "Pop", # Electronic
    "Peggy Gou": "Pop", # House
    "Fred again..": "Pop", # Electronic
    "Skrillex": "Pop", # Electronic
    "Marshmello": "Pop",
    "The Chainsmokers": "Pop",
    "Lost Frequencies": "Pop",
    "Purple Disco Machine": "Pop",
    "Kylie Minogue": "Pop",
    "Loreen": "Pop", # Eurovision
    "Käärijä": "Pop", # Eurovision
    "Alessandra": "Pop", # Eurovision
    "Noa Kirel": "Pop", # Eurovision
    "Marco Mengoni": "Pop", # Sanremo
    "Lazza": "Pop", # Sanremo (Rap)
    "Mr. Rain": "Pop", # Sanremo
    "Mr.Rain": "Pop",
    "Ultimo": "Pop", # Sanremo
    "Tananai": "Pop", # Sanremo
    "Elodie": "Pop", # Sanremo
    "Madame": "Pop", # Sanremo
    "Rosa Chemical": "Pop", # Sanremo
    "Coma_Cose": "Pop", # Sanremo
    "Colapesce": "Pop",
    "Dimartino": "Pop",
    "Colapesce Dimartino": "Pop",
    "ColapesceDimartino": "Pop",
    "Giorgia": "Pop",
    "Articolo 31": "Pop", # Rap
    "Annalisa": "Pop",
    "Angelina Mango": "Pop",
    "The Kolors": "Pop",
    "Fedez": "Pop",
    "Blanco": "Pop",
    "Mahmood": "Pop",
    "Sfera Ebbasta": "Pop", # Trap
    "Geolier": "Pop", # Rap
    "Shiva": "Pop", # Rap
    "Tedua": "Pop", # Rap
    "Bresh": "Pop",
    "Pinguini Tattici Nucleari": "Pop",
    "Måneskin": "Rock Alternativo",
    "Maneskin": "Rock Alternativo",
    
    # Rock / Alternativo
    "Arctic Monkeys": "Rock Alternativo",
    "Paramore": "Rock Alternativo",
    "Queens of the Stone Age": "Rock Alternativo",
    "Foo Fighters": "Rock Alternativo",
    "Blink-182": "Rock Alternativo",
    "Fall Out Boy": "Rock Alternativo",
    "Green Day": "Rock Alternativo",
    "The 1975": "Rock Alternativo",
    "Bring Me The Horizon": "Rock Alternativo", # Metalcore/Alt
    "Bad Omens": "Rock Alternativo", # Metalcore/Alt
    "Sleep Token": "Rock Alternativo", # Metal/Alt
    "Spiritbox": "Rock Alternativo", # Metal
    "Ghost": "Rock Alternativo", # Metal/Rock
    "Nothing But Thieves": "Rock Alternativo",
    "Royal Blood": "Rock Alternativo",
    "Greta Van Fleet": "Rock Alternativo",
    "Rival Sons": "Rock Alternativo",
    "The Hives": "Rock Alternativo",
    "The Rolling Stones": "Rock Alternativo",
    "The Beatles": "Rock Alternativo", # Now and Then
    "Blur": "Rock Alternativo",
    "Gorillaz": "Rock Alternativo",
    "Depeche Mode": "Rock Alternativo",
    "The Cure": "Rock Alternativo",
    "Noel Gallagher's High Flying Birds": "Rock Alternativo",
    "Liam Gallagher": "Rock Alternativo",
    "Inhaler": "Rock Alternativo",
    "Fontaines D.C.": "Rock Alternativo",
    "Wet Leg": "Rock Alternativo",
    "Boygenius": "Rock Alternativo",
    "boygenius": "Rock Alternativo",
    "Phoebe Bridgers": "Rock Alternativo",
    "Julien Baker": "Rock Alternativo",
    "Lucy Dacus": "Rock Alternativo",
    "Mitski": "Rock Alternativo",
    "Clairo": "Rock Alternativo",
    "Arlo Parks": "Rock Alternativo",
    "Beabadoobee": "Rock Alternativo",
    "Girl in Red": "Rock Alternativo",
    "Girl In Red": "Rock Alternativo",
    "St. Vincent": "Rock Alternativo",
    "PJ Harvey": "Rock Alternativo",
    "The National": "Rock Alternativo",
    "Bon Iver": "Rock Alternativo",
    "Sufjan Stevens": "Rock Alternativo",
    "Sigur Rós": "Rock Alternativo",
    "Slowdive": "Rock Alternativo",
    "Phoenix": "Rock Alternativo",
    "M83": "Rock Alternativo",
    "Empire of the Sun": "Rock Alternativo",
    "MGMT": "Rock Alternativo",
    "The Killers": "Rock Alternativo",
    "Imagine Dragons": "Rock Alternativo",
    "Twenty One Pilots": "Rock Alternativo",
    "Coldplay": "Rock Alternativo",
    "Muse": "Rock Alternativo",
    "30 Seconds To Mars": "Rock Alternativo",
    "Thirty Seconds To Mars": "Rock Alternativo",
    "The Smashing Pumpkins": "Rock Alternativo",
    "Pearl Jam": "Rock Alternativo",
    "Sum 41": "Rock Alternativo",
    "Simple Plan": "Rock Alternativo",
    "Avril Lavigne": "Rock Alternativo",
    "Yungblud": "Rock Alternativo",
    "YUNGBLUD": "Rock Alternativo",
    "Machine Gun Kelly": "Rock Alternativo",
    "Willow": "Rock Alternativo",
    "WILLOW": "Rock Alternativo",

    # Metal / Hard Rock
    "Metallica": "Metal",
    "Avenged Sevenfold": "Metal",
    "Slipknot": "Metal",
    "Disturbed": "Metal",
    "Godsmack": "Metal",
    "Five Finger Death Punch": "Metal",
    "In Flames": "Metal",
    "Cannibal Corpse": "Metal",
    "Lorna Shore": "Metal",
    "Electric Callboy": "Metal",
    "Baby Metal": "Metal",
    "BABYMETAL": "Metal",
    "Judas Priest": "Metal",
    "Iron Maiden": "Metal",
    "Megadeth": "Metal",
    "Pantera": "Metal",
    "Within Temptation": "Metal",
    "Epica": "Metal",
    "Nightwish": "Metal",
    "Evanescence": "Metal",
    "Halestorm": "Metal",
    "The Warning": "Metal",
    "Mammoth WVH": "Metal",
    "Alter Bridge": "Metal",
    "Shinedown": "Metal",
    "Volbeat": "Metal",
    "Sabaton": "Metal",
    "Powerwolf": "Metal",
    "Amon Amarth": "Metal",
    "Arch Enemy": "Metal",
    "Trivium": "Metal",
    "Bullet For My Valentine": "Metal",
    "Parkway Drive": "Metal",
    "Architects": "Metal",
    "While She Sleeps": "Metal",
    "Falling In Reverse": "Metal",
    "Ice Nine Kills": "Metal",
    "Motionless In White": "Metal",
    "Pierce The Veil": "Metal", # Post-hardcore
    "Beartooth": "Metal",
    "I Prevail": "Metal",
    "Asking Alexandria": "Metal",
    "Skillet": "Metal",
    "Three Days Grace": "Metal",
    "Breaking Benjamin": "Metal",
    "Papa Roach": "Metal",
    "Seether": "Metal",
    "Staind": "Metal",
    "Creed": "Metal",
    "Nickelback": "Metal",
    
    # Rap / Hip Hop
    "Drake": "Rap",
    "Travis Scott": "Rap",
    "Lil Uzi Vert": "Rap",
    "Metro Boomin": "Rap",
    "21 Savage": "Rap",
    "Future": "Rap",
    "Gunna": "Rap",
    "Young Thug": "Rap",
    "Playboi Carti": "Rap",
    "Yeat": "Rap",
    "Jack Harlow": "Rap",
    "Central Cee": "Rap",
    "Dave": "Rap",
    "Stormzy": "Rap",
    "J. Cole": "Rap",
    "Kendrick Lamar": "Rap",
    "Lil Durk": "Rap",
    "Lil Baby": "Rap",
    "Moneybagg Yo": "Rap",
    "Kodak Black": "Rap",
    "YoungBoy Never Broke Again": "Rap",
    "Rod Wave": "Rap",
    "Polo G": "Rap",
    "NLE Choppa": "Rap",
    "GloRilla": "Rap",
    "Latto": "Rap",
    "Megan Thee Stallion": "Rap",
    "Cardi B": "Rap",
    "City Girls": "Rap",
    "Coi Leray": "Rap",
    "Sexyy Red": "Rap",
    "Nicky Jam": "Rap",
    "Daddy Yankee": "Rap",
    "Bad Bunny": "Rap",
    "Rauw Alejandro": "Rap",
    "Myke Towers": "Rap",
    "Feid": "Rap",
    "Anuel AA": "Rap",
    "Eladio Carrion": "Rap",
    "Ozuna": "Rap",
    "Maluma": "Rap",
    "J Balvin": "Rap",
    "Karol G": "Rap", # Reggaeton/Pop
    "Shakira": "Rap", # Pop/Latin
    "Rosalía": "Rap", # Pop/Flamenco/Urban
    "ROSALÍA": "Rap",
    "Peso Pluma": "Country", # Corridos Tumbados (Regional Mexican) -> Country? Or Rap/Pop? 
    "Eslabon Armado": "Country", # Regional Mexican
    "Grupo Frontera": "Country",
    "Carin Leon": "Country",
    "Fuerza Regida": "Country",
    "Natanael Cano": "Country",
    "Junior H": "Country",
    
    # Country
    "Morgan Wallen": "Country",
    "Luke Combs": "Country",
    "Zach Bryan": "Country",
    "Bailey Zimmerman": "Country",
    "Jelly Roll": "Country",
    "Lainey Wilson": "Country",
    "Kane Brown": "Country",
    "Hardy": "Country",
    "HARDY": "Country",
    "Jordan Davis": "Country",
    "Tyler Childers": "Country",
    "Chris Stapleton": "Country",
    "Carrie Underwood": "Country",
    "Kelsea Ballerini": "Country",
    "Thomas Rhett": "Country",
    "Jason Aldean": "Country",
    "Oliver Anthony Music": "Country",
    
    # Punk
    "The Offspring": "Punk",
    "Rancid": "Punk",
    "NOFX": "Punk",
    "Bad Religion": "Punk",
    "Pennywise": "Punk",
    "Social Distortion": "Punk",
    "Rise Against": "Punk",
    "Dropkick Murphys": "Punk",
    "Flogging Molly": "Punk",
    "The Interrupters": "Punk",
    "Turnstile": "Punk",
    "Idles": "Punk",
    "IDLES": "Punk",
    "Viagra Boys": "Punk",
    "Amyl and the Sniffers": "Punk",
    "The Chats": "Punk",
    "Pup": "Punk",
    "Jeff Rosenstock": "Punk",
    "Soul Glo": "Punk",
    "Knocked Loose": "Punk", # Hardcore
    "Code Orange": "Punk", # Hardcore
    "Jesus Piece": "Punk", # Hardcore
    "Scowl": "Punk", # Hardcore
    "Zulu": "Punk", # Hardcore
    "Drain": "Punk", # Hardcore
    "Drain": "Punk", # Hardcore
    "Militarie Gun": "Punk",
    
    # New additions (Top Unknowns)
    "Poppy": "Metal", # Pop Metal
    "Mutonia": "Rock Alternativo",
    "Palaye Royale": "Rock Alternativo", # Art Rock
    "Eartheater": "Eletronico",
    "Björk": "Pop", # Art Pop
    "Queensrÿche": "Metal",
    "gIANMARIA": "Pop", # Sanremo
    "6IX9INE": "Rap",
    "Omnium Gatherum": "Metal",
    "Santi Francesi": "Pop",
    "Night Demon": "Metal",
    "Blind Channel": "Rock Alternativo",
    "The Kills": "Rock Alternativo",
    "Paola & Chiara": "Pop",
    "Sethu": "Pop", # Sanremo
    "Luiz Ejlli": "Pop",
    "Mara Sattei": "Pop", # Sanremo
    "Francesca Michielin": "Pop",
    "Grave Pleasures": "Rock Alternativo", # Post-punk
    "Salmo": "Rap",
    "Levante": "Pop", # Sanremo
    "Plini": "Rock Alternativo", # Prog Metal
    "6lack": "Rap", # R&B
    "BIA": "Rap",
    "Shygirl": "Eletronico",
    "Go_A": "Pop", # Eurovision / Folk
    "Distant": "Metal", # Deathcore
    "Daughter": "Rock Alternativo",
    "2TON": "Pop",
    "Olly": "Pop", # Sanremo
    "Romy": "Eletronico", # The xx
    "Ov Sulfur": "Metal",
    "Unearth": "Metal",
    "Dorian Electra": "Pop", # Hyperpop
    "Lacrim": "Rap",
    "Exit Eden": "Metal",
    "††† (Crosses)": "Rock Alternativo",
    "†††": "Rock Alternativo",
    "Jazmin Bean": "Rock Alternativo",
    "Butrint Imeri": "Pop",
    "Fever Ray": "Eletronico",
    "Angelus Apatrida": "Metal",
    "Enforced": "Metal",
    "Jessie Ware": "Pop",
    "Maria Antonietta": "Pop",
    "Achille Lauro": "Pop",
    "LA SAD": "Rock Alternativo",
    "Kali Uchis": "Pop", # R&B
    "Steven Wilson": "Rock Alternativo", # Prog
    "Subsonica": "Rock Alternativo",
    "Suicide Silence": "Metal",
    "Patrick Droney": "Pop",
    "Frozen Soul": "Metal",
    "Tommaso Paradiso": "Pop",
    "Christian Nodal": "Country", # Regional Mexican
    "Chelsea Wolfe": "Rock Alternativo",
    "Mental Cruelty": "Metal",
    "Mike Shinoda": "Rock Alternativo",
    "Baustelle": "Rock Alternativo",
    "Lord Of The Lost": "Metal",
    "Antony & The Johnsons": "Pop",
    "Maes": "Rap",
    "TY1": "Rap",
    "Modà": "Pop", # Sanremo
    "Medy": "Rap",
    "Tamino": "Pop",
    "half·alive": "Rock Alternativo",
    "COBRAH": "Eletronico",
    "Kalandra": "Pop",
    "Bibi": "Pop",
    "Insomnium": "Metal",
    "Iru": "Pop",
    "Boomdabash": "Pop",
    "Rhove": "Rap",
    "Nirvana": "Rock Alternativo", # Grunge
    "Diplo": "Eletronico",
    "Albina": "Pop",
    "Cable": "Punk",
    "DeathbyRomy": "Pop", # Dark Pop
    "NIKI": "Pop",
    "Krisiun": "Metal",
    "Siiickbrain": "Rock Alternativo",
    "B2N": "Pop",
    "Finem": "Rock Alternativo",
    "Offset": "Rap",
    "Lolahol": "Pop",
    "Rondo": "Rap",
    "Nanna": "Pop",
    "Birdy": "Pop",
    "Oni": "Metal",
    "Settembre": "Pop",
    "Chvrches": "Pop", # Synth-pop
    "Booba": "Rap",
    "Benab": "Rap",
    "Halle": "Pop", # R&B
    "Atreyu": "Metal",
    "JISOO": "Pop",
    "Bardhi": "Pop",
    "yeule": "Pop", # Glitch Pop
    "Arca": "Eletronico",
    "Katatonia": "Metal"
}

# Normalize function
def normalize_artist(name):
    if not name:
        return "Unknown"
    return str(name).strip()

# Load the file
with open('data/2023.json', 'r') as f:
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
with open('data/2023.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Updated {updated_count} entries.")
