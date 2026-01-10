import json
import os

# Define the genre mapping
# Supported in App: 'Rock Alternativo', 'Punk', 'Metal', 'Rap', 'Pop', 'Dance', 'Eletronico'
# Strategies:
# - Grunge/Indie/Alt -> 'Rock Alternativo'
# - Hard Rock -> 'Metal' or 'Rock Alternativo' (depending on heaviness)
# - Hip Hop -> 'Rap'
# - R&B -> 'Pop' or 'Rap' (depending on style, usually Pop/R&B fits Pop for broad radio) -> Let's map R&B to 'Pop' for now, or maybe 'Rap' if it's very hip hop adjacent. Let's stick to 'Pop' for broad appeal unless it's distinct rap.
# - Country -> 'Country' (Will show in 'Tudo')

ARTIST_GENRES = {
    # Rock / Alt / Indie / Grunge
    "10,000 Maniacs": "Rock Alternativo",
    "4 Non Blondes": "Rock Alternativo",
    "Aimee Mann": "Rock Alternativo",
    "Alice In Chains": "Rock Alternativo",
    "Arcade": "Rock Alternativo",
    "Bad Religion": "Punk",
    "Bailter Space": "Rock Alternativo",
    "Belly": "Rock Alternativo",
    "Big Country": "Rock Alternativo",
    "Blind Melon": "Rock Alternativo",
    "Blue Rodeo": "Rock Alternativo",
    "Blues Traveler": "Rock Alternativo",
    "Blur": "Rock Alternativo",
    "Brad": "Rock Alternativo",
    "Buffalo Tom": "Rock Alternativo",
    "Bundock Lanoie": "Rock Alternativo",
    "Butthole Surfers": "Rock Alternativo",
    "Candlebox": "Rock Alternativo",
    "Catherine Wheel": "Rock Alternativo",
    "Chainsaw Kittens": "Rock Alternativo",
    "Cocteau Twins": "Rock Alternativo",
    "Counting Crows": "Rock Alternativo",
    "Cracker": "Rock Alternativo",
    "Cry Of Love": "Rock Alternativo",
    "Dandelion": "Rock Alternativo",
    "Deep Forest": "Eletronico",
    "Depeche Mode": "Eletronico", # Or Rock Alt
    "Dinosaur Jr": "Rock Alternativo",
    "Drivin' N' Cryin'": "Rock Alternativo",
    "Energy Orchard": "Rock Alternativo",
    "Eve's Plum": "Rock Alternativo",
    "Faith No More": "Rock Alternativo",
    "fIREHOSE": "Rock Alternativo",
    "Frank Black": "Rock Alternativo",
    "Gin Blossoms": "Rock Alternativo",
    "Gumball (2)": "Rock Alternativo",
    "Hothouse Flowers": "Rock Alternativo",
    "Infectious Grooves": "Rock Alternativo", # Funk Metal
    "James": "Rock Alternativo",
    "Jane's Addiction": "Rock Alternativo",
    "Jellyfish (2)": "Rock Alternativo",
    "Living Colour": "Rock Alternativo", # Funk Metal
    "Luscious Jackson": "Rock Alternativo",
    "Manic Street Preachers": "Rock Alternativo",
    "Matthew Sweet": "Rock Alternativo",
    "Mazzy Star": "Rock Alternativo",
    "New Order": "Rock Alternativo", # / Electronic
    "Nirvana": "Rock Alternativo",
    "Pearl Jam": "Rock Alternativo",
    "PJ Harvey": "Rock Alternativo",
    "Porno For Pyros": "Rock Alternativo",
    "Primus": "Rock Alternativo", # Funk Metal
    "Pulp": "Rock Alternativo",
    "Quicksand (3)": "Rock Alternativo", # Post-Hardcore
    "R.E.M.": "Rock Alternativo",
    "Radiohead": "Rock Alternativo",
    "Rancid": "Punk",
    "Red Hot Chili Peppers": "Rock Alternativo",
    "Screaming Trees": "Rock Alternativo",
    "Smashing Pumpkins": "Rock Alternativo",
    "Sonic Youth": "Rock Alternativo",
    "Soul Asylum": "Rock Alternativo",
    "Spin Doctors": "Rock Alternativo",
    "Spoonfed Hybrid": "Rock Alternativo",
    "Squeeze": "Pop", # / Rock
    "Stone Temple Pilots": "Rock Alternativo",
    "Suede": "Rock Alternativo",
    "Sugar (5)": "Rock Alternativo",
    "Superchunk": "Rock Alternativo",
    "Teenage Fanclub": "Rock Alternativo",
    "The Afghan Whigs": "Rock Alternativo",
    "The Big F": "Rock Alternativo",
    "The Breeders": "Rock Alternativo",
    "The Charlatans": "Rock Alternativo",
    "The Connells": "Rock Alternativo",
    "The Cranberries": "Rock Alternativo",
    "The Jesus And Mary Chain": "Rock Alternativo",
    "The Lemonheads": "Rock Alternativo",
    "The Mighty Mighty Bosstones": "Rock Alternativo", # Ska Punk
    "The Ocean Blue": "Rock Alternativo",
    "The Tea Party": "Rock Alternativo",
    "The Verve": "Rock Alternativo",
    "The Wallflowers": "Rock Alternativo",
    "Throw that Beat in the Garbagecan!": "Rock Alternativo",
    "Titãs": "Rock Alternativo",
    "Tool": "Metal", # Alt Metal
    "Tripping Daisy": "Rock Alternativo",
    "Urge Overkill": "Rock Alternativo",
    "Velocity Girl": "Rock Alternativo",
    "Walt Mink": "Rock Alternativo",
    "Ween": "Rock Alternativo", # Alt
    "X": "Rock Alternativo", # Punk/Alt

    # Punk / Hardcore / Ska
    "NOFX": "Punk",
    "Bad Religion": "Punk",
    "The Mighty Mighty Bosstones": "Punk", # Ska Punk fits ok here or Alt
    "Suicidal Tendencies": "Punk", # Crossover Thrash

    # Metal / Hard Rock
    "Accept": "Metal",
    "AC/DC": "Metal", # Hard Rock
    "Aerosmith": "Metal", # Hard Rock
    "Anthrax": "Metal",
    "Bad Moon Rising": "Metal",
    "Carcass": "Metal",
    "Circus Of Power": "Metal",
    "Corpus Delicti": "Rock Alternativo", # Goth
    "Damn Yankees": "Metal",
    "Danzig": "Metal",
    "Def Leppard": "Metal",
    "Die Krupps": "Metal", # Industrial
    "Entombed": "Metal",
    "Extreme": "Metal", # Hard Rock
    "Fear Factory": "Metal",
    "Fight": "Metal",
    "Firehouse": "Metal", # Glam Metal
    "Gotthard": "Metal",
    "Guns N' Roses": "Metal", # Hard Rock
    "Life of Agony": "Metal",
    "Megadeth": "Metal",
    "Metallica": "Metal",
    "Monster Magnet": "Metal",
    "Morbid Angel": "Metal",
    "Motörhead": "Metal",
    "Mr. Big": "Metal",
    "Napalm Death": "Metal",
    "Paradise Lost": "Metal",
    "Poison": "Metal", # Glam
    "Queensrÿche": "Metal",
    "Rush": "Rock Alternativo", # Prog
    "Scorpions": "Metal",
    "Sepultura": "Metal",
    "Terrorvision": "Metal",
    "Thunder": "Metal",
    "Type O Negative": "Metal",
    "Van Halen": "Metal",

    # Rap / Hip Hop
    "2Pac": "Rap",
    "Above The Law": "Rap",
    "Arrested Development": "Rap",
    "Beastie Boys": "Rap",
    "Bell Biv DeVoe": "Rap", # / R&B
    "Cypress Hill": "Rap",
    "Das EFX": "Rap",
    "De La Soul": "Rap",
    "Digable Planets": "Rap",
    "DMG": "Rap",
    "Dr. Dre": "Rap",
    "Erick Sermon": "Rap",
    "Geto Boys": "Rap",
    "Ghetto Concept": "Rap",
    "House of Pain": "Rap",
    "Ice Cube": "Rap",
    "Kris Kross": "Rap",
    "LL Cool J": "Rap",
    "Lords of the Underground": "Rap",
    "Marxman": "Rap",
    "MC Serch": "Rap",
    "Naughty By Nature": "Rap",
    "Onyx": "Rap",
    "Oaktown's 3-5-7": "Rap",
    "P.M. Dawn": "Rap",
    "Pharcyde": "Rap",
    "Prime Minister Pete Nice & Daddy Rich": "Rap",
    "Public Enemy": "Rap",
    "Queen Latifah": "Rap",
    "Redman": "Rap",
    "Salt-N-Pepa": "Rap",
    "Snoop Doggy Dogg": "Rap",
    "Snow": "Rap", # Reggae Fusion
    "Souls of Mischief": "Rap",
    "The Pharcyde": "Rap",
    "Volume 10": "Rap",
    "Wu-Tang Clan": "Rap",
    "IAM": "Rap",
    "London Posse": "Rap",
    "Usher": "Pop", # R&B

    # Pop / R&B / Mainstream
    "Aaron Neville": "Pop",
    "Ace of Base": "Pop",
    "Alanis Morissette": "Pop", # Early pop
    "Babyface": "Pop", # R&B
    "Bananarama": "Pop",
    "Bee Gees": "Pop",
    "Belinda Carlisle": "Pop",
    "Billy Idol": "Pop", # Rock
    "Billy Joel": "Pop",
    "Björk": "Pop", # / Electronic / Alt
    "Bobby Brown": "Pop", # R&B
    "Bon Jovi": "Pop", # / Rock
    "Boyz II Men": "Pop", # R&B
    "Bryan Adams": "Pop", # Rock
    "céline Dion": "Pop",
    "Céline Dion": "Pop",
    "Cliff Richard": "Pop",
    "Cyndi Lauper": "Pop",
    "Diana Ross": "Pop",
    "Donald Fagen": "Pop",
    "Duran Duran": "Pop",
    "Eddie Murphy": "Pop",
    "Elton John": "Pop",
    "En Vogue": "Pop", # R&B
    "Eros Ramazzotti": "Pop",
    "Gabrielle": "Pop",
    "Genesis": "Pop",
    "George Michael": "Pop",
    "Gloria Estefan": "Pop",
    "Heart": "Pop", # Rock
    "INXS": "Pop", # Rock
    "Janet Jackson": "Pop",
    "Jeremy Jordan": "Pop",
    "Joe": "Pop", # R&B
    "John Mellencamp": "Pop", # Rock
    "Kate Bush": "Pop", # / Art Pop
    "Kenny G": "Pop", # Jazz
    "Kim Appleby": "Pop",
    "Lenny Kravitz": "Pop", # Rock
    "Lisa Stansfield": "Pop",
    "Madonna": "Pop",
    "Mariah Carey": "Pop",
    "Michael Bolton": "Pop",
    "Michael Jackson": "Pop",
    "Michael Learns To Rock": "Pop",
    "Mint Condition": "Pop", # R&B
    "NKOTB": "Pop",
    "Pat Benatar": "Pop", # Rock
    "Paul McCartney": "Pop",
    "Paulina Rubio": "Pop",
    "Pet Shop Boys": "Pop", # Synth-pop
    "Peter Gabriel": "Pop",
    "Phil Collins": "Pop",
    "Prince": "Pop", # Funk / Rock / Pop
    "R. Kelly": "Pop", # R&B
    "Ricky Martin": "Pop",
    "Rod Stewart": "Pop",
    "Roxette": "Pop",
    "RuPaul": "Dance",
    "Sade": "Pop", # Soul
    "Shai (3)": "Pop", # R&B
    "Shakespear's Sister": "Pop",
    "Shanice": "Pop",
    "Shaquille O'Neal": "Rap",
    "Sheryl Crow": "Pop",
    "Sting": "Pop",
    "SWV": "Pop", # R&B
    "Take That": "Pop",
    "Taylor Dayne": "Pop",
    "Tears For Fears": "Pop",
    "Terence Trent D'Arby": "Pop",
    "Thalía": "Pop",
    "The Christians": "Pop",
    "Tina Turner": "Pop",
    "TLC": "Pop", # R&B/HipHop -> Fits Pop nicely for this era
    "Toni Braxton": "Pop", # R&B
    "Tony! Toni! Toné!": "Pop", # R&B
    "U2": "Rock Alternativo", # Or Pop/Rock
    "UB40": "Pop", # Reggae
    "Whitney Houston": "Pop",
    "Xscape": "Pop", # R&B
    "Go West": "Pop",
    "Inner Circle": "Pop", # Reggae
    "Die Prinzen": "Pop",
    "Die Ärzte": "Punk",
    "Herbert Grönemeyer": "Pop",
    "Laura Pausini": "Pop",
    "Ligabue": "Rock Alternativo",
    "Litfiba": "Rock Alternativo",
    "Marta Sánchez": "Pop",
    "Robert Plant": "Rock Alternativo",
    "Stakka Bo": "Pop",
    "Stefan Andersson": "Pop",
    "The The": "Rock Alternativo",
    "Weird Al Yankovic": "Pop", # Comedy
    "a-ha": "Pop",

    # Dance / Electronic
    "2 Unlimited": "Dance",
    "808 State": "Eletronico",
    "Aphex Twin": "Eletronico",
    "Black Box": "Dance",
    "Capella": "Dance",
    "Cappella": "Dance",
    "Corona": "Dance",
    "Culture Beat": "Dance",
    "Daft Punk": "Eletronico",
    "Deep Forest": "Eletronico",
    "Dr. Alban": "Dance",
    "Haddaway": "Dance",
    "Jam & Spoon": "Eletronico",
    "Jamiroquai": "Dance", # Funk/Acid Jazz
    "M People": "Dance",
    "Magic Affair": "Dance",
    "Moby": "Eletronico",
    "Orbital": "Eletronico",
    "Robin S": "Dance",
    "The Prodigy": "Eletronico", # / Dance
    "The Shamen": "Eletronico",
    "Underworld": "Eletronico",
    "William Orbit": "Eletronico",
    "Babble": "Eletronico",
    "N-Trance": "Dance",

    # Country (Map to Pop or keep as Country which shows in 'Tudo')
    "Alan Jackson": "Country",
    "Brooks & Dunn": "Country",
    "Clint Black": "Country",
    "Dolly Parton": "Country",
    "Dwight Yoakam": "Country",
    "Faith Hill": "Country",
    "George Strait": "Country",
    "John Michael Montgomery": "Country",
    "Kenny Chesney": "Country",
    "Mark Chesnutt": "Country",
    "Martina McBride": "Country",
    "Reba McEntire": "Country",
    "Sammy Kershaw": "Country",
    "Shania Twain": "Country",
    "Toby Keith": "Country",
    "Tracy Byrd": "Country",
    "Trisha Yearwood": "Country",
    "Willie Nelson": "Country",
    "Joe Diffie": "Country",
    "John Brannen": "Country",

    # Misc / Unsure -> Default or Guesses
    "10,000 Maniacs": "Rock Alternativo",
    "A Tribe Called Quest": "Rap",
    "Angry Johnny & The Killbillies": "Rock Alternativo",
    "Beavis & Butt-Head": "Rock Alternativo",
    "Bettie Serveert": "Rock Alternativo",
    "Best Kissers In The World": "Rock Alternativo",
    "Caron Wheeler": "Pop", # Soul
    "Christopher Williams": "Pop", # R&B
    "Clutch (3)": "Rock Alternativo",
    "Coldcut": "Eletronico",
    "Corey Hart": "Pop",
    "Fishbone": "Rock Alternativo", # Ska/Funk Metal
    "Fuckhead": "Eletronico", # Industrial/Noise
    "Gitane Demone": "Rock Alternativo",
    "Indochine": "Rock Alternativo", # New Wave
    "Jan Terri": "Pop", # Outsider
    "Jenni Muldaur": "Pop",
    "King Missile": "Rock Alternativo",
    "LINGA": "Rock Alternativo",
    "MC Serch": "Rap",
    "Nick Scotti": "Pop",
    "Oaktown's 3-5-7": "Rap",
    "Odds (2)": "Rock Alternativo",
    "Pamela Means": "Rock Alternativo",
    "Pat Benatar": "Rock Alternativo",
    "Paul Weller": "Rock Alternativo",
    "Peaches & Bobo": "Rap",
    "Robben Ford": "Rock Alternativo", # Blues
    "Robert Forster": "Rock Alternativo",
    "Rosanne Cash": "Country",
    "Sarah McLachlan": "Pop",
    "Selena": "Pop", # Tejano/Pop
    "Sparks": "Rock Alternativo",
    "The Company": "Pop",
    "The Lovemongers": "Rock Alternativo", # Heart spinoff
    "The O'Jays": "Pop", # R&B
    "The Perfect Gentleman": "Rap",
    "William Orbit": "Eletronico",

    # Missing from Round 1
    "Alison Moyet": "Pop",
    "Bob Dylan": "Rock Alternativo",
    "Fetish 69": "Metal",
    "Soul II Soul": "Pop",
    "Texas": "Pop",
    "Dennis Leary": "Rock Alternativo",
    "311": "Rock Alternativo",
    "David Bowie": "Rock Alternativo",
    "The Smashing Pumpkins": "Rock Alternativo",
    "Maze": "Pop",
    "Maria McKee": "Pop",
    "Heavy D. & The Boyz": "Rap",
    "Marc Cohn": "Pop",
    "Iggy Pop": "Rock Alternativo",
    "Frank Sinatra (3)": "Pop",
    "Carmen Electra": "Pop"
}

def enrich_genres():
    input_path = 'data/1993.json'
    
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
            # Fallback or check for partials if needed
            # For now, just mark missing
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
