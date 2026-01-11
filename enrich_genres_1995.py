
import json
import os

# Define the genre mapping for 1995
ARTIST_GENRES = {
    # Rock Alternativo / Indie / Grunge / Post-Grunge
    "16 Horsepower": "Rock Alternativo",
    "311": "Rock Alternativo",
    "99th Floor Elevators": "Rock Alternativo",
    "Abra Moore": "Rock Alternativo",
    "Afterhours": "Rock Alternativo",
    "Aimee Mann": "Rock Alternativo",
    "All": "Punk",
    "Ash": "Rock Alternativo",
    "Babes In Toyland": "Punk", # Riot Grrrl
    "Bandit Queen": "Rock Alternativo",
    "Belly": "Rock Alternativo",
    "Better Than Ezra": "Rock Alternativo",
    "Beyond Dawn": "Rock Alternativo",
    "Big Country": "Rock Alternativo",
    "Blind Melon": "Rock Alternativo",
    "Blue Manner Haze": "Rock Alternativo",
    "Blue Rodeo": "Rock Alternativo",
    "Blue": "Rock Alternativo",
    "Blues Traveler": "Rock Alternativo",
    "Blur": "Rock Alternativo", # Britpop
    "Bluvertigo": "Rock Alternativo",
    "Bon Jovi": "Rock Alternativo", # Hard Rock
    "Bossman And The Blakjak": "Rock Alternativo",
    "Buffalo Tom": "Rock Alternativo",
    "Bush": "Rock Alternativo", # Grunge
    "Cake Like": "Rock Alternativo",
    "Candlebox": "Rock Alternativo", # Grunge
    "Catherine Wheel": "Rock Alternativo", # Shoegaze
    "Chris Whitley": "Rock Alternativo",
    "Civ": "Punk",
    "Collective Soul": "Rock Alternativo",
    "Compulsion (2)": "Punk",
    "Crash Test Dummies": "Rock Alternativo",
    "Dandelion": "Rock Alternativo",
    "Dave Matthews Band": "Rock Alternativo",
    "David Bowie": "Rock Alternativo",
    "Deep Blue Something": "Rock Alternativo",
    "DEEP": "Rock Alternativo",
    "Def Leppard": "Metal",
    "Deftones": "Metal",
    "Del Amitri": "Rock Alternativo",
    "Dinosaur Jr.": "Rock Alternativo",
    "Dishwalla": "Rock Alternativo",
    "Dornröschen": "Rock Alternativo",
    "Doro": "Metal",
    "Dreadzone": "Eletronico",
    "EAV (Erste Allgemeine Verunsicherung)": "Pop", # Pop Rock/Comedy
    "Echobelly": "Rock Alternativo", # Britpop
    "Elastica (2)": "Rock Alternativo", # Britpop/Punk
    "Elliott Smith": "Rock Alternativo",
    "Eric Matthews": "Rock Alternativo",
    "Eve's Plum": "Rock Alternativo",
    "Everclear": "Rock Alternativo",
    "Everlasting": "Rock Alternativo",
    "Extreme": "Rock Alternativo",
    "Face To Face": "Punk",
    "Faith No More": "Rock Alternativo",
    "Fight": "Metal",
    "Filter": "Rock Alternativo", # Industrial Rock
    "Firehouse": "Metal", # Glam Metal
    "Fish": "Rock Alternativo", # Prog
    "Foo Fighters": "Rock Alternativo",
    "For Squirrels": "Rock Alternativo",
    "Garbage": "Rock Alternativo",
    "Gavin Friday": "Rock Alternativo",
    "Gianfilippo Boni": "Rock Alternativo",
    "Gigolo Aunts": "Rock Alternativo",
    "Gin Blossoms": "Rock Alternativo",
    "Girls Against Boys": "Rock Alternativo",
    "Goo Goo Dolls": "Rock Alternativo",
    "Grant Lee Buffalo": "Rock Alternativo",
    "Green Day": "Punk",
    "Guided By Voices": "Rock Alternativo",
    "Gun (2)": "Rock Alternativo",
    "GusGus": "Eletronico",
    "Harem Scarem": "Rock Alternativo",
    "Herbert Grönemeyer": "Rock Alternativo", # German Rock
    "Hootie & The Blowfish": "Rock Alternativo",
    "Humleridderne": "Rap", # Danish Rap
    "Indigo Girls": "Rock Alternativo", # Folk Rock
    "Iron Maiden": "Metal",
    "Jars Of Clay": "Rock Alternativo",
    "Jawbreaker": "Punk",
    "Jewel": "Pop", # Folk Pop
    "Jill Sobule": "Rock Alternativo",
    "Joe Cocker": "Rock Alternativo",
    "John Norum": "Rock Alternativo",
    "Joni Mitchell": "Rock Alternativo", # Folk
    "Joy Division": "Rock Alternativo", # Post-Punk
    "Kent": "Rock Alternativo",
    "Korn": "Metal",
    "Kosmos (2)": "Rock Alternativo",
    "Kreator": "Metal",
    "Lacrimosa": "Metal", # Gothic Metal
    "Lenny Kravitz": "Rock Alternativo",
    "Leonard Cohen": "Rock Alternativo",
    "Ligabue": "Rock Alternativo",
    "Litfiba": "Rock Alternativo",
    "Liz Phair": "Rock Alternativo",
    "Love Battery": "Rock Alternativo",
    "Low": "Rock Alternativo", # Slowcore
    "Luscious Jackson": "Rock Alternativo",
    "Mad Season": "Rock Alternativo",
    "Marillion": "Rock Alternativo", # Prog
    "Marilyn Manson": "Metal",
    "Mary Lou Lord": "Rock Alternativo",
    "Matthew Sweet": "Rock Alternativo",
    "Medicine Hat": "Rock Alternativo",
    "Melissa Etheridge": "Rock Alternativo",
    "Meshuggah": "Metal",
    "Mike Watt": "Rock Alternativo",
    "Mojave 3": "Rock Alternativo",
    "Monster Magnet": "Rock Alternativo", # Stoner Rock
    "Morrissey": "Rock Alternativo",
    "Motörhead": "Metal",
    "Mr. Ed Jumps The Gun": "Rock Alternativo",
    "Mutton Birds, The": "Rock Alternativo",
    "Myslovitz": "Rock Alternativo",
    "Nancy Boy": "Rock Alternativo",
    "Natalie Merchant": "Rock Alternativo",
    "Ned's Atomic Dustbin": "Rock Alternativo",
    "New Order": "Rock Alternativo",
    "No Doubt": "Rock Alternativo", # Ska Punk
    "Oasis": "Rock Alternativo", # Britpop
    "Olle Ljungström": "Rock Alternativo",
    "Ozzy Osbourne": "Metal",
    "Paradise Lost": "Metal",
    "Paul Weller": "Rock Alternativo",
    "Pavement": "Rock Alternativo",
    "Pearl (7)": "Rock Alternativo",
    "Pearl Jam": "Rock Alternativo",
    "PJ Harvey": "Rock Alternativo",
    "Plattenpapst Jöak & Freunde": "Rock Alternativo",
    "Portishead": "Eletronico", # Trip Hop
    "Prairie Oyster": "Country",
    "Primus": "Rock Alternativo",
    "Pulp": "Rock Alternativo", # Britpop
    "Queen": "Pop", # Rock
    "Queensrÿche": "Metal",
    "Quicksand (3)": "Post-Hardcore", # Punk/Alt
    "R.E.M.": "Rock Alternativo",
    "Radiohead": "Rock Alternativo",
    "Rage Against The Machine": "Rock Alternativo", # Rap Metal
    "Rammstein": "Metal",
    "Rancid": "Punk",
    "Red Hot Chili Peppers": "Rock Alternativo",
    "Reef": "Rock Alternativo",
    "Republica": "Rock Alternativo",
    "Rod Stewart": "Pop", # Rock
    "Roger Chapman": "Rock Alternativo",
    "Roxette": "Pop",
    "Rush": "Rock Alternativo", # Prog
    "Satchel": "Rock Alternativo",
    "Scalaland": "Rock Alternativo",
    "Schtum": "Rock Alternativo",
    "Screaming Trees": "Rock Alternativo",
    "Semisonic": "Rock Alternativo",
    "Sepultura": "Metal",
    "Sheryl Crow": "Rock Alternativo",
    "Shudder To Think": "Rock Alternativo",
    "Silverchair": "Rock Alternativo", # Grunge
    "Simple Minds": "Rock Alternativo",
    "Siouxsie & The Banshees": "Rock Alternativo", # Post-Punk
    "Skunk Anansie": "Rock Alternativo",
    "Slam (2)": "Eletronico",
    "Slayer": "Metal",
    "Smashing Pumpkins": "Rock Alternativo",
    "Social Distortion": "Punk",
    "Son Volt": "Rock Alternativo", # Alt Country
    "Sonic Youth": "Rock Alternativo",
    "Sophie B. Hawkins": "Pop",
    "Soul Asylum": "Rock Alternativo",
    "Soul Coughing": "Rock Alternativo",
    "Soundgarden": "Rock Alternativo",
    "Spacehog": "Rock Alternativo",
    "Spiritualized": "Rock Alternativo", # Space Rock
    "Sponge (3)": "Rock Alternativo",
    "Stabbing Westward": "Rock Alternativo",
    "Stone Temple Pilots": "Rock Alternativo",
    "Strangelove": "Rock Alternativo",
    "Sublime": "Rock Alternativo", # Ska Punk
    "Suede": "Rock Alternativo", # Britpop
    "Sugar Ray": "Rock Alternativo", # Early stuff was funk metal
    "Suggs": "Pop", # Ska/Pop
    "Supergrass": "Rock Alternativo", # Britpop
    "Switchblade Symphony": "Rock Alternativo", # Goth
    "Tanita Tikaram": "Pop",
    "Tears For Fears": "Pop",
    "Teenage Fanclub": "Rock Alternativo",
    "Terrorvision": "Rock Alternativo",
    "Tesla": "Metal", # Hard Rock
    "That Dog": "Rock Alternativo",
    "The Afghan Whigs": "Rock Alternativo",
    "The Amps": "Rock Alternativo",
    "The Beatles": "Pop", # Classic Rock
    "The Black Crowes": "Rock Alternativo",
    "The Bluetones": "Rock Alternativo",
    "The Boo Radleys": "Rock Alternativo",
    "The Charlatans": "Rock Alternativo",
    "The Connells": "Rock Alternativo",
    "The Corrs": "Pop",
    "The Cramps": "Punk",
    "The Cranberries": "Rock Alternativo",
    "The Cult": "Rock Alternativo",
    "The Electric Hellfire Club": "Metal", # Industrial
    "The Gathering": "Metal",
    "The Human League": "Pop",
    "The Innocence Mission": "Rock Alternativo",
    "The Jesus And Mary Chain": "Rock Alternativo",
    "The Lemonheads": "Rock Alternativo",
    "The Lightning Seeds": "Rock Alternativo",
    "The Muffs": "Rock Alternativo", # Pop Punk
    "The Mystics": "Rock Alternativo",
    "The Nixons": "Rock Alternativo",
    "The Offspring": "Punk",
    "The Presidents Of The United States Of America": "Rock Alternativo",
    "The Rolling Stones": "Rock Alternativo", # Classic Rock
    "The Shamen": "Eletronico",
    "The Smashing Pumpkins": "Rock Alternativo",
    "The Stone Roses": "Rock Alternativo",
    "The Stranglers": "Punk",
    "The The": "Rock Alternativo",
    "The Tractors": "Country",
    "The Verve": "Rock Alternativo",
    "The Wolfgang Press": "Rock Alternativo",
    "Thunder": "Rock Alternativo", # Hard Rock
    "Thurston Moore": "Rock Alternativo",
    "Titãs": "Rock Alternativo",
    "Toad The Wet Sprocket": "Rock Alternativo",
    "Tom Petty": "Rock Alternativo",
    "Toto": "Pop", # Rock
    "Tracy Bonham": "Rock Alternativo",
    "Tripping Daisy": "Rock Alternativo",
    "U2": "Rock Alternativo",
    "Ugly Kid Joe": "Rock Alternativo", # Hard Rock
    "Urge Overkill": "Rock Alternativo",
    "Voodoo Glow Skulls": "Punk", # Ska Punk
    "W.A.S.P.": "Metal",
    "WAX": "Rock Alternativo",
    "Ween": "Rock Alternativo",
    "Weezer": "Rock Alternativo",
    "Wet Wet Wet": "Pop",
    "Whale": "Rock Alternativo",
    "White Zombie": "Metal",
    "X Japan": "Metal",
    "Zumpano": "Rock Alternativo",

    # Pop / Dance / R&B
    "2 Brothers On The 4th Floor": "Dance",
    "2 Unlimited": "Dance",
    "20 Fingers": "Dance",
    "3T": "Pop", # R&B
    "Aaron Neville": "Pop", # R&B
    "Ace of Base": "Pop",
    "Adam Ant": "Pop",
    "Alex Party": "Dance",
    "All-4-One": "Pop", # R&B
    "Amy Grant": "Pop",
    "Annabella Lwin": "Pop",
    "Annie Lennox": "Pop",
    "Aphex Twin": "Eletronico",
    "Aswad": "Pop", # Reggae
    "Backstreet Boys": "Pop",
    "Bananarama": "Pop",
    "Basia": "Pop", # Jazz Pop
    "Bette Midler": "Pop",
    "Big Mountain": "Pop", # Reggae
    "Billy Ray Cyrus": "Country",
    "Björk": "Eletronico",
    "Black Box": "Dance",
    "Blackstreet": "Pop", # R&B
    "Blessid Union Of Souls": "Pop",
    "Blümchen": "Dance",
    "Boyz II Men": "Pop", # R&B
    "Boyzone": "Pop",
    "Brooks & Dunn": "Country",
    "Bruce Springsteen": "Rock Alternativo", # Rock
    "Buckshot LeFonque": "Pop", # Jazz/Rap
    "Cæcilie Norby": "Pop",
    "Captain Jack": "Dance",
    "Caught In The Act": "Pop",
    "Céline Dion": "Pop",
    "Centory": "Dance",
    "Chage & Aska": "Pop",
    "Cher": "Pop",
    "Cliff Richard": "Pop",
    "Clock": "Dance",
    "Collin Raye": "Country",
    "Corona": "Dance",
    "D’Angelo": "Pop", # R&B
    "Das Modul": "Dance",
    "Dave Stewart (8)": "Pop",
    "Deborah Cox": "Pop", # R&B
    "Diana King": "Pop", # R&B/Reggae
    "Diana Ross": "Pop",
    "Die Prinzen": "Pop",
    "Dieter Thomas Kuhn & Band": "Pop", # Schlager
    "DJ Hooligan": "Dance",
    "DJ Jacques O.": "Dance",
    "DJ Sammy": "Dance",
    "Doky Brothers": "Pop",
    "Dr. Alban": "Dance",
    "Dune (4)": "Dance",
    "Duran Duran": "Pop",
    "Dwight Yoakam": "Country",
    "E-Rotic": "Dance",
    "Edyta Górniak": "Pop",
    "Elton John": "Pop",
    "EMF": "Rock Alternativo", # Dance-Rock
    "Enrique Iglesias": "Pop",
    "Enya": "Pop",
    "Erasure": "Eletronico",
    "Faith Hill": "Country",
    "Faithless": "Eletronico",
    "Fun Factory": "Dance",
    "George Michael": "Pop",
    "Giorgia (2)": "Pop",
    "Gloria Estefan": "Pop",
    "Harry Connick, Jr.": "Pop",
    "Herbie": "Pop",
    "Incognito": "Pop", # Acid Jazz
    "Ini Kamoze": "Pop", # Reggae
    "Janet Jackson": "Pop", # R&B
    "Jennifer Love Hewitt": "Pop",
    "Jodeci": "Pop", # R&B
    "Jody Watley": "Pop", # R&B
    "Joe Diffie": "Country",
    "Josh Wink": "Eletronico",
    "Joya": "Pop", # R&B
    "k.d. lang": "Pop",
    "Kajsa": "Pop",
    "Kathy Mattea": "Country",
    "Kim Wilde": "Pop",
    "Kylie Minogue": "Pop",
    "Laura Pausini": "Pop",
    "Leftfield": "Eletronico",
    "Lisa Gerrard & Pieter Bourke": "Pop", # World
    "Lisa Loeb": "Pop",
    "London Posse": "Rap",
    "Los Tigres Del Norte": "Country",
    "Los Tres (2)": "Rock Alternativo",
    "Louise": "Pop",
    "M People": "Dance",
    "Madonna": "Pop",
    "Marco Antonio Solís": "Pop",
    "Mariah Carey": "Pop", # R&B
    "Mark Morrison": "Pop", # R&B
    "Marta Sánchez": "Pop",
    "Martin Page": "Pop",
    "Martina McBride": "Country",
    "Mary J. Blige": "Pop", # R&B
    "Masterboy": "Dance",
    "Matt Bianco": "Pop",
    "Me & My": "Dance",
    "Meat Loaf": "Rock Alternativo",
    "Michael Bolton": "Pop",
    "Michael Jackson": "Pop",
    "Michael Learns To Rock": "Pop",
    "Michael Rose": "Pop", # Reggae
    "Mighty Dub Kats": "Dance",
    "Mo-Do": "Dance",
    "Moby": "Eletronico",
    "Moloko": "Eletronico",
    "Monifah": "Pop", # R&B
    "Montell Jordan": "Pop", # R&B
    "Morcheeba": "Eletronico", # Trip Hop
    "N-Trance": "Dance",
    "Nacho Cano": "Pop",
    "No Mercy": "Pop",
    "Ondina": "Dance",
    "Paula Abdul": "Pop",
    "Paulina Rubio": "Pop",
    "Peter Andre": "Pop", # R&B
    "Playa Poncho": "Rap",
    "Prince": "Pop",
    "Qkumba Zoo": "Dance",
    "Queen Latifah": "Rap", # Pop/Rap
    "Real McCoy": "Dance",
    "Reba McEntire": "Country",
    "Rednex": "Dance",
    "Ricky Martin": "Pop",
    "Robyn": "Pop",
    "Ruffnexx Sound System": "Dance",
    "RuPaul": "Dance",
    "Sammy Kershaw": "Country",
    "Scatman John": "Pop",
    "Scooter": "Dance",
    "Seal": "Pop",
    "Seiko Matsuda": "Pop",
    "Selena": "Pop",
    "Shaggy": "Pop", # Reggae
    "Shai (3)": "Pop", # R&B
    "Shakira": "Pop",
    "Shania Twain": "Country",
    "Shanna": "Dance",
    "Silk (6)": "Pop", # R&B
    "Simply Red": "Pop",
    "Sin With Sebastian": "Pop",
    "Sinclair": "Pop", # Funk
    "Sinéad O'Connor": "Pop", # Alt Pop
    "Society of soul": "Pop", # R&B
    "Solo": "Pop", # R&B
    "Soul For Real": "Pop", # R&B
    "Soul II Soul": "Pop", # R&B
    "Spagna": "Dance",
    "Spahn Ranch": "Eletronico", # Industrial
    "Sting": "Pop",
    "Sweetbox": "Pop", # Hip Hop/Pop
    "SWV": "Pop", # R&B
    "Take That": "Pop",
    "Taylor Dayne": "Pop",
    "Techno Cop": "Dance",
    "Terri Clark": "Country",
    "Thalía": "Pop",
    "The Bucketheads": "Dance",
    "The Chemical Brothers": "Eletronico",
    "The Corrs": "Pop",
    "The Human League": "Pop",
    "The Notorious B.I.G.": "Rap",
    "The Whispers": "Pop", # R&B
    "Tina Arena": "Pop",
    "Tina Turner": "Pop",
    "Toni Braxton": "Pop", # R&B
    "Toto": "Pop",
    "Tracy Byrd": "Country",
    "Trisha Yearwood": "Country",
    "Twins": "Pop",
    "Twinz (2)": "Rap",
    "U2": "Rock Alternativo",
    "UB40": "Pop", # Reggae
    "Urban Dance Squad": "Rock Alternativo", # Rap Rock
    "Utah Saints": "Eletronico",
    "Vanessa Williams": "Pop",
    "Voice Of The Beehive": "Pop",
    "Wet Wet Wet": "Pop",
    "Whitney Houston": "Pop", # R&B
    "Zucchero": "Pop",

    # Rap / Hip Hop
    "2Pac": "Rap",
    "5th Ward Boyz": "Rap",
    "5th Ward Juvenilez": "Rap",
    "Aceyalone": "Rap",
    "AZ": "Rap",
    "Biohazard": "Metal", # Rap Metal
    "Black Grape": "Rock Alternativo", # Alt / Rap
    "Bone Thugs-N-Harmony": "Rap",
    "C-Bo": "Rap",
    "Clever Jeff": "Rap",
    "Coolio": "Rap",
    "Cypress Hill": "Rap",
    "Da Brat": "Rap",
    "Dana Dane": "Rap",
    "Das EFX": "Rap",
    "Digital Underground": "Rap",
    "DJ Quik": "Rap",
    "DJ Smurf (2)": "Rap",
    "Dr. Dre": "Rap",
    "E-40": "Rap",
    "E.S.G. (2)": "Rap",
    "Fettes Brot": "Rap",
    "Goodie Mob": "Rap",
    "Group Therapy": "Rap",
    "Heavy D. & The Boyz": "Rap",
    "Homicide (4)": "Rap",
    "Ice Cube": "Rap",
    "Jay Z": "Rap",
    "Keith Murray": "Rap",
    "Kris Kross": "Rap",
    "Lil Kim": "Rap",
    "LL Cool J": "Rap",
    "Lords Of The Underground": "Rap",
    "Luniz": "Rap",
    "Mack 10": "Rap",
    "Mad Skillz": "Rap",
    "Master P": "Rap",
    "Method Man": "Rap",
    "Miilkbone": "Rap",
    "Mobb Deep": "Rap",
    "Mystikal": "Rap",
    "Naughty By Nature": "Rap",
    "Onyx": "Rap",
    "OutKast": "Rap",
    "Poppa Doo": "Rap",
    "Public Enemy": "Rap",
    "Raekwon": "Rap",
    "Raphael Saadiq": "Pop", # R&B
    "Redman": "Rap",
    "Salt 'N' Pepa": "Rap",
    "Scarface": "Rap",
    "Snoop Dogg": "Rap",
    "Spice 1": "Rap",
    "Suga T": "Rap",
    "The Click": "Rap",
    "The Dayton Family": "Rap",
    "The Nonce": "Rap",
    "The Pharcyde": "Rap",
    "The Roots": "Rap",
    "Too Short": "Rap",
    "Warren G": "Rap",
    "Young Zee": "Rap",
}

def enrich_genres():
    input_path = 'data/1995.json'
    
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
