
import json
import os

# Define the genre mapping for 1997
ARTIST_GENRES = {
    # Rock Alternativo / Indie / Grunge / Post-Grunge
    "1.8.7.": "Eletronico", # Drum and Bass / Jungle
    "10,000 Maniacs": "Rock Alternativo",
    "AFI": "Punk",
    "Afterhours": "Rock Alternativo",
    "Allen Ginsberg": "Rock Alternativo", # Spoken Word / Poetry
    "Ambra Angiolini": "Pop",
    "Ash": "Rock Alternativo",
    "Backbone": "Rock Alternativo",
    "Basement Jaxx": "Eletronico",
    "Beck": "Rock Alternativo",
    "Bed & Breakfast": "Pop",
    "Ben Folds Five": "Rock Alternativo", # Piano Rock
    "Bentley Rhythm Ace": "Eletronico", # Big Beat
    "Bettie Serveert": "Rock Alternativo",
    "Big Wreck": "Rock Alternativo",
    "Billie Myers": "Rock Alternativo", # Pop Rock
    "Björk": "Eletronico",
    "Black Grape": "Rock Alternativo",
    "Blind Melon": "Rock Alternativo",
    "Bloodhound Gang": "Rock Alternativo", # Alt Hip Hop
    "Blue Rodeo": "Rock Alternativo",
    "Blues Traveler": "Rock Alternativo",
    "Blur": "Rock Alternativo", # Britpop
    "Bluvertigo": "Rock Alternativo",
    "bôa": "Rock Alternativo",
    "Bob Dylan": "Rock Alternativo", # Folk Rock
    "Bossi": "Dance",
    "Brooklyn Bounce": "Dance",
    "Bruce Robinson": "Country",
    "BT": "Eletronico",
    "Bush": "Rock Alternativo",
    "Buster Poindexter": "Pop",
    "Cake Like": "Rock Alternativo",
    "Camp Lo": "Rap",
    "Cappella": "Dance",
    "Captain Jack": "Dance",
    "Catatonia": "Rock Alternativo",
    "Catherine Wheel": "Rock Alternativo",
    "Chantal Kreviazuk": "Rock Alternativo",
    "Cheap Trick": "Rock Alternativo",
    "Chris Knight": "Country",
    "Chris Whitley": "Rock Alternativo",
    "Chumbawamba": "Rock Alternativo", # Pop Rock
    "Clawfinger": "Metal", # Nu Metal
    "Coal Chamber": "Metal", # Nu Metal
    "Collective Soul": "Rock Alternativo",
    "Cornershop": "Rock Alternativo", # Britpop / Indie
    "Counting Crows": "Rock Alternativo",
    "Crash Test Dummies": "Rock Alternativo",
    "Cruiser (2)": "Rock Alternativo",
    "Da Hool": "Dance",
    "Daft Punk": "Eletronico",
    "Darlahood": "Rock Alternativo",
    "Datura": "Dance",
    "Dave Matthews Band": "Rock Alternativo",
    "David Bowie": "Rock Alternativo",
    "Daze": "Dance",
    "De La Cruz": "Pop",
    "Death In Vegas": "Eletronico", # Big Beat
    "Deftones": "Metal",
    "Del Amitri": "Rock Alternativo",
    "Depeche Mode": "Eletronico", # Synth Pop
    "Die Fabulösen Thekenschlampen": "Pop", # Comedy
    "Die Fantastischen Vier": "Rap",
    "Dinosaur Jr.": "Rock Alternativo",
    "DJ The Crow": "Dance",
    "Dominique Dalcan": "Pop",
    "Drill": "Rock Alternativo",
    "Dujeous": "Rap",
    "Duncan Sheik": "Rock Alternativo",
    "Echo & The Bunnymen": "Rock Alternativo",
    "Eels": "Rock Alternativo",
    "Elisa": "Pop", # Rock
    "Elliott Smith": "Rock Alternativo",
    "Embrace": "Rock Alternativo", # Britpop
    "Emperor (2)": "Metal", # Black Metal
    "Encore (3)": "Dance",
    "Entombed": "Metal",
    "Erasure": "Eletronico",
    "Ether": "Rock Alternativo",
    "Eve 6": "Rock Alternativo",
    "Everclear": "Rock Alternativo",
    "Faith No More": "Rock Alternativo",
    "Faithless": "Eletronico",
    "Fatboy Slim": "Eletronico", # Big Beat
    "Feeder": "Rock Alternativo",
    "Fenix TX": "Punk", # Pop Punk
    "Filter": "Rock Alternativo", # Industrial
    "Fiona Apple": "Rock Alternativo",
    "Fish": "Rock Alternativo",
    "Five Iron Frenzy": "Punk", # Ska Punk
    "Fleetwood Mac": "Rock Alternativo", # Classic Rock
    "Fluffy (4)": "Rock Alternativo",
    "Foo Fighters": "Rock Alternativo",
    "Fountains Of Wayne": "Rock Alternativo",
    "Fretblanket": "Rock Alternativo",
    "Funky Green Dogs": "Dance",
    "General Base": "Dance",
    "Genesis": "Rock Alternativo", # Prog/Pop
    "GIL": "Pop",
    "Govinda": "Eletronico",
    "Grass-Show": "Rock Alternativo",
    "Green Day": "Punk",
    "Greg Allman": "Rock Alternativo",
    "Groove Club": "Dance",
    "Guano Apes": "Rock Alternativo", # Alt Metal
    "Gun (2)": "Rock Alternativo",
    "Helmet (2)": "Metal", # Alt Metal
    "Honey Is Cool": "Rock Alternativo",
    "Hooverphonic": "Eletronico", # Trip Hop
    "Howard New": "Pop",
    "Ibens": "Rock Alternativo",
    "Imogen Heap": "Rock Alternativo",
    "Inaura": "Rock Alternativo",
    "Incubus": "Rock Alternativo",
    "Indochine": "Rock Alternativo",
    "Inert": "Rock Alternativo",
    "Insane Clown Posse": "Rap", # Horrorcore
    "Jack Off Jill": "Rock Alternativo", # Goth
    "James": "Rock Alternativo",
    "Jamiroquai": "Pop", # Funk
    "Jars Of Clay": "Rock Alternativo",
    "JBO": "Metal", # Comedy Metal
    "Jebediah": "Rock Alternativo",
    "Jon Bon Jovi": "Rock Alternativo",
    "Jonny Lang": "Rock Alternativo", # Blues Rock
    "Junkster": "Rock Alternativo",
    "Kara's Flowers": "Rock Alternativo", # Pre-Maroon 5
    "Kent": "Rock Alternativo",
    "Korn": "Metal", # Nu Metal
    "Kosmonova": "Dance",
    "Kreator": "Metal",
    "Kula Shaker": "Rock Alternativo",
    "Kyosuke Himuro": "Rock Alternativo",
    "Lacrimosa": "Metal", # Gothic
    "Limp Bizkit": "Metal", # Nu Metal / Rap Metal
    "Litfiba": "Rock Alternativo",
    "Live": "Rock Alternativo",
    "Local H": "Rock Alternativo",
    "Los Tres (2)": "Rock Alternativo",
    "Luscious Jackson": "Rock Alternativo",
    "Malice Mizer": "Rock Alternativo", # Visual Kei
    "Mansun": "Rock Alternativo",
    "Marcy Playground": "Rock Alternativo",
    "Marilyn Manson": "Metal",
    "Mark 'Oh": "Dance",
    "Massive Attack": "Eletronico", # Trip Hop
    "Matchbox Twenty": "Rock Alternativo",
    "Matthew Sweet": "Rock Alternativo",
    "Mazzy Star": "Rock Alternativo",
    "Megadeth": "Metal",
    "Members Of Mayday": "Dance",
    "Meredith Brooks": "Rock Alternativo",
    "Metallica": "Metal",
    "Midnight Oil": "Rock Alternativo",
    "Mike Watt": "Rock Alternativo",
    "Moby": "Eletronico",
    "Modena City Ramblers": "Rock Alternativo", # Folk Rock
    "Morrissey": "Rock Alternativo",
    "Morten Abel": "Pop",
    "Mötley Crüe": "Metal",
    "Mr. Oizo": "Eletronico",
    "My Life Story": "Rock Alternativo", # Britpop
    "Myslovitz": "Rock Alternativo",
    "Naimee Coleman": "Rock Alternativo",
    "Nana": "Rap",
    "Natalie Imbruglia": "Pop", # Pop Rock
    "Nek": "Pop", # Rock
    "Neneh Cherry": "Pop",
    "Nick Cave & The Bad Seeds": "Rock Alternativo",
    "Nikolai": "Punk",
    "Nine Inch Nails": "Rock Alternativo", # Industrial
    "No Doubt": "Rock Alternativo", # Ska Punk
    "Nomansland": "Dance",
    "Oasis": "Rock Alternativo",
    "Ocean Colour Scene": "Rock Alternativo",
    "Octopus (9)": "Rock Alternativo",
    "Olive": "Eletronico", # Trip Hop
    "Ome Henk": "Pop", # Comedy
    "Orbital": "Eletronico",
    "Our Lady Peace": "Rock Alternativo",
    "Ozzy Osbourne": "Metal",
    "Paradise Lost": "Metal",
    "Paris Combo": "Pop",
    "Pat Benatar": "Rock Alternativo",
    "Paul McCartney": "Rock Alternativo",
    "Paul Weller": "Rock Alternativo",
    "Pavement": "Rock Alternativo",
    "Per Gessle": "Pop",
    "Peter Cetera": "Pop",
    "Placebo": "Rock Alternativo",
    "Plastic Voice": "Dance",
    "Porno For Pyros": "Rock Alternativo",
    "Powerman 5000": "Metal", # Industrial Metal
    "Prairie Oyster": "Country",
    "Prefab Sprout": "Pop",
    "Primal Scream": "Rock Alternativo",
    "Primus": "Rock Alternativo",
    "Pulp": "Rock Alternativo",
    "R.E.M.": "Rock Alternativo",
    "Radiohead": "Rock Alternativo",
    "Rage Against The Machine": "Rock Alternativo",
    "Rainhard Fendrich": "Pop",
    "Rammstein": "Metal", # Industrial
    "Red 5": "Dance",
    "Reef": "Rock Alternativo",
    "Republica": "Rock Alternativo",
    "Ric Ocasek": "Rock Alternativo",
    "RMB": "Dance",
    "Robin Cook": "Dance",
    "Rodney Crowell": "Country",
    "Rodriguez": "Rock Alternativo", # Folk
    "Roni Size": "Eletronico", # Drum and Bass
    "Roxette": "Pop",
    "Sash!": "Dance",
    "Scooter": "Dance",
    "Sequential One": "Dance",
    "Shawn Colvin": "Rock Alternativo", # Folk
    "Sheryl Crow": "Rock Alternativo",
    "Shudder To Think": "Rock Alternativo",
    "Silverchair": "Rock Alternativo",
    "Simple Minds": "Rock Alternativo",
    "Sinéad O'Connor": "Pop",
    "Sister Hazel": "Rock Alternativo",
    "Skunk Anansie": "Rock Alternativo",
    "Smash Mouth": "Rock Alternativo", # Ska Punk
    "Smoke City": "Eletronico", # Acid Jazz / Trip Hop
    "Sneaker Pimps": "Eletronico", # Trip Hop
    "Soon (6)": "Rock Alternativo",
    "Soul II Soul": "Pop", # R&B
    "Space Monkeys": "Rock Alternativo", # Madchester
    "Sparks": "Rock Alternativo",
    "Spring Heel Jack": "Eletronico", # Drum and Bass
    "Stereophonics": "Rock Alternativo",
    "Steve Winwood": "Pop", # Rock
    "Sting": "Pop",
    "Sublime": "Rock Alternativo", # Ska Punk
    "Subsonica": "Rock Alternativo", # Electronic Rock
    "Suede": "Rock Alternativo",
    "Sugar Ray": "Rock Alternativo",
    "Suggs": "Pop",
    "Super Furry Animals": "Rock Alternativo",
    "Superchunk": "Rock Alternativo",
    "Supergrass": "Rock Alternativo",
    "Supertramp": "Rock Alternativo",
    "Susumu Hirasawa": "Eletronico",
    "Switchfoot": "Rock Alternativo",
    "Symposium": "Rock Alternativo", # Pop Punk
    "T-Spoon (2)": "Dance",
    "Talk Show": "Rock Alternativo",
    "Tank": "Metal",
    "Tanya Donelly": "Rock Alternativo",
    "Tarnation": "Rock Alternativo", # Alt Country
    "Teenage Fanclub": "Rock Alternativo",
    "Terrorvision": "Rock Alternativo",
    "Texas": "Pop", # Pop Rock
    "The Brand New Heavies": "Pop", # Acid Jazz
    "The Charlatans": "Rock Alternativo",
    "The Chemical Brothers": "Eletronico",
    "The Corrs": "Pop",
    "The Crystal Method": "Eletronico", # Big Beat
    "The Cunninghams": "Rock Alternativo",
    "The Cure": "Rock Alternativo",
    "The Devlins": "Rock Alternativo",
    "The Jayhawks": "Rock Alternativo", # Alt Country
    "The Kinleys": "Country",
    "The Lemonheads": "Rock Alternativo",
    "The Lightning Seeds": "Rock Alternativo",
    "The Mighty Mighty Bosstones": "Rock Alternativo", # Ska Punk
    "The Offspring": "Punk",
    "The Presidents Of The United States Of America": "Rock Alternativo",
    "The Prodigy": "Eletronico", # Big Beat
    "The Refreshments": "Rock Alternativo",
    "The Rolling Stones": "Rock Alternativo",
    "The Seahorses": "Rock Alternativo",
    "The Smashing Pumpkins": "Rock Alternativo",
    "The Spinanes": "Rock Alternativo",
    "The Sunclub": "Dance",
    "The Sundays": "Rock Alternativo",
    "The Supernaturals": "Rock Alternativo",
    "The Verve Pipe": "Rock Alternativo",
    "The Verve": "Rock Alternativo",
    "The Wallflowers": "Rock Alternativo",
    "Third Eye Blind": "Rock Alternativo",
    "Tiggy": "Dance",
    "Toad The Wet Sprocket": "Rock Alternativo",
    "Tonic (2)": "Rock Alternativo",
    "Tool": "Metal",
    "Tori Amos": "Rock Alternativo",
    "Tra-X": "Dance",
    "Tricky": "Eletronico", # Trip Hop
    "U2": "Rock Alternativo",
    "UB40": "Pop", # Reggae
    "Veruca Salt": "Rock Alternativo",
    "Violent Femmes": "Rock Alternativo",
    "Voodoo Glow Skulls": "Punk", # Ska Punk
    "Wannadies, The": "Rock Alternativo",
    "Waveform7": "Eletronico",
    "Wet Wet Wet": "Pop",
    "White Town": "Eletronico", # Synth Pop
    "Widespread Panic": "Rock Alternativo", # Jam Band
    "Wilco": "Rock Alternativo",
    "Yello": "Eletronico",
    "Yo La Tengo": "Rock Alternativo",
    "Yvonne (3)": "Rock Alternativo",

    # Pop / R&B / Mainstream
    "*NSYNC": "Pop",
    "2 Eivissa": "Dance",
    "2 Brothers On The 4th Floor": "Dance",
    "A.K.-S.W.I.F.T.": "Rap",
    "Aaliyah": "Pop", # R&B
    "Aaron Carter": "Pop",
    "Adeva": "Dance",
    "Aerosmith": "Rock Alternativo", # Hard Rock
    "Alan Jackson": "Country",
    "Alexia": "Dance",
    "Alliage": "Pop",
    "Amy Grant": "Pop",
    "Andrea Bocelli": "Pop", # Classical / Pop
    "Aphex Twin": "Eletronico",
    "Aqua": "Pop",
    "Arthur H": "Pop",
    "Az Yet": "Pop", # R&B
    "Backstreet Boys": "Pop",
    "Balibu": "Dance",
    "Basic Connection": "Dance",
    "Bee Gees": "Pop",
    "Belinda Carlisle": "Pop",
    "Bellini": "Dance",
    "Big Bub": "Pop", # R&B
    "Billy Joel": "Pop",
    "Blackstreet": "Pop", # R&B
    "Bobby Brown": "Pop", # R&B
    "Bobby McFerrin": "Pop",
    "Boyz II Men": "Pop", # R&B
    "Boyzone": "Pop",
    "Brian McKnight": "Pop", # R&B
    "Brigid Boden": "Pop",
    "Brooks & Dunn": "Country",
    "Brownstone": "Pop", # R&B
    "Bryan Adams": "Pop", # Rock
    "Buckshot LeFonque": "Pop",
    "C-Block": "Rap",
    "Céline Dion": "Pop",
    "Chayanne": "Pop",
    "Chely Wright": "Country",
    "Chico Y Chico": "Dance",
    "Clint Black": "Country",
    "Coolio": "Rap",
    "Corey Hart": "Pop",
    "Corona": "Dance",
    "Cyndi Lauper": "Pop",
    "Damian Marley": "Pop", # Reggae
    "Dana Dawson": "Pop",
    "David Hasselhoff": "Pop",
    "Deborah Cox": "Pop", # R&B
    "DeDe Lopez": "Pop",
    "Denosh": "Dance",
    "Des'ree": "Pop",
    "Despina Vandi": "Pop",
    "Destiny's Child": "Pop", # R&B
    "DFC (2)": "Rap",
    "Die Prinzen": "Pop",
    "DJ Sammy": "Dance",
    "Donnie McClurkin": "Pop", # Gospel
    "Down Low": "Rap",
    "Duran Duran": "Pop",
    "E-Rotic": "Dance",
    "Edyta Górniak": "Pop",
    "Elton John": "Pop",
    "Enrique Iglesias": "Pop",
    "Enya": "Pop",
    "Eros Ramazzotti": "Pop",
    "Erykah Badu": "Pop", # Neo Soul
    "Eternal": "Pop", # R&B
    "Etienne Daho": "Pop",
    "Faudel": "Pop", # Rai
    "Five": "Pop",
    "Flip Da Scrip": "Rap",
    "Foxy Brown": "Rap",
    "G's Incorporated": "Dance",
    "Gary Barlow": "Pop",
    "George Michael": "Pop",
    "Ginuwine": "Pop", # R&B
    "Giorgia (2)": "Pop",
    "Gravediggaz": "Rap",
    "Hanson": "Pop",
    "Harry Connick, Jr.": "Pop",
    "Heavy D.": "Rap",
    "Hip Hop Alliance": "Rap",
    "Ice Cube": "Rap",
    "Inoj": "Pop", # R&B
    "Ivan": "Pop",
    "Jagged Edge": "Pop", # R&B
    "Janet Jackson": "Pop", # R&B
    "Jay Z": "Rap",
    "Jennifer Rush": "Pop",
    "Jewel": "Pop",
    "Jim Brickman": "Pop",
    "Jody Watley": "Pop",
    "Joe Cocker": "Rock Alternativo",
    "Joe": "Pop", # R&B
    "Johnny Gill": "Pop", # R&B
    "Johnny Right": "Pop",
    "K-Ci & JoJo": "Pop", # R&B
    "Kathy Mattea": "Country",
    "Keb' Mo'": "Pop", # Blues
    "Kenny Chesney": "Country",
    "Kenny G": "Pop", # Jazz
    "KRS-One": "Rap",
    "Kylie Minogue": "Pop",
    "Laura Pausini": "Pop",
    "Laurneá": "Pop", # R&B
    "Lauryn Hill": "Pop", # R&B / Rap
    "LeAnn Rimes": "Country",
    "Lisa Loeb": "Pop",
    "Lisa Stansfield": "Pop", # R&B
    "LL Cool J": "Rap",
    "Los Fabulosos Cadillacs": "Rock Alternativo", # Ska
    "Los Tigres Del Norte": "Country", # Norteño
    "Louise": "Pop",
    "LSG": "Pop", # R&B
    "M People": "Dance",
    "Ma$e": "Rap",
    "Mack 10": "Rap",
    "Madonna": "Pop",
    "Maggie Reilly": "Pop",
    "Mariah Carey": "Pop", # R&B
    "Mark Morrison": "Pop", # R&B
    "Mark Wills": "Country",
    "Marta Sánchez": "Pop",
    "Martina McBride": "Country",
    "Mary J. Blige": "Pop", # R&B
    "Master P": "Rap",
    "Michael Bolton": "Pop",
    "Michael Jackson": "Pop",
    "Michael Learns To Rock": "Pop",
    "Michael Penn": "Rock Alternativo",
    "Mint Condition": "Pop",
    "Missy Elliott": "Rap",
    "Nas": "Rap",
    "Next": "Pop", # R&B
    "No Authority": "Pop",
    "No Mercy": "Pop",
    "Notorious B.I.G.": "Rap",
    "OMC": "Pop",
    "OutKast": "Rap",
    "Paradisio": "Dance",
    "Patricia Kaas": "Pop",
    "Paul Brandt": "Country",
    "Paula Cole": "Pop",
    "Phil Collins": "Pop",
    "Prince": "Pop",
    "Puff Daddy": "Rap",
    "Puff Johnson": "Pop",
    "R. Kelly": "Pop", # R&B
    "R'n'G": "Rap",
    "Racionais MC's": "Rap",
    "Rahsaan Patterson": "Pop", # R&B
    "Reba McEntire": "Country",
    "Redman": "Rap",
    "Ricky Martin": "Pop",
    "Robbie Williams": "Pop",
    "Robyn": "Pop",
    "Rome": "Pop", # R&B
    "Rosana (2)": "Pop",
    "Run-DMC": "Rap",
    "RuPaul": "Dance",
    "Salt 'N' Pepa": "Rap",
    "Sarah McLachlan": "Pop",
    "Savage Garden": "Pop",
    "Scarface (7)": "Rap",
    "Shakira": "Pop",
    "Shania Twain": "Country",
    "Shola Ama": "Pop", # R&B
    "Simone Jay": "Dance",
    "Simply Red": "Pop",
    "Sinclair": "Pop", # Funk
    "Sister Carol": "Pop", # Reggae
    "Snoop Dogg": "Rap",
    "Sophie B. Hawkins": "Pop",
    "Space": "Rock Alternativo",
    "Spagna": "Dance",
    "Spice Girls": "Pop",
    "Steps": "Pop",
    "Sting": "Pop",
    "SWV": "Pop", # R&B
    "Tamia (2)": "Pop", # R&B
    "Tha Truth!": "Rap",
    "Thalía": "Pop",
    "The Notorious B.I.G.": "Rap",
    "Tic Tac Toe (2)": "Pop", # Rap/Pop
    "Tina Arena": "Pop",
    "Toby Keith": "Country",
    "Toni Cottura": "Rap",
    "Trace Adkins": "Country",
    "Tracey Lee": "Rap",
    "Triple S": "Rap",
    "Trisha Yearwood": "Country",
    "Twista": "Rap",
    "Ultra Naté": "Dance",
    "Uncle Sam": "Pop", # R&B
    "Usher": "Pop", # R&B
    "Vanessa Williams": "Pop",
    "Vengaboys": "Dance",
    "Warren G": "Rap",
    "Will Smith": "Rap",
    "Wu-Tang Clan": "Rap",
    "Wyclef Jean": "Rap",
    "Zhané": "Pop", # R&B
}

def enrich_genres():
    input_path = 'data/1997.json'
    
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
