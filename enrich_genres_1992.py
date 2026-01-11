import json
import os

# Define the genre mapping for 1992
# Strategies:
# - Grunge/Indie/Alt -> 'Rock Alternativo'
# - Hard Rock -> 'Metal' or 'Rock Alternativo' (depending on heaviness, Metal usually safer for sorting)
# - Hip Hop -> 'Rap'
# - R&B -> 'Pop' (Broad appeal)
# - Country -> 'Country'
# - Electronic/Dance -> 'Eletronico' / 'Dance'

ARTIST_GENRES = {
    # Rock / Alt / Indie / Grunge
    "10,000 Maniacs": "Rock Alternativo",
    "4 Non Blondes": "Rock Alternativo",
    "7 Year Bitch": "Rock Alternativo", # Grunge/Punk
    "Alice In Chains": "Rock Alternativo",
    "Alien Sex Fiend": "Rock Alternativo", # Goth
    "All About Eve": "Rock Alternativo", # Folk Rock
    "Animal Bag": "Rock Alternativo",
    "Baby Animals": "Rock Alternativo",
    "Bad Company (3)": "Metal", # Hard Rock
    "Bad4Good": "Metal",
    "Beijing Spring": "Rock Alternativo",
    "Big Audio Dynamite": "Rock Alternativo",
    "Billy Childish": "Rock Alternativo", # Garage
    "Blind Melon": "Rock Alternativo",
    "Blue Manner Haze": "Rock Alternativo",
    "Blue Rodeo": "Rock Alternativo",
    "Blur": "Rock Alternativo",
    "Bone Club": "Rock Alternativo",
    "Brenda Kahn": "Rock Alternativo",
    "Catherine Wheel": "Rock Alternativo",
    "Chainsaw Kittens": "Rock Alternativo",
    "Chris Whitley": "Rock Alternativo", # Blues Rock
    "Clutch (3)": "Rock Alternativo",
    "Cracker": "Rock Alternativo",
    "Crash Test Dummies": "Rock Alternativo",
    "D.A.D.": "Metal", # Hard Rock
    "Dada (4)": "Rock Alternativo",
    "Daisy Chainsaw": "Rock Alternativo",
    "Del Amitri": "Rock Alternativo",
    "Dinosaur Jr.": "Rock Alternativo",
    "Energy Orchard": "Rock Alternativo",
    "Face To Face": "Punk",
    "Faith No More": "Rock Alternativo",
    "Fat Tuesday": "Rock Alternativo",
    "Fish": "Rock Alternativo", # Prog
    "Fleetwood Mac": "Pop", # Classic Rock
    "Gin Blossoms": "Rock Alternativo",
    "Green Jellÿ": "Metal", # Comedy Metal
    "Gruntruck": "Rock Alternativo",
    "Gun (2)": "Metal",
    "Helmet (2)": "Metal", # Alt Metal
    "Hootie & The Blowfish": "Rock Alternativo",
    "Infectious Grooves": "Rock Alternativo",
    "Inspiral Carpets": "Rock Alternativo",
    "Izabella": "Rock Alternativo",
    "James": "Rock Alternativo",
    "Joe Satriani": "Rock Alternativo", # Instrumental
    "John Norum": "Metal",
    "Kiss": "Metal",
    "L7": "Rock Alternativo", # Grunge
    "Les Negresses Vertes": "Rock Alternativo",
    "Les Wampas": "Punk",
    "Litfiba": "Rock Alternativo",
    "Little Village": "Rock Alternativo",
    "Lush": "Rock Alternativo",
    "Manic Street Preachers": "Rock Alternativo",
    "Maná": "Pop", # Rock en Espanol
    "Material Issue": "Rock Alternativo",
    "Matthew Sweet": "Rock Alternativo",
    "Mephisto Walz": "Rock Alternativo", # Goth
    "Morrissey": "Rock Alternativo",
    "Ned's Atomic Dustbin": "Rock Alternativo",
    "Neil Young": "Rock Alternativo", # Folk Rock
    "Nine Inch Nails": "Industrial", # Industrial
    "Nirvana": "Rock Alternativo",
    "No Doubt": "Pop", # Ska/Pop
    "Nymphs": "Rock Alternativo",
    "Oui Oui": "Rock Alternativo",
    "Our Lady Peace": "Rock Alternativo",
    "Paul Weller": "Rock Alternativo",
    "Pavement": "Rock Alternativo",
    "Pearl Jam": "Rock Alternativo",
    "Peter Himmelman": "Rock Alternativo",
    "Primal Scream": "Rock Alternativo",
    "Public Image Limited": "Rock Alternativo", # Post-Punk
    "Pulp": "Rock Alternativo",
    "R.E.M.": "Rock Alternativo",
    "Rage Against The Machine": "Metal", # Rap Metal
    "Rake's Progress, The": "Rock Alternativo",
    "Ramones": "Punk",
    "Red Hot Chili Peppers": "Rock Alternativo",
    "Ride": "Rock Alternativo",
    "Rise Robots Rise": "Rock Alternativo",
    "Rita Chiarelli": "Rock Alternativo", # Blues
    "RoBERT": "Rock Alternativo",
    "Robbie Robertson": "Rock Alternativo",
    "Seaweed": "Rock Alternativo",
    "Sick Of It All": "Punk", # Hardcore
    "Sinéad O'Connor": "Rock Alternativo",
    "Siouxsie & The Banshees": "Rock Alternativo",
    "Social Distortion": "Punk",
    "Sonic Youth": "Rock Alternativo",
    "Soul Asylum": "Rock Alternativo",
    "Soundgarden": "Rock Alternativo", # Grunge
    "Spin Doctors": "Rock Alternativo",
    "State Of Art": "Rock Alternativo", # Noise
    "Stone Temple Pilots": "Rock Alternativo",
    "Stray Cats": "Rock Alternativo", # Rockabilly
    "Suede": "Rock Alternativo",
    "Sugar (5)": "Rock Alternativo",
    "Suicidal Tendencies": "Punk",
    "Suzanne Vega": "Rock Alternativo",
    "Tasmin Archer": "Pop",
    "Texas": "Pop",
    "The Afghan Whigs": "Rock Alternativo",
    "The B-52's": "Pop", # New Wave
    "The Black Crowes": "Rock Alternativo",
    "The Boo Radleys": "Rock Alternativo",
    "The Breeders": "Rock Alternativo",
    "The Charlatans": "Rock Alternativo",
    "The Christians": "Pop",
    "The Cure": "Rock Alternativo",
    "The Gathering": "Metal",
    "The Jesus And Mary Chain": "Rock Alternativo",
    "The Lemonheads": "Rock Alternativo",
    "The Levellers": "Rock Alternativo",
    "The Lightning Seeds": "Pop",
    "The Rockingbirds": "Rock Alternativo",
    "The Smashing Pumpkins": "Rock Alternativo",
    "The Smithereens": "Rock Alternativo",
    "The Sundays": "Rock Alternativo",
    "The Tragically Hip": "Rock Alternativo",
    "The Verve": "Rock Alternativo",
    "The Wallflowers": "Rock Alternativo",
    "The Wedding Present": "Rock Alternativo",
    "The Wonder Stuff": "Rock Alternativo",
    "They Might Be Giants": "Rock Alternativo",
    "This Perfect Day": "Rock Alternativo",
    "Throwing Muses": "Rock Alternativo",
    "Toad The Wet Sprocket": "Rock Alternativo",
    "Tom Cochrane": "Rock Alternativo",
    "Tom Waits": "Rock Alternativo",
    "Tori Amos": "Pop", # Alt Pop
    "Toto": "Pop", # Rock
    "U2": "Rock Alternativo",
    "Voice Of The Beehive": "Rock Alternativo",
    "Voice of the City": "Rock Alternativo",
    "WAX": "Rock Alternativo",
    "Walt Mink": "Rock Alternativo",
    "Weird Al Yankovic": "Pop",
    "Wendy & Lisa": "Pop",
    "Wet Wet Wet": "Pop",
    "Wildside": "Metal",
    "XTC": "Rock Alternativo",
    "Zhigge": "Rap",

    # Metal / Hard Rock
    "21 Guns": "Metal",
    "24-7 Spyz": "Metal", # Funk Metal
    "Alice Cooper": "Metal",
    "Black Sabbath": "Metal",
    "Bon Jovi": "Pop", # / Rock
    "Cinderella": "Metal",
    "Corrosion Of Conformity": "Metal",
    "Danzig": "Metal",
    "Def Leppard": "Metal",
    "Dream Theater": "Metal",
    "Europe": "Metal",
    "Extreme": "Metal",
    "Faster Pussycat": "Metal",
    "Firehouse": "Metal",
    "Gotthard": "Metal",
    "Guns N' Roses": "Metal",
    "Helmet (2)": "Metal",
    "Iron Maiden": "Metal",
    "Kreator": "Metal",
    "Lita Ford": "Metal",
    "Megadeth": "Metal",
    "Metallica": "Metal",
    "Monster Magnet": "Metal",
    "Motörhead": "Metal",
    "Mr. Big": "Metal",
    "Pantera": "Metal",
    "Paradise Lost": "Metal",
    "Poison": "Metal",
    "Queensrÿche": "Metal",
    "Steelheart": "Metal",
    "Testament (2)": "Metal",
    "Thunder": "Metal",
    "Tool": "Metal",
    "Ugly Kid Joe": "Metal", # Hard Rock
    "W.A.S.P.": "Metal",
    "Warrant": "Metal",
    "White Zombie": "Industrial",
    "ZZ Top": "Rock Alternativo", # Blues Rock

    # Rap / Hip Hop
    "2Pac": "Rap",
    "A Tribe Called Quest": "Rap",
    "Arrested Development": "Rap",
    "Beastie Boys": "Rap", # Often classified as Rap
    "Boogie Down Productions": "Rap",
    "Cypress Hill": "Rap",
    "Das EFX": "Rap", # Not in list but common
    "Definition Of Sound": "Rap",
    "Dr. Dre": "Rap",
    "Eric B. & Rakim": "Rap",
    "Father MC": "Rap",
    "Gang Starr": "Rap",
    "Heavy D. & The Boyz": "Rap",
    "House Of Pain": "Rap",
    "Ice Cube": "Rap",
    "Kris Kross": "Rap",
    "MC Serch": "Rap",
    "Marky Mark & The Funky Bunch": "Rap", # Pop Rap
    "Me Phi Me": "Rap",
    "Nas": "Rap",
    "Naughty By Nature": "Rap",
    "P.M. Dawn": "Rap",
    "Positive K": "Rap",
    "Public Enemy": "Rap",
    "Sir Mix-A-Lot": "Rap",
    "Snow": "Rap",
    "Stereo MCs": "Rap",
    "The Goats": "Rap",
    "The Pharcyde": "Rap", # Not in list but good to have
    "TLC": "Pop", # R&B / Hip Hop

    # Pop / R&B / Mainstream
    "2 Die 4": "Pop",
    "AZ-1": "Pop",
    "After 7": "Pop",
    "Al B. Sure": "Pop",
    "Alanis Morissette": "Pop",
    "Amy Grant": "Pop", # Christian/Pop
    "Annie Lennox": "Pop",
    "Bananarama": "Pop",
    "Barry White": "Pop", # Soul
    "Belinda Carlisle": "Pop",
    "Billy Joel": "Pop",
    "Billy Ocean": "Pop",
    "Bobby Brown": "Pop", # R&B
    "Bonnie Tyler": "Pop",
    "Brian McKnight": "Pop", # R&B
    "Bruce Springsteen": "Rock Alternativo", # Rock
    "Bryan Adams": "Pop", # Rock
    "Calloway": "Pop",
    "Carmel": "Pop",
    "Cathy Dennis": "Pop",
    "CeCe Peniston": "Dance",
    "Chante Moore": "Pop", # R&B
    "Christopher Williams": "Pop", # R&B
    "Cliff Richard": "Pop",
    "Deee-Lite": "Dance",
    "Die Prinzen": "Pop",
    "Don-E": "Pop", # Soul
    "Eddie Money": "Pop", # Rock
    "Elton John": "Pop",
    "En Vogue": "Pop", # R&B
    "Enya": "Pop", # New Age
    "Erasure": "Pop", # Synthpop
    "Eros Ramazzotti": "Pop",
    "Etienne Daho": "Pop",
    "Everything But The Girl": "Pop",
    "Exposé": "Pop",
    "Falco": "Pop",
    "Genesis": "Pop",
    "George Michael": "Pop",
    "Gloria Estefan": "Pop",
    "Go West": "Pop",
    "Grayson Hugh": "Pop",
    "Harry Connick, Jr.": "Pop", # Jazz
    "Hi-Five": "Pop", # R&B
    "Howard Jones": "Pop",
    "Huey Lewis": "Pop", # Rock
    "INXS": "Pop", # Rock
    "Indigo Girls": "Rock Alternativo", # Folk
    "Inner Circle": "Pop", # Reggae
    "Inner City": "Dance",
    "Jade (3)": "Pop", # R&B
    "Jah Wobble": "Eletronico",
    "Joe Cocker": "Pop", # Rock
    "John Lee Hooker": "Rock Alternativo", # Blues
    "John Mellencamp": "Pop", # Rock
    "Julian Lennon": "Pop",
    "Kim Wilde": "Pop",
    "Kylie Minogue": "Pop",
    "Kyosuke Himuro": "Pop",
    "Laurent Voulzy": "Pop",
    "Leonard Cohen": "Rock Alternativo", # Folk
    "Lionel Richie": "Pop",
    "Lisa Stansfield": "Pop",
    "Los Tigres Del Norte": "Country", # Norteno
    "M People": "Dance",
    "Madonna": "Pop",
    "Mariah Carey": "Pop",
    "Marie Fredriksson": "Pop",
    "Mark Curry (2)": "Rock Alternativo",
    "Martika": "Pop",
    "Mary J. Blige": "Pop", # R&B
    "Mecano": "Pop",
    "Michael Bolton": "Pop",
    "Michael Jackson": "Pop",
    "Mylène Farmer": "Pop",
    "New Kids On The Block": "Pop",
    "Opus III": "Dance",
    "Patty Smyth": "Pop",
    "Paulina Rubio": "Pop",
    "Peter Cetera": "Pop",
    "Peter Gabriel": "Pop",
    "Prince": "Pop",
    "R. Kelly": "Pop", # R&B
    "Ric Ocasek": "Pop",
    "Richard Marx": "Pop",
    "Ricky Martin": "Pop",
    "Ringo Starr": "Pop",
    "Rod Stewart": "Pop",
    "Roxette": "Pop",
    "Roy Orbison": "Pop",
    "Russ Irwin": "Pop",
    "SWV": "Pop", # R&B
    "Sade": "Pop", # Soul
    "Sandra": "Pop",
    "Santana": "Rock Alternativo", # Rock
    "Selena": "Pop",
    "Shai (3)": "Pop", # R&B
    "Shakespear's Sister": "Pop",
    "Shawn Colvin": "Pop", # Folk
    "Simply Red": "Pop",
    "Sophie B. Hawkins": "Pop",
    "Soul II Soul": "Pop", # R&B
    "Swing Out Sister": "Pop",
    "Take That": "Pop",
    "Thalía": "Pop",
    "The Christians": "Pop",
    "Thomas Dolby": "Pop", # Synthpop
    "Thompson Twins": "Pop",
    "Tina Turner": "Pop",
    "Tom Cochrane": "Pop",
    "Toni Braxton": "Pop", # R&B
    "Vanessa Paradis": "Pop",
    "Vanessa Williams": "Pop",
    "Vince Gill": "Country",
    "Wilson Phillips": "Pop",
    "Yello": "Eletronico",
    "k.d. lang": "Pop", # Country/Pop

    # Country
    "Alan Jackson": "Country",
    "Billy Ray Cyrus": "Country",
    "Brooks & Dunn": "Country",
    "Clint Black": "Country",
    "Collin Raye": "Country",
    "Diamond Rio": "Country",
    "Dwight Yoakam": "Country",
    "George Strait": "Country",
    "Iris DeMent": "Country",
    "Joe Diffie": "Country",
    "Kathy Mattea": "Country",
    "Lyle Lovett": "Country",
    "Martina McBride": "Country",
    "Marty Stuart": "Country",
    "Prairie Oyster": "Country",
    "Reba McEntire": "Country",
    "Sammy Kershaw": "Country",
    "The Mavericks": "Country",
    "Tracy Byrd": "Country",
    "Trisha Yearwood": "Country",

    # Dance / Electronic
    "2 Unlimited": "Dance",
    "808 State": "Eletronico",
    "Bizarre Inc": "Dance",
    "Black Box": "Dance", # Not in list but good safeguard
    "C+C Music Factory": "Dance",
    "D:Ream": "Dance",
    "Dr. Alban": "Dance",
    "Information Society": "Eletronico",
    "KWS": "Dance", 
    "Orbital": "Eletronico",
    "SL2": "Dance",
    "Snap!": "Dance",
    "The Prodigy": "Eletronico",
    "The Shamen": "Eletronico",
    "Underworld": "Eletronico",

    # Missing from Round 1
    "Prefab Sprout": "Pop",
    "Keith Richards": "Rock Alternativo", # Rock
    "The New Power Generation": "Pop", # Prince backing band
    "Melissa Etheridge": "Rock Alternativo", # Rock
    "David Byrne": "Rock Alternativo", # Art Pop
    "The Outfield": "Pop", # Power Pop
    "Giant": "Metal", # Melodic Rock
    "The Kelly Family": "Pop", # Folk Pop
    "David Hasselhoff": "Pop",
    "Boize": "Pop",
    "David Bowie": "Rock Alternativo",
    "Whitney Houston": "Pop",
    "Cutty Ranks": "Rap", # Dancehall/Reggae
    "Eric Clapton": "Rock Alternativo", # Blues Rock
    "Babes In Toyland": "Punk", # Grunge/Punk
    "Queen": "Rock Alternativo" # Classic Rock
}

def enrich_genres_1992():
    input_path = 'data/1992.json'
    
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
    enrich_genres_1992()
