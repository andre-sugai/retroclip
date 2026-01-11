
import json
import os

# Define the genre mapping for 1998
ARTIST_GENRES = {
    # Rock Alternativo / Indie / Grunge / Post-Grunge
    "10,000 Maniacs": "Rock Alternativo",
    "Air": "Eletronico", # Downtempo
    "Alanis Morissette": "Rock Alternativo",
    "All": "Punk",
    "All Seeing I": "Eletronico",
    "Apocalyptica": "Metal", # Cello Metal
    "Ash": "Rock Alternativo",
    "Barenaked Ladies": "Rock Alternativo",
    "Barry Adamson": "Rock Alternativo",
    "Beastie Boys": "Rap", # Hip Hop
    "Beck": "Rock Alternativo",
    "Ben Folds Five": "Rock Alternativo",
    "Ben Lee": "Rock Alternativo",
    "Better Than Ezra": "Rock Alternativo",
    "Big Hate": "Rock Alternativo",
    "Big Wreck": "Rock Alternativo",
    "Billie Myers": "Rock Alternativo",
    "Björk": "Eletronico",
    "Black Eyed Peas": "Rap", # Hip Hop
    "Blink-182": "Punk", # Pop Punk
    "Bloodhound Gang": "Rock Alternativo",
    "Bluvertigo": "Rock Alternativo",
    "Bob Dylan": "Rock Alternativo",
    "Bond (4)": "Pop", # Classical Crossover
    "Brian Setzer Orchestra": "Pop", # Swing Revival
    "Buffalo Tom": "Rock Alternativo",
    "Cake": "Rock Alternativo",
    "Candlebox": "Rock Alternativo",
    "Carmen Consoli": "Rock Alternativo",
    "Cartoons": "Pop", # Novelty
    "Cat Power": "Rock Alternativo",
    "Catatonia": "Rock Alternativo",
    "Catherine Wheel": "Rock Alternativo",
    "Cherry Poppin' Daddies": "Pop", # Swing Revival
    "Chumbawamba": "Rock Alternativo",
    "Clutch (3)": "Rock Alternativo", # Stoner Rock
    "Cold": "Metal", # Nu Metal
    "Collective Soul": "Rock Alternativo",
    "Cool For August": "Rock Alternativo",
    "Cornershop": "Rock Alternativo",
    "Cowboy Junkies": "Rock Alternativo",
    "Curve (2)": "Rock Alternativo", # Shoegaze / Industrial-tinged
    "Das Motiv": "Rap",
    "Dave Matthews Band": "Rock Alternativo",
    "Days Of The New": "Rock Alternativo",
    "Deftones": "Metal",
    "Del Amitri": "Rock Alternativo",
    "Delakota": "Rock Alternativo",
    "Delta V": "Pop",
    "Depeche Mode": "Eletronico",
    "Die Ärzte": "Punk",
    "Dinosaur Jr.": "Rock Alternativo",
    "Drugstore": "Rock Alternativo",
    "Duncan Sheik": "Rock Alternativo",
    "Eagle-Eye Cherry": "Rock Alternativo",
    "Edwin McCain": "Rock Alternativo",
    "Eels": "Rock Alternativo",
    "Elliott Smith": "Rock Alternativo",
    "Embrace": "Rock Alternativo",
    "Entombed": "Metal",
    "Eric Clapton": "Pop", # Rock
    "Esthero": "Eletronico", # Trip Hop
    "Ether": "Rock Alternativo",
    "Eve 6": "Rock Alternativo",
    "Everclear": "Rock Alternativo",
    "Everlast": "Rock Alternativo", # Rap Rock
    "Everything": "Rock Alternativo",
    "Faith No More": "Rock Alternativo",
    "Fastball": "Rock Alternativo",
    "Fat Les": "Pop",
    "Filter": "Industrial",
    "Fiona Apple": "Rock Alternativo",
    "Fluxus": "Rock Alternativo",
    "Foo Fighters": "Rock Alternativo",
    "Fuel": "Rock Alternativo",
    "Fun Lovin' Criminals": "Rock Alternativo",
    "Furslide": "Rock Alternativo",
    "Futureal": "Eletronico",
    "G.C. Mania": "Rock Alternativo",
    "Garbage": "Rock Alternativo",
    "Genesis": "Rock Alternativo",
    "Ghastly Ones, The": "Rock Alternativo", # Surf Rock
    "Girls Against Boys": "Rock Alternativo",
    "Godsmack": "Metal", # Nu Metal
    "Gomez": "Rock Alternativo",
    "Goo Goo Dolls": "Rock Alternativo",
    "Graham Coxon": "Rock Alternativo",
    "Grandaddy": "Rock Alternativo",
    "Grant Lee Buffalo": "Rock Alternativo",
    "Green Day": "Punk",
    "Guano Apes": "Rock Alternativo", # Alt Metal
    "Hanson": "Pop",
    "Hardeman": "Rock Alternativo",
    "Harvey Danger": "Rock Alternativo",
    "Heather Nova": "Rock Alternativo",
    "Herbert Grönemeyer": "Rock Alternativo",
    "HIM": "Rock Alternativo", # Love Metal
    "Hole": "Rock Alternativo",
    "Hootie & The Blowfish": "Rock Alternativo",
    "Hooverphonic": "Eletronico", # Trip Hop
    "Ibens": "Rock Alternativo",
    "Idlewild": "Rock Alternativo",
    "Imogen Heap": "Rock Alternativo",
    "Interno 17": "Rap",
    "Iron Maiden": "Metal",
    "James": "Rock Alternativo",
    "Jars Of Clay": "Rock Alternativo",
    "Jay-Jay Johanson": "Eletronico",
    "JBO": "Metal",
    "Jebediah": "Rock Alternativo",
    "Jeff Buckley": "Rock Alternativo",
    "Jimmy Page & Robert Plant": "Rock Alternativo",
    "Joachim Witt": "Eletronico", # NDH
    "John Mellencamp": "Rock Alternativo",
    "Jonny Lang": "Rock Alternativo",
    "K's Choice": "Rock Alternativo",
    "Kent": "Rock Alternativo",
    "Kiss": "Metal",
    "Koala (2)": "Pop",
    "Korn": "Metal",
    "Lenny Kravitz": "Rock Alternativo",
    "Lex & Klatten": "Rap",
    "Ligabue": "Rock Alternativo",
    "Lighthouse Family": "Pop",
    "Limp Bizkit": "Metal",
    "Linea 77": "Metal", # Nu Metal
    "Liquido": "Rock Alternativo",
    "Litfiba": "Rock Alternativo",
    "Liz Phair": "Rock Alternativo",
    "Local H": "Rock Alternativo",
    "Lodger (2)": "Rock Alternativo",
    "Los Amigos Invisibles": "Pop", # Acid Jazz / Funk
    "Luca Carboni": "Pop",
    "Malice Mizer": "Rock Alternativo", # Visual Kei
    "Manic Street Preachers": "Rock Alternativo",
    "Mansun": "Rock Alternativo",
    "Marc Cohn": "Pop",
    "Marcy Playground": "Rock Alternativo",
    "Marilyn Manson": "Industrial",
    "Marius Müller-Westernhagen": "Rock Alternativo",
    "Matchbox Twenty": "Rock Alternativo",
    "Matt Cox": "Rock Alternativo",
    "Matthew Marsden": "Pop",
    "Mecano": "Pop",
    "Megadeth": "Metal",
    "Meredith Brooks": "Rock Alternativo",
    "Metallica": "Metal",
    "Mietta": "Pop",
    "Modern Talking": "Pop",
    "Mojave 3": "Rock Alternativo",
    "Monster Magnet": "Rock Alternativo", # Stoner
    "Moonspell": "Metal",
    "Morcheeba": "Eletronico",
    "Mötley Crüe": "Metal",
    "Myslovitz": "Rock Alternativo",
    "Natalie Merchant": "Rock Alternativo",
    "Neil Finn": "Rock Alternativo",
    "New Radicals": "Rock Alternativo",
    "Nightwish": "Metal",
    "Oasis": "Rock Alternativo",
    "Ocean Colour Scene": "Rock Alternativo",
    "Opera IX": "Metal",
    "Orgy": "Industrial", # Synth Rock / Industrial
    "Our Lady Peace": "Rock Alternativo",
    "Paul Weller": "Rock Alternativo",
    "Pearl Jam": "Rock Alternativo",
    "PJ Harvey": "Rock Alternativo",
    "Placebo": "Rock Alternativo",
    "Pocket Size": "Rock Alternativo",
    "Portishead": "Eletronico",
    "Prairie Oyster": "Country",
    "Pressure Drop": "Eletronico",
    "Pulp": "Rock Alternativo",
    "Queen": "Pop", # Rock
    "R.E.M.": "Rock Alternativo",
    "Rage Against The Machine": "Rock Alternativo",
    "Rammstein": "Industrial",
    "Rancid": "Punk",
    "Rascalz": "Rap",
    "Richie Sambora": "Rock Alternativo",
    "Ridillo": "Pop",
    "Roachford": "Pop",
    "Rob Zombie": "Industrial",
    "Rod Stewart": "Pop",
    "Rufus Wainwright": "Pop",
    "Scorpions": "Metal",
    "Scrawl": "Rock Alternativo",
    "Sean Lennon": "Rock Alternativo",
    "Semisonic": "Rock Alternativo",
    "Sheryl Crow": "Rock Alternativo",
    "Silmarils": "Rock Alternativo",
    "Simple Minds": "Rock Alternativo",
    "Sixpence None The Richer": "Pop",
    "Smash Mouth": "Rock Alternativo",
    "Sneaker Pimps": "Eletronico",
    "Soerba": "Rock Alternativo",
    "Solveig Sandnes": "Pop",
    "Sonic Youth": "Rock Alternativo",
    "Soul Asylum": "Rock Alternativo",
    "Soul Coughing": "Rock Alternativo",
    "Space": "Rock Alternativo",
    "Sparklehorse": "Rock Alternativo",
    "Spiritualized": "Rock Alternativo",
    "Stabbing Westward": "Industrial",
    "Stereophonics": "Rock Alternativo",
    "Sting": "Pop",
    "Sublime": "Rock Alternativo",
    "Subsonica": "Rock Alternativo",
    "Suede": "Rock Alternativo",
    "Sugar Ray": "Rock Alternativo",
    "Super Furry Animals": "Rock Alternativo",
    "Suzanne Vega": "Rock Alternativo",
    "System Of A Down": "Metal",
    "T'ee": "Pop",
    "Tanita Tikaram": "Pop",
    "Tank": "Metal",
    "Terrorvision": "Rock Alternativo",
    "Texas": "Pop",
    "The Afghan Whigs": "Rock Alternativo",
    "The B-52's": "Pop",
    "The Black Crowes": "Rock Alternativo",
    "The Bluetones": "Rock Alternativo",
    "The Cardigans": "Rock Alternativo",
    "The Corrs": "Pop",
    "The Dandy Warhols": "Rock Alternativo",
    "The Dillinger Escape Plan": "Hardcore", # Mathcore
    "The Dingees": "Punk", # Ska Punk
    "The Flys": "Rock Alternativo",
    "The Getaway People": "Rock Alternativo",
    "The Jesus And Mary Chain": "Rock Alternativo",
    "The Jon Spencer Blues Explosion": "Rock Alternativo",
    "The Levellers": "Rock Alternativo",
    "The Mavericks": "Country",
    "The Mighty Mighty Bosstones": "Rock Alternativo", # Ska Punk
    "The Moffatts": "Pop",
    "The Offspring": "Punk",
    "The Presidents Of The United States Of America": "Rock Alternativo",
    "The Republic": "Rock Alternativo",
    "The Rolling Stones": "Rock Alternativo",
    "The Smashing Pumpkins": "Rock Alternativo",
    "The Tragically Hip": "Rock Alternativo",
    "The Verve": "Rock Alternativo",
    "The Young Dubliners": "Rock Alternativo",
    "Third Eye Blind": "Rock Alternativo",
    "Thomas D.": "Rap",
    "Tonic (2)": "Rock Alternativo",
    "Tori Amos": "Rock Alternativo",
    "Two-Mix": "Pop", # J-Pop
    "U-Phonic": "Eletronico",
    "U2": "Rock Alternativo",
    "UB40": "Pop",
    "Ultrasound": "Rock Alternativo",
    "Unwritten Law": "Punk",
    "Utada Hikaru": "Pop",
    "VAST": "Rock Alternativo", # Industrial/Alt
    "Vega": "Rock Alternativo",
    "Versus (2)": "Rock Alternativo",
    "Vitro": "Eletronico",
    "Volumia!": "Pop",
    "Voodoo Glow Skulls": "Punk",
    "Wank": "Punk",
    "Wild Strawberries": "Pop",
    "Willie Nelson": "Country",
    "Yann Tiersen": "Pop", # Instrumental
    "Yellowride": "Rock Alternativo",
    "Zebrahead": "Punk", # Rap Punk

    # Pop / R&B / Mainstream
    "*NSYNC": "Pop",
    "2 Brothers On The 4th Floor": "Dance",
    "2 Unlimited": "Dance",
    "98 Degrees": "Pop",
    "Aaliyah": "Pop", # R&B
    "Ace of Base": "Pop",
    "Alejandro Fernández": "Pop", # Latin
    "Alexia": "Dance",
    "Ambra Angiolini": "Pop",
    "Anne Dorte Michelsen": "Pop",
    "Aqua": "Pop",
    "Ayla": "Dance",
    "B*Witched": "Pop",
    "Babyface": "Pop", # R&B
    "Backstreet Boys": "Pop",
    "Bacon Popper": "Dance",
    "Bananarama": "Pop",
    "Bee Gees": "Pop",
    "Bette Midler": "Pop",
    "Beverley Knight": "Pop", # R&B
    "Billie Piper": "Pop",
    "Blümchen": "Dance",
    "Boyz II Men": "Pop", # R&B
    "Boyzone": "Pop",
    "Brandy": "Pop", # R&B
    "Brian McKnight": "Pop", # R&B
    "Britney Spears": "Pop",
    "Brooklyn Bounce": "Dance",
    "Brooks & Dunn": "Country",
    "Bryan Adams": "Pop",
    "Carmen Electra": "Pop",
    "Céline Dion": "Pop",
    "Central Seven": "Dance",
    "Charlie Lownoise & Mental Theo": "Dance",
    "Chayanne": "Pop",
    "Cher": "Pop",
    "Christina Aguilera": "Pop",
    "Cleopatra": "Pop",
    "Cliff Richard": "Pop",
    "Coco": "Pop", # R&B
    "Collin Raye": "Country",
    "Color Me Badd": "Pop", # R&B
    "Corey Hart": "Pop",
    "Corona": "Dance",
    "Culture Beat": "Dance",
    "Culture Club": "Pop",
    "Daft Punk": "Eletronico",
    "Deep Dish": "Eletronico",
    "Deborah Cox": "Pop", # R&B
    "Des'ree": "Pop",
    "Destiny's Child": "Pop", # R&B
    "Dixie Chicks": "Country",
    "DJ Sakin": "Dance",
    "DJ Sammy": "Dance",
    "DJ Tonka": "Dance",
    "DJ Visage": "Dance",
    "Dr. Alban": "Dance",
    "Dr. Bombay": "Dance",
    "Dru Hill": "Pop", # R&B
    "Dwight Yoakam": "Country",
    "Dynamic (3)": "Dance",
    "Edyta Górniak": "Pop",
    "Elisa": "Pop",
    "Elton John": "Pop",
    "Elvis Crespo": "Pop", # Latin
    "Enrique Iglesias": "Pop",
    "Faith Hill": "Country",
    "Faithless": "Eletronico",
    "Falco": "Pop",
    "Fatboy Slim": "Eletronico",
    "Five": "Pop",
    "Gary Allan (2)": "Country",
    "Gary Barlow": "Pop",
    "George Michael": "Pop",
    "Gianna Nannini": "Pop",
    "Ginuwine": "Pop", # R&B
    "Gloria Estefan": "Pop",
    "Harry Connick, Jr.": "Pop",
    "Hubert Kah": "Pop",
    "Imajin": "Pop", # R&B
    "Jagged Edge": "Pop", # R&B
    "Jamiroquai": "Pop", # Funk
    "Janet Jackson": "Pop", # R&B
    "Jennifer Paige": "Pop",
    "Jewel": "Pop",
    "Jo Dee Messina": "Country",
    "Joe Diffie": "Country",
    "Joée": "Pop",
    "Josh Wink": "Eletronico",
    "Kai Tracid": "Eletronico",
    "Kari Rueslåtten": "Pop",
    "Keith Sweat": "Pop", # R&B
    "Kenny Chesney": "Country",
    "Kirk Franklin": "Pop", # Gospel
    "Kosmonova": "Dance",
    "Kylie Minogue": "Pop",
    "La Cream": "Dance",
    "Laura Pausini": "Pop",
    "LeAnn Rimes": "Country",
    "Lee Ann Womack": "Country",
    "Lionel Richie": "Pop",
    "Lo Fidelity Allstars": "Eletronico",
    "Loona": "Dance",
    "Louise": "Pop",
    "M People": "Dance",
    "Madonna": "Pop",
    "Mariah Carey": "Pop", # R&B
    "Mark van Dale": "Dance",
    "Mark Wills": "Country",
    "Marta Sánchez": "Pop",
    "Mary Lou Ford": "Pop",
    "Maxwell": "Pop", # R&B
    "Merril Bainbridge": "Pop",
    "Miss Jane": "Dance",
    "Miss Papaya": "Dance",
    "Moby": "Eletronico",
    "Modern Talking": "Pop",
    "Moloko": "Eletronico",
    "Monica": "Pop", # R&B
    "Montell Jordan": "Pop", # R&B
    "Mr. Oizo": "Eletronico",
    "Mya": "Pop", # R&B
    "N.Y.C.C.": "Dance",
    "N'Dea Davenport": "Pop", # R&B
    "Nana": "Rap", # Euro-Rap
    "Natalia Oreiro": "Pop",
    "Natalie Imbruglia": "Pop",
    "Neja": "Dance",
    "Next": "Pop", # R&B
    "Olivia Newton-John": "Pop",
    "Paffendorf": "Dance",
    "Paola & Chiara": "Pop",
    "Paradisio": "Dance",
    "Phil Collins": "Pop",
    "Piddlers": "Pop",
    "Plastik (2)": "Dance",
    "Prince": "Pop",
    "R. Kelly": "Pop", # R&B
    "Rah Sun": "Rap",
    "Reba McEntire": "Country",
    "Regina": "Dance",
    "René Froger": "Pop",
    "Ricky Martin": "Pop",
    "Robbie Williams": "Pop",
    "Roni Size": "Eletronico", # Drum and Bass
    "Sammy Kershaw": "Country",
    "Sara Evans": "Country",
    "Sarah McLachlan": "Pop",
    "Sash!": "Dance",
    "Savage Garden": "Pop",
    "Scooter": "Dance",
    "Seal": "Pop",
    "Sequential One": "Dance",
    "Seven Eleven (2)": "Pop", # Funk
    "Shakira": "Pop",
    "Shania Twain": "Country",
    "Shawn Mullins": "Rock Alternativo", # Folk Rock
    "Simply Red": "Pop",
    "Smile.dk": "Dance",
    "Solo": "Pop", # R&B
    "Sparkle": "Pop", # R&B
    "Spice Girls": "Pop",
    "Spike": "Pop",
    "Squarepusher": "Eletronico",
    "Stardust": "Dance",
    "Steps": "Pop",
    "Tamia (2)": "Pop", # R&B
    "Taylor Dayne": "Pop",
    "Terri Clark": "Country",
    "Tevin Campbell": "Pop", # R&B
    "Thalía": "Pop",
    "The Crystal Method": "Eletronico",
    "The Moffatts": "Pop",
    "The Tamperer": "Dance",
    "The Wiseguys": "Eletronico",
    "Thievery Corporation": "Eletronico",
    "Tina Arena": "Pop",
    "Toby Keith": "Country",
    "Toni Cottura": "Rap",
    "Total": "Pop", # R&B
    "Toy-Box": "Dance",
    "Tracy Byrd": "Country",
    "Trisha Yearwood": "Country",
    "Tyrese": "Pop", # R&B
    "Ultra Naté": "Dance",
    "UNKLE": "Eletronico",
    "Van Bellen": "Dance",
    "Vengaboys": "Dance",
    "Vince Gill": "Country",
    "Voices In Motion": "Pop",
    "Wes": "Dance",
    "Whigfield": "Dance",
    "Whitney Houston": "Pop", # R&B
    "Will Smith": "Rap",
    "Wyclef Jean": "Rap",
    "Yo-Yo": "Rap",

    # Rap / Hip Hop
    "2Pac": "Rap",
    "99 Posse": "Rap",
    "A Tribe Called Quest": "Rap",
    "Big Punisher": "Rap",
    "Big Tymers": "Rap",
    "Bomfunk MC's": "Eletronico", # Breakbeat
    "Bone Thugs-N-Harmony": "Rap",
    "Busta Rhymes": "Rap",
    "C-Block": "Rap",
    "Cam’ron": "Rap",
    "Charli Baltimore": "Rap",
    "Cypress Hill": "Rap",
    "Def Squad": "Rap",
    "DJ Quik": "Rap",
    "DMX": "Rap",
    "Doggy T": "Rap",
    "Down Low": "Rap",
    "Fat Cat Kareem": "Rap",
    "Ferris": "Rap",
    "Flip Da Scrip": "Rap",
    "Flipmode Squad": "Rap",
    "Foxy Brown": "Rap",
    "Ghetto Concept": "Rap",
    "Goodie Mob": "Rap",
    "Ice Cube": "Rap",
    "Insane Clown Posse": "Rap",
    "Jay Z": "Rap",
    "Jermaine Dupri": "Rap",
    "Juvenile": "Rap",
    "Kurupt": "Rap",
    "Le 3ème Œil": "Rap",
    "Lord Have Mercy": "Rap",
    "Ma$e": "Rap",
    "Master P": "Rap",
    "Method Man": "Rap",
    "Missy Elliott": "Rap",
    "Mocrac": "Rap",
    "Mystikal": "Rap",
    "Noreaga": "Rap",
    "Onyx": "Rap",
    "OutKast": "Rap",
    "Public Enemy": "Rap",
    "Puff Daddy": "Rap",
    "Queen Latifah": "Rap",
    "Rap Allstars": "Rap",
    "Rappers Against Racism": "Rap",
    "Redman": "Rap",
    "Salt 'N' Pepa": "Rap",
    "Silkk The Shocker": "Rap",
    "Snoop Dogg": "Rap",
    "Sunz Of Man": "Rap",
    "Timbaland": "Rap",
    "Too Short": "Rap",
    "Xzibit": "Rap",
    "Yah Supreme": "Rap",
}

def enrich_genres():
    input_path = 'data/1998.json'
    
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
