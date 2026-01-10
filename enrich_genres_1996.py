
import json
import os

# Define the genre mapping for 1996
ARTIST_GENRES = {
    # Rock Alternativo / Indie / Grunge / Post-Grunge
    "10,000 Maniacs": "Rock Alternativo",
    "12 Rounds": "Rock Alternativo",
    "16 Horsepower": "Rock Alternativo",
    "311": "Rock Alternativo",
    "60ft Dolls": "Rock Alternativo",
    "7 Year Bitch": "Rock Alternativo",
    "AFI": "Punk", # Early stuff was hardcore punk
    "Amorphis": "Metal",
    "Apollo 440": "Eletronico",
    "Arch Enemy": "Metal",
    "Ash": "Rock Alternativo",
    "Autechre": "Eletronico",
    "Babylon Zoo": "Rock Alternativo",
    "Bad Religion": "Punk",
    "Beck": "Rock Alternativo",
    "Ben Folds Five": "Rock Alternativo", # Piano Rock
    "Ben Harper": "Rock Alternativo", # Folk Rock
    "Better Than Ezra": "Rock Alternativo",
    "Bic Runga": "Rock Alternativo", # Pop/Rock
    "Björk": "Eletronico", # Art Pop
    "Blind Melon": "Rock Alternativo",
    "Bloodhound Gang": "Rock Alternativo", # Alt Hip Hop/Rock
    "Blue Rodeo": "Rock Alternativo", # Country Rock
    "Blues Traveler": "Rock Alternativo", # Jam Band
    "Blur": "Rock Alternativo", # Britpop
    "Bluvertigo": "Rock Alternativo",
    "Bush": "Rock Alternativo", # Grunge
    "Butthole Surfers": "Rock Alternativo",
    "Cake": "Rock Alternativo",
    "Catherine": "Rock Alternativo",
    "Cecil (7)": "Rock Alternativo",
    "Chantal Kreviazuk": "Rock Alternativo", # Pop/Rock
    "Chris Whitley": "Rock Alternativo",
    "Cibo Matto": "Rock Alternativo",
    "Counting Crows": "Rock Alternativo",
    "Cowboy Junkies": "Rock Alternativo",
    "Cracker": "Rock Alternativo",
    "Crash Test Dummies": "Rock Alternativo",
    "Dave Matthews Band": "Rock Alternativo",
    "David Bowie": "Rock Alternativo", # Art Rock
    "Deep Blue Something": "Rock Alternativo",
    "Deftones": "Metal", # Alt Metal
    "Dishwalla": "Rock Alternativo",
    "Duncan Sheik": "Rock Alternativo",
    "Eels": "Rock Alternativo",
    "Einstürzende Neubauten": "Rock Alternativo", # Industrial
    "Ether": "Rock Alternativo",
    "Everclear": "Rock Alternativo",
    "Face To Face": "Punk",
    "Failure": "Rock Alternativo",
    "Faith No More": "Rock Alternativo",
    "Feeder": "Rock Alternativo",
    "Filter": "Rock Alternativo", # Industrial Rock
    "Fiona Apple": "Rock Alternativo", # Art Pop
    "Fish": "Rock Alternativo", # Prog
    "Fun Lovin' Criminals": "Rock Alternativo",
    "Garbage": "Rock Alternativo",
    "Geggy Tah": "Rock Alternativo",
    "Gin Blossoms": "Rock Alternativo",
    "Girls Against Boys": "Rock Alternativo",
    "Goya Dress": "Rock Alternativo",
    "Green Day": "Punk",
    "HIM": "Rock Alternativo", # Love Metal
    "Hole": "Rock Alternativo",
    "Hootie & The Blowfish": "Rock Alternativo", # Pop Rock
    "Hooverphonic": "Eletronico", # Trip Hop
    "Hum": "Rock Alternativo",
    "Iggy Pop": "Rock Alternativo",
    "Incubus": "Rock Alternativo", # Nu Metal later
    "Indochine": "Rock Alternativo",
    "Jale": "Rock Alternativo",
    "Jane Jensen": "Rock Alternativo",
    "Jars Of Clay": "Rock Alternativo",
    "Jebediah": "Rock Alternativo",
    "Jeff Buckley": "Rock Alternativo",
    "Jewel": "Pop", # Folk Pop
    "Joan Osborne": "Rock Alternativo",
    "John Hiatt": "Rock Alternativo",
    "John Mellencamp": "Rock Alternativo",
    "Journey": "Rock Alternativo", # Classic Rock
    "Joy Electric": "Eletronico",
    "K's Choice": "Rock Alternativo",
    "Kent": "Rock Alternativo",
    "Korn": "Metal", # Nu Metal
    "Kula Shaker": "Rock Alternativo", # Britpop
    "Les Valentins": "Rock Alternativo",
    "Local H": "Rock Alternativo",
    "Lois": "Rock Alternativo",
    "Low": "Rock Alternativo", # Slowcore
    "Luscious Jackson": "Rock Alternativo",
    "Lush": "Rock Alternativo", # Shoegaze/Britpop
    "Manic Street Preachers": "Rock Alternativo",
    "Mansun": "Rock Alternativo",
    "Marilyn Manson": "Metal", # Industrial Metal
    "Matchbox Twenty": "Rock Alternativo",
    "Mazzy Star": "Rock Alternativo",
    "Melissa Etheridge": "Rock Alternativo",
    "Menswear": "Rock Alternativo",
    "Metallica": "Metal",
    "Midnight Oil": "Rock Alternativo",
    "Moloko": "Eletronico",
    "Mona Lisa (13)": "Rock Alternativo",
    "Moonspell": "Metal",
    "Morcheeba": "Eletronico", # Trip Hop
    "Motörhead": "Metal",
    "Mundy": "Rock Alternativo",
    "Myslovitz": "Rock Alternativo",
    "Naimee Coleman": "Rock Alternativo",
    "Negrita": "Rock Alternativo",
    "Neneh Cherry": "Pop",
    "No Doubt": "Rock Alternativo", # Ska Punk / Pop
    "Oasis": "Rock Alternativo", # Britpop
    "Ocean Colour Scene": "Rock Alternativo",
    "Octopus (9)": "Rock Alternativo",
    "Orbital": "Eletronico",
    "Pantera": "Metal",
    "Pato Banton": "Pop", # Reggae
    "Patty Griffin": "Rock Alternativo", # Folk
    "Pavement": "Rock Alternativo",
    "Pearl (7)": "Rock Alternativo",
    "Pearl Jam": "Rock Alternativo",
    "PJ Harvey": "Rock Alternativo",
    "Placebo": "Rock Alternativo",
    "Planet Claire": "Rock Alternativo",
    "Plankeye": "Rock Alternativo",
    "Poe": "Rock Alternativo",
    "Pond": "Rock Alternativo",
    "Porno For Pyros": "Rock Alternativo",
    "Primitive Radio Gods": "Rock Alternativo",
    "Prong": "Metal",
    "Pulp": "Rock Alternativo", # Britpop
    "Pure": "Rock Alternativo",
    "Quarashi": "Rock Alternativo",
    "Radiohead": "Rock Alternativo",
    "Rage Against The Machine": "Rock Alternativo", # Rap Metal
    "Rammstein": "Metal", # Industrial
    "Red Hot Chili Peppers": "Rock Alternativo",
    "Red House Painters": "Rock Alternativo",
    "Reef": "Rock Alternativo",
    "Republica": "Rock Alternativo",
    "Robert Forster": "Rock Alternativo",
    "Roger Chapman": "Rock Alternativo",
    "Rush": "Rock Alternativo", # Prog
    "Schtum": "Rock Alternativo",
    "Screaming Trees": "Rock Alternativo",
    "Semisonic": "Rock Alternativo",
    "Sepultura": "Metal",
    "Shakespear's Sister": "Rock Alternativo",
    "Shed Seven": "Rock Alternativo",
    "Sheryl Crow": "Rock Alternativo",
    "Silkworm": "Rock Alternativo",
    "Silverchair": "Rock Alternativo", # Grunge
    "Skunk Anansie": "Rock Alternativo",
    "Slam (2)": "Eletronico",
    "Slayer": "Metal",
    "Sleeper (2)": "Rock Alternativo",
    "Sleeper": "Rock Alternativo",
    "Smashing Pumpkins": "Rock Alternativo",
    "Sneaker Pimps": "Eletronico", # Trip Hop
    "Social Distortion": "Punk",
    "Soon (6)": "Rock Alternativo",
    "Soul Coughing": "Rock Alternativo",
    "Souls": "Rock Alternativo",
    "Soundgarden": "Rock Alternativo",
    "Space": "Rock Alternativo",
    "Spin Doctors": "Rock Alternativo",
    "Sponge (3)": "Rock Alternativo",
    "Stabbing Westward": "Rock Alternativo", # Industrial
    "Stigmata A Go Go": "Rock Alternativo",
    "Stone Temple Pilots": "Rock Alternativo",
    "Strangelove": "Rock Alternativo",
    "Sublime": "Rock Alternativo", # Ska Punk
    "Suede": "Rock Alternativo",
    "Super Furry Animals": "Rock Alternativo",
    "Superdrag": "Rock Alternativo",
    "Supergrass": "Rock Alternativo",
    "Suzanne Vega": "Rock Alternativo",
    "Sweetback": "Rock Alternativo",
    "Tears For Fears": "Rock Alternativo",
    "Terrorvision": "Rock Alternativo",
    "The Afghan Whigs": "Rock Alternativo",
    "The Auteurs": "Rock Alternativo",
    "The Black Crowes": "Rock Alternativo",
    "The Bluetones": "Rock Alternativo",
    "The Bogmen": "Rock Alternativo",
    "The Borrowers": "Rock Alternativo",
    "The Cardigans": "Rock Alternativo",
    "The Chemical Brothers": "Eletronico",
    "The Connells": "Rock Alternativo",
    "The Corrs": "Pop", # Folk Pop
    "The Cranberries": "Rock Alternativo",
    "The Cure": "Rock Alternativo",
    "The D-Generation": "Rock Alternativo",
    "The Divine Comedy": "Rock Alternativo",
    "The Flaming Lips": "Rock Alternativo",
    "The Foremen": "Rock Alternativo",
    "The Goops": "Rock Alternativo",
    "The Kelly Family": "Pop",
    "The Lemonheads": "Rock Alternativo",
    "The Lightning Seeds": "Rock Alternativo",
    "The Mystics": "Rock Alternativo",
    "The Presidents Of The United States Of America": "Rock Alternativo",
    "The Prodigy": "Eletronico",
    "The Raincoats": "Rock Alternativo",
    "The Refreshments": "Rock Alternativo",
    "The Roots": "Rap",
    "The Shamen": "Eletronico",
    "The Smashing Pumpkins": "Rock Alternativo",
    "The Tragically Hip": "Rock Alternativo",
    "The Verve Pipe": "Rock Alternativo",
    "The Wallflowers": "Rock Alternativo",
    "Throwing Muses": "Rock Alternativo",
    "Tool": "Metal",
    "Tori Amos": "Rock Alternativo",
    "Tracy Bonham": "Rock Alternativo",
    "Type O Negative": "Metal",
    "Velvet Belly": "Rock Alternativo",
    "Voice": "Rock Alternativo",
    "Weezer": "Rock Alternativo",
    "Weird Al Yankovic": "Pop", # Parody
    "White Zombie": "Metal",
    "Wild Colonials": "Rock Alternativo",
    "ZZ Top": "Rock Alternativo", # Classic Rock

    # Pop / R&B / Mainstream
    "*NSYNC": "Pop",
    "2 Brothers On The 4th Floor": "Dance",
    "2 Unlimited": "Dance",
    "Aaliyah": "Pop", # R&B
    "Aaron (2)": "Pop",
    "Ace of Base": "Pop",
    "Adam Ant": "Pop",
    "Alexia": "Dance",
    "All-4-One": "Pop", # R&B
    "Amber": "Dance",
    "Amy Grant": "Pop",
    "Anahí": "Pop",
    "Anna": "Pop",
    "Aqua": "Pop",
    "Arthur H": "Pop",
    "Az Yet": "Pop", # R&B
    "Babyface": "Pop", # R&B
    "Backstreet Boys": "Pop",
    "Bananarama": "Pop",
    "Barabba": "Pop",
    "Belinda Carlisle": "Pop",
    "Black Box": "Dance",
    "Blackstreet": "Pop", # R&B
    "Blaxone": "Pop",
    "Blümchen": "Dance",
    "Bodylotion": "Dance", # Gabber?
    "Bon Jovi": "Rock Alternativo", # Hard Rock / Pop
    "Bonnie Tyler": "Pop",
    "Boyzone": "Pop",
    "Brooklyn Bounce": "Dance",
    "Bruce Dickinson (2)": "Metal",
    "Bryan Adams": "Pop", # Rock
    "C-Block": "Rap",
    "Cæcilie Norby": "Pop", # Jazz
    "Candy Boy": "Pop",
    "Captain Jack": "Dance",
    "Cascada": "Dance",
    "Case": "Pop", # R&B
    "Casino Royale (2)": "Pop",
    "CeCe Peniston": "Dance",
    "Céline Dion": "Pop",
    "Central Seven": "Dance",
    "Charlie Lownoise & Mental Theo": "Dance",
    "Chayanne": "Pop",
    "Cher": "Pop",
    "Cliff Richard": "Pop",
    "Corey Hart": "Pop",
    "Culture Beat": "Dance",
    "Cyndi Lauper": "Pop",
    "D’Angelo": "Pop", # R&B/Neo Soul
    "Daisy Dee": "Dance",
    "Das Modul": "Dance",
    "Deborah Cox": "Pop", # R&B
    "Def Leppard": "Metal", # Rock
    "Deja Gruv": "Pop",
    "Die Prinzen": "Pop",
    "Die Toten Hosen": "Punk",
    "DJ Sammy": "Dance",
    "DJ Scot Project": "Dance",
    "Donell Jones": "Pop", # R&B
    "Donna Lewis": "Pop",
    "Down Low": "Rap",
    "Drill": "Rock Alternativo",
    "Dru Hill": "Pop", # R&B
    "Dune (4)": "Dance",
    "E-Rotic": "Dance",
    "Elton John": "Pop",
    "Enigma": "Eletronico",
    "Enrique Iglesias": "Pop",
    "Enya": "Pop", # New Age
    "Erasure": "Eletronico",
    "Eternal": "Pop", # R&B
    "Etienne Daho": "Pop",
    "Everything But The Girl": "Pop", # Electronic
    "Faith Hill": "Country",
    "Faithless": "Eletronico",
    "Falco": "Pop",
    "Fetish 69": "Rock Alternativo",
    "Flip Da Scrip": "Rap",
    "Florent Pagny": "Pop",
    "Fun Factory": "Dance",
    "Future Breeze": "Dance",
    "Gary Allan (2)": "Country",
    "Gary Barlow": "Pop",
    "George Clinton": "Pop", # Funk
    "George Michael": "Pop",
    "Ghost Town DJ's": "Rap", # Miami Bass
    "Gigi D'Agostino": "Dance",
    "Gina G": "Dance",
    "Ginuwine": "Pop", # R&B
    "Gloria Estefan": "Pop",
    "Goodfellaz": "Pop", # R&B
    "Gotthard": "Rock Alternativo",
    "Harry Connick, Jr.": "Pop",
    "Howard New": "Pop",
    "Hubert Kah": "Pop",
    "Ingrid Schroeder": "Pop",
    "Jamiroquai": "Pop", # Funk/Acid Jazz
    "Janet Jackson": "Pop", # R&B
    "Jean-Louis Murat": "Pop",
    "Johnny Gill": "Pop", # R&B
    "K-Ci & JoJo": "Pop", # R&B
    "Kaliber 44": "Rap",
    "Kaliphz": "Rap",
    "Kaycee Grogan": "Pop",
    "Ké": "Pop",
    "Keb' Mo'": "Pop", # Blues
    "Keith Sweat": "Pop", # R&B
    "Ken Ishii": "Eletronico",
    "Kenny Loggins": "Pop",
    "Khaled": "Pop", # World
    "Kris Kross": "Rap",
    "La Bouche": "Dance",
    "Ladae": "Pop", # R&B
    "Laura Pausini": "Pop",
    "LeAnn Rimes": "Country",
    "Leila K": "Dance",
    "Lionel Richie": "Pop",
    "Lipstick": "Pop",
    "London Posse": "Rap",
    "Los Ángeles Azules": "Pop", # Cumbia
    "Los del Rio": "Pop",
    "Los Tigres Del Norte": "Country",
    "Louise": "Pop",
    "Love Message": "Dance",
    "Luciano Pavarotti": "Pop", # Opera
    "LV": "Rap",
    "Madonna": "Pop",
    "Majbritte Ulrikkeholm": "Pop",
    "Marco Antonio Solís": "Pop",
    "Mariah Carey": "Pop", # R&B
    "Mark Morrison": "Pop", # R&B
    "Marta Sánchez": "Pop",
    "Mary J. Blige": "Pop", # R&B
    "Masterboy": "Dance",
    "Maxwell": "Pop", # Neo Soul
    "Meja": "Pop",
    "Merril Bainbridge": "Pop",
    "Michael Bolton": "Pop",
    "Michael Franti": "Rap",
    "Michael Jackson": "Pop",
    "Michael Learns To Rock": "Pop",
    "Midge Ure": "Pop",
    "Mint Condition": "Pop", # R&B
    "Moby": "Eletronico",
    "Monica": "Pop", # R&B
    "Montell Jordan": "Pop", # R&B
    "Mr. Big": "Rock Alternativo",
    "Music Instructor": "Dance",
    "Nakatomi": "Dance",
    "New Edition": "Pop", # R&B
    "No Mercy": "Pop",
    "Nylon Moon": "Dance",
    "OMC": "Pop",
    "Ondina": "Dance",
    "Paradisio": "Dance",
    "Paul Carrack": "Pop",
    "Paula Cole": "Pop",
    "Paulina Rubio": "Pop",
    "Peter Cetera": "Pop",
    "Phil Collins": "Pop",
    "Prince": "Pop",
    "Queen": "Pop", # Rock
    "R. Kelly": "Pop", # R&B
    "Ram-Z": "Rap",
    "Real 2 Real": "Dance",
    "Ricky Martin": "Pop",
    "RMB": "Dance",
    "Robbie Williams": "Pop",
    "Robert Miles": "Dance", # Trance
    "Rod Stewart": "Pop",
    "Roxette": "Pop",
    "RuPaul": "Dance",
    "Savage Garden": "Pop", # Pop Rock
    "Scatman John": "Pop",
    "Scooter": "Dance",
    "Seal": "Pop",
    "Seiko Matsuda": "Pop",
    "Selena": "Pop",
    "Shakira": "Pop",
    "Shaquille O'Neal": "Rap",
    "Shawn Colvin": "Rock Alternativo", # Folk
    "Simply Red": "Pop",
    "Sin With Sebastian": "Pop",
    "Snap!": "Dance",
    "Space Master": "Dance",
    "Spagna": "Dance",
    "Spice Girls": "Pop",
    "Squeezer": "Dance",
    "Sting": "Pop",
    "Swing Out Sister": "Pop",
    "Take That": "Pop",
    "Tekno Mafia": "Dance",
    "Thalía": "Pop",
    "The Braids": "Pop",
    "The Bucketheads": "Dance",
    "The Isley Brothers": "Pop", # R&B
    "Tina Arena": "Pop",
    "Tina Turner": "Pop",
    "Toni Braxton": "Pop", # R&B
    "Tonic (2)": "Rock Alternativo",
    "Tony! Toni! Toné!": "Pop", # R&B
    "Toshinobu Kubota": "Pop",
    "Total": "Pop", # R&B
    "Tracy Byrd": "Country",
    "Vanessa Williams": "Pop",
    "Vince Gill": "Country",
    "Wet Wet Wet": "Pop",
    "Whitney Houston": "Pop", # R&B
    "Xenia": "Pop",

    # Rap / Hip Hop
    "2Pac": "Rap",
    "A Tribe Called Quest": "Rap",
    "Afrika Islam": "Rap",
    "Akhenaton": "Rap",
    "AZ": "Rap",
    "Bone Thugs-N-Harmony": "Rap",
    "Busta Rhymes": "Rap",
    "Coolio": "Rap",
    "Cypress Hill": "Rap",
    "Da Brat": "Rap",
    "De La Soul": "Rap",
    "Digital Underground": "Rap",
    "Dr. Dre": "Rap",
    "E-40 & Too Short": "Rap",
    "Fugees": "Rap",
    "Ghetto Concept": "Rap",
    "Ghostface Killah": "Rap",
    "Goodie Mob": "Rap",
    "Group Therapy": "Rap", # Rap group
    "Ice Cube": "Rap",
    "Jay Z": "Rap",
    "Keith Murray": "Rap",
    "Lil Kim": "Rap",
    "Lil' Half Dead": "Rap",
    "LL Cool J": "Rap",
    "Master P": "Rap",
    "Mobb Deep": "Rap",
    "Nas": "Rap",
    "Naughty By Nature": "Rap",
    "OutKast": "Rap",
    "P.M. Dawn": "Rap",
    "Public Enemy": "Rap",
    "Redman": "Rap",
    "Ruffneck": "Rap",
    "Sadat X": "Rap",
    "Salt 'N' Pepa": "Rap",
    "Snoop Dogg": "Rap",
    "The Pharcyde": "Rap",
    "Warren G": "Rap",
    "Wu-Tang Clan": "Rap", # If present

    # Country
    "Alan Jackson": "Country",
    "Brooks & Dunn": "Country",
    "Charlie Major": "Country",
    "Clint Black": "Country",
    "Diamond Rio": "Country",
    "Dwight Yoakam": "Country",
    "Gary Allan (2)": "Country",
    "Keith Stegall": "Country",
    "LeAnn Rimes": "Country",
    "Los Tigres Del Norte": "Country",
    "Mark Chesnutt": "Country",
    "Mark Wills": "Country",
    "Martina McBride": "Country",
    "Marty Stuart": "Country",
    "Patty Loveless": "Country",
    "Reba McEntire": "Country",
    "Sammy Kershaw": "Country",
    "Shania Twain": "Country",
    "Terri Clark": "Country",
    "Toby Keith": "Country",
    "Trace Adkins": "Country",
    "Tracy Byrd": "Country",
    "Trisha Yearwood": "Country",
    "Vince Gill": "Country",
    "Wade Hayes": "Country",
    "Willie Nelson": "Country",
}

def enrich_genres():
    input_path = 'data/1996.json'
    
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
