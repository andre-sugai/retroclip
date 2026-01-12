import json

# Mapping of artists to genres for 1988
genre_mapping = {
    # Pop
    "Michael Jackson": "Pop",
    "George Michael": "Pop",
    "Whitney Houston": "Pop",
    "Madonna": "Pop",
    "Debbie Gibson": "Pop",
    "Tiffany": "Pop",
    "Kylie Minogue": "Pop",
    "Rick Astley": "Pop",
    "Bros": "Pop",
    "New Kids On The Block": "Pop",
    "Bobby Brown": "Pop",
    "Taylor Dayne": "Pop",
    "Paula Abdul": "Pop",
    "Gloria Estefan": "Pop",
    "Miami Sound Machine": "Pop",
    "Pet Shop Boys": "Pop",
    "Erasure": "Pop",
    "A-ha": "Pop",
    "a-ha": "Pop",
    "Roxette": "Pop",
    "Eurythmics": "Pop",
    "Belinda Carlisle": "Pop",
    "Janet Jackson": "Pop",
    "Prince": "Pop",
    "Sheena Easton": "Pop",
    "Kim Wilde": "Pop",
    "Sandra": "Pop",
    "C.C. Catch": "Pop",
    "Simply Red": "Pop",
    "Phil Collins": "Pop",
    "Elton John": "Pop",
    "Billy Ocean": "Pop",
    "Terence Trent D'Arby": "Pop",
    "Milli Vanilli": "Pop",
    "Kenny Loggins": "Pop",
    "Richard Marx": "Pop",
    "Steve Winwood": "Pop",
    "Huey Lewis": "Pop",
    "Heart": "Pop",
    "Fleetwood Mac": "Pop",
    "Toto": "Pop",
    "Foreigner": "Pop",
    "Chicago": "Pop",
    "Beach Boys": "Pop",
    "The Beach Boys": "Pop",
    "Bananarama": "Pop",
    "Samantha Fox": "Pop",
    "Sabrina": "Pop",
    "Modern Talking": "Pop",
    "Falco": "Pop",
    "Alphaville": "Pop",
    "Level 42": "Pop",
    "Living In A Box": "Pop",
    "Johnny Hates Jazz": "Pop",
    "Climie Fisher": "Pop",
    "Wet Wet Wet": "Pop",
    "Fairground Attraction": "Pop",
    "Tanita Tikaram": "Pop",
    "Tracy Chapman": "Pop", # Folk Pop
    "Sade": "Pop", # Sophisti-pop
    "Enya": "Pop", # New Age
    "Bobby McFerrin": "Pop",
    "The Bangles": "Pop",
    "Cyndi Lauper": "Pop",
    "Olivia Newton-John": "Pop",
    "Celine Dion": "Pop",
    "Céline Dion": "Pop",
    "Cher": "Pop",
    "Bette Midler": "Pop",
    "Barbra Streisand": "Pop",
    "Smokey Robinson": "Pop",
    "Hall & Oates": "Pop",
    "Daryl Hall & John Oates": "Pop",
    "Go West": "Pop",
    "Spandau Ballet": "Pop",
    "T'Pau": "Pop",
    "Transvision Vamp": "Pop",
    "Eighth Wonder": "Pop",
    "Brother Beyond": "Pop",
    "Yazz": "Pop",
    "S-Express": "Pop", # Dance Pop
    "Bomb The Bass": "Pop", # Dance Pop
    "Coldcut": "Pop", # Dance Pop
    "Inner City": "Pop", # Dance Pop
    "Womack & Womack": "Pop",
    "New Edition": "Pop", # R&B
    "Al B. Sure!": "Pop", # R&B
    "Keith Sweat": "Pop", # R&B
    "Karyn White": "Pop", # R&B
    "Pebbles": "Pop", # R&B
    "Vanessa Williams": "Pop", # R&B
    "Jody Watley": "Pop", # R&B
    
    # Rock / Alternativo
    "U2": "Rock Alternativo",
    "R.E.M.": "Rock Alternativo",
    "The Cure": "Rock Alternativo",
    "The Smiths": "Rock Alternativo",
    "Morrissey": "Rock Alternativo",
    "Depeche Mode": "Rock Alternativo",
    "New Order": "Rock Alternativo",
    "INXS": "Rock Alternativo",
    "Midnight Oil": "Rock Alternativo",
    "The Church": "Rock Alternativo",
    "The Go-Betweens": "Rock Alternativo",
    "Nick Cave & The Bad Seeds": "Rock Alternativo",
    "Sonic Youth": "Rock Alternativo",
    "Pixies": "Rock Alternativo",
    "Dinosaur Jr.": "Rock Alternativo",
    "The Sugarcubes": "Rock Alternativo",
    "Cocteau Twins": "Rock Alternativo",
    "Siouxsie & The Banshees": "Rock Alternativo",
    "Echo & The Bunnymen": "Rock Alternativo",
    "The Jesus And Mary Chain": "Rock Alternativo",
    "My Bloody Valentine": "Rock Alternativo",
    "Talk Talk": "Rock Alternativo",
    "The Psychedelic Furs": "Rock Alternativo",
    "Love And Rockets": "Rock Alternativo",
    "The Mission": "Rock Alternativo",
    "The Sisters Of Mercy": "Rock Alternativo",
    "Bauhaus": "Rock Alternativo",
    "Public Image Ltd": "Rock Alternativo",
    "Public Image Limited": "Rock Alternativo",
    "XTC": "Rock Alternativo",
    "Crowded House": "Rock Alternativo",
    "Split Enz": "Rock Alternativo",
    "Hothouse Flowers": "Rock Alternativo",
    "The Proclaimers": "Rock Alternativo",
    "The Pogues": "Rock Alternativo",
    "The Waterboys": "Rock Alternativo",
    "Bruce Springsteen": "Rock Alternativo",
    "John Mellencamp": "Rock Alternativo",
    "Tom Petty": "Rock Alternativo",
    "Traveling Wilburys": "Rock Alternativo",
    "Steve Earle": "Rock Alternativo",
    "Bryan Adams": "Rock Alternativo",
    "Rod Stewart": "Rock Alternativo",
    "Robert Palmer": "Rock Alternativo",
    "Billy Idol": "Rock Alternativo",
    "The Cars": "Rock Alternativo",
    "Talking Heads": "Rock Alternativo",
    "Fine Young Cannibals": "Rock Alternativo",
    "Living Colour": "Rock Alternativo", # Funk Metal
    "Jane's Addiction": "Rock Alternativo",
    "Red Hot Chili Peppers": "Rock Alternativo",
    "Faith No More": "Rock Alternativo",
    "Fishbone": "Rock Alternativo",
    "Soundgarden": "Rock Alternativo", # Early Grunge
    "Mudhoney": "Rock Alternativo", # Early Grunge
    "Green River": "Rock Alternativo", # Early Grunge
    "Melvins": "Rock Alternativo",
    "Butthole Surfers": "Rock Alternativo",
    "Meat Puppets": "Rock Alternativo",
    "Violent Femmes": "Rock Alternativo",
    "They Might Be Giants": "Rock Alternativo",
    "Camper Van Beethoven": "Rock Alternativo",
    "The Replacements": "Rock Alternativo",
    "Hüsker Dü": "Rock Alternativo",
    "Fugazi": "Rock Alternativo",
    "Ministry": "Rock Alternativo", # Industrial
    "Skinny Puppy": "Rock Alternativo", # Industrial
    "Front 242": "Rock Alternativo", # EBM
    "Nitzer Ebb": "Rock Alternativo", # EBM
    "Laibach": "Rock Alternativo",
    
    # Metal / Hard Rock
    "Guns N' Roses": "Metal",
    "Metallica": "Metal",
    "Megadeth": "Metal",
    "Slayer": "Metal",
    "Anthrax": "Metal",
    "Iron Maiden": "Metal",
    "Judas Priest": "Metal",
    "Ozzy Osbourne": "Metal",
    "Dio": "Metal",
    "Queensrÿche": "Metal",
    "Def Leppard": "Metal",
    "Bon Jovi": "Metal",
    "Aerosmith": "Metal",
    "Van Halen": "Metal",
    "Mötley Crüe": "Metal",
    "Poison": "Metal",
    "Cinderella": "Metal",
    "Ratt": "Metal",
    "Dokken": "Metal",
    "Warrant": "Metal",
    "Skid Row": "Metal",
    "L.A. Guns": "Metal",
    "Faster Pussycat": "Metal",
    "Great White": "Metal",
    "White Lion": "Metal",
    "Europe": "Metal",
    "Scorpions": "Metal",
    "Helloween": "Metal",
    "Accept": "Metal",
    "U.D.O.": "Metal",
    "Testament": "Metal",
    "Exodus": "Metal",
    "Overkill": "Metal",
    "Kreator": "Metal",
    "Sodom": "Metal",
    "Destruction": "Metal",
    "Celtic Frost": "Metal",
    "Bathory": "Metal",
    "Running Wild": "Metal",
    "Manowar": "Metal",
    "King Diamond": "Metal",
    "Mercyful Fate": "Metal",
    "Death": "Metal",
    "Morbid Angel": "Metal",
    "Napalm Death": "Metal",
    "Sepultura": "Metal",
    "Danzig": "Metal",
    "Suicidal Tendencies": "Metal", # Crossover
    "D.R.I.": "Metal", # Crossover
    "Corrosion of Conformity": "Metal", # Crossover
    "Alice Cooper": "Metal",
    "Kiss": "Metal",
    "Whitesnake": "Metal",
    "Deep Purple": "Metal",
    "Motorhead": "Metal",
    "Motörhead": "Metal",
    "AC/DC": "Metal",
    "The Cult": "Metal", # Hard Rock
    "W.A.S.P.": "Metal",
    "Twisted Sister": "Metal",
    "Quiet Riot": "Metal",
    "Vixen": "Metal",
    "Lita Ford": "Metal",
    "Joan Jett": "Metal", # Hard Rock
    "Joan Jett & The Blackhearts": "Metal", # Hard Rock
    
    # Rap / Hip Hop
    "N.W.A": "Rap",
    "Public Enemy": "Rap",
    "Run-D.M.C.": "Rap",
    "Run-DMC": "Rap",
    "Eric B. & Rakim": "Rap",
    "Slick Rick": "Rap",
    "Big Daddy Kane": "Rap",
    "KRS-One": "Rap",
    "Boogie Down Productions": "Rap",
    "Ice-T": "Rap",
    "Eazy-E": "Rap",
    "Too Short": "Rap",
    "Too $hort": "Rap",
    "LL Cool J": "Rap",
    "Salt-N-Pepa": "Rap",
    "Salt 'N' Pepa": "Rap",
    "JJ Fad": "Rap",
    "J.J. Fad": "Rap",
    "DJ Jazzy Jeff & The Fresh Prince": "Rap",
    "Rob Base & DJ E-Z Rock": "Rap",
    "Tone Loc": "Rap",
    "Tone-Loc": "Rap",
    "Young MC": "Rap",
    "Biz Markie": "Rap",
    "EPMD": "Rap",
    "De La Soul": "Rap", # Early
    "Jungle Brothers": "Rap",
    "Stetsasonic": "Rap",
    "Ultramagnetic MCs": "Rap",
    "MC Lyte": "Rap",
    "Queen Latifah": "Rap", # Early
    "Monie Love": "Rap",
    "Heavy D & The Boyz": "Rap",
    "Heavy D. & The Boyz": "Rap",
    "Whodini": "Rap",
    "Doug E. Fresh": "Rap",
    "Fat Boys": "Rap",
    "The Fat Boys": "Rap",
    "Kool Moe Dee": "Rap",
    "Sir Mix-A-Lot": "Rap",
    "2 Live Crew": "Rap",
    "Geto Boys": "Rap",
    "Beastie Boys": "Rap",
    "Kid 'N Play": "Rap",
    
    # Eletronico / Dance
    "Technotronic": "Eletronico",
    "Black Box": "Eletronico",
    "Soul II Soul": "Eletronico",
    "S'Express": "Eletronico",
    "Bomb The Bass": "Eletronico",
    "M/A/R/R/S": "Eletronico",
    "Coldcut": "Eletronico",
    "Inner City": "Eletronico",
    "808 State": "Eletronico",
    "A Guy Called Gerald": "Eletronico",
    "Phuture": "Eletronico",
    "Mr. Fingers": "Eletronico",
    "Marshall Jefferson": "Eletronico",
    "Frankie Knuckles": "Eletronico",
    "Kraftwerk": "Eletronico",
    "Yello": "Eletronico",
    "Art Of Noise": "Eletronico",
    "Information Society": "Eletronico",
    "Kon Kan": "Eletronico",
    "When In Rome": "Eletronico",
    "Camouflage": "Eletronico",
    "Book of Love": "Eletronico",
    "Red Flag": "Eletronico",
    "Anything Box": "Eletronico",
    "Celebrate the Nun": "Eletronico",
    "Erasure": "Eletronico", # Synth-pop
    "Pet Shop Boys": "Eletronico", # Synth-pop
    "New Order": "Eletronico",
    
    # Country
    "George Strait": "Country",
    "Randy Travis": "Country",
    "Dwight Yoakam": "Country",
    "Reba McEntire": "Country",
    "The Judds": "Country",
    "Alabama": "Country",
    "Hank Williams Jr.": "Country",
    "Rosanne Cash": "Country",
    "K.T. Oslin": "Country",
    "Restless Heart": "Country",
    "Highway 101": "Country",
    "The Forester Sisters": "Country",
    "Desert Rose Band": "Country",
    "Foster & Lloyd": "Country",
    "Lyle Lovett": "Country",
    "Nanci Griffith": "Country",
    "Steve Wariner": "Country",
    "Earl Thomas Conley": "Country",
    "Ricky Van Shelton": "Country",
    "Kathy Mattea": "Country",
    "Tanya Tucker": "Country",
    "Dolly Parton": "Country",
    "Kenny Rogers": "Country",
    "Willie Nelson": "Country",
    "Waylon Jennings": "Country",
    "The Oak Ridge Boys": "Country",
    "Exile": "Country",
    "Sawyer Brown": "Country",
    "Keith Whitley": "Country",
    "Patty Loveless": "Country",
    "Shenandoah": "Country",
    
    # Punk
    "The Ramones": "Punk",
    "Ramones": "Punk",
    "Bad Religion": "Punk",
    "NOFX": "Punk",
    "Pennywise": "Punk",
    "The Offspring": "Punk", # Early
    "Green Day": "Punk", # Early
    "Operation Ivy": "Punk",
    "Social Distortion": "Punk",
    "Descendents": "Punk",
    "ALL": "Punk",
    "Fugazi": "Punk",
    "Dag Nasty": "Punk",
    "Gorilla Biscuits": "Punk",
    "Youth of Today": "Punk",
    "Sick of It All": "Punk",
    "Agnostic Front": "Punk",
    "Cro-Mags": "Punk",
    "Dead Kennedys": "Punk", # Split, but tracks exist
    "Misfits": "Punk",
    "Danzig": "Punk", # Or Metal
    "The Damned": "Punk",
    "Siouxsie and the Banshees": "Punk",
    "The Exploited": "Punk",
    "G.B.H.": "Punk",
    "Discharge": "Punk",
    "Napalm Death": "Punk", # Grindcore / Metal / Punk
    "Extreme Noise Terror": "Punk",
    "Crass": "Punk",
    "Conflict": "Punk",
    "Subhumans": "Punk",
    "Toy Dolls": "Punk",
    "The Adicts": "Punk",
    "Stiff Little Fingers": "Punk",
    "Buzzcocks": "Punk",
    "Generation X": "Punk",
    "X": "Punk",
    "The Germs": "Punk",
    "Black Flag": "Punk",
    "Circle Jerks": "Punk",
    "Fear": "Punk",
    "Agent Orange": "Punk",
    "T.S.O.L.": "Punk",
    "Minutemen": "Punk",
    "fIREHOSE": "Punk",
    "Husker Du": "Punk",
    "Rapeman": "Punk", # Noise Rock / Post-Hardcore
    
    # New additions (Top Unknowns)
    "Prefab Sprout": "Pop", # Sophisti-pop
    "Cheap Trick": "Rock Alternativo", # Power Pop / Hard Rock
    "Glass Tiger": "Pop",
    "Soul Asylum": "Rock Alternativo",
    "Timbuk 3": "Rock Alternativo",
    "Sinéad O'Connor": "Rock Alternativo",
    "Sinead O'Connor": "Rock Alternativo",
    "Tina Turner": "Pop",
    "Pat Benatar": "Rock Alternativo",
    "All About Eve": "Rock Alternativo", # Gothic Rock / Folk
    "Breaking Circus": "Rock Alternativo", # Post-punk
    "Herbert Grönemeyer": "Pop",
    "Robert Plant": "Rock Alternativo",
    "3rd Bass": "Rap",
    "Oui Oui": "Pop",
    "Daryl Braithwaite": "Pop",
    "Zodiac Mindwarp": "Rock Alternativo",
    "The Christians": "Pop",
    "Colin James": "Rock Alternativo",
    "Scritti Politti": "Pop",
    "Everything But The Girl": "Pop",
    "Sting": "Pop",
    "Mike Oldfield": "Pop",
    "Shakespear's Sister": "Pop",
    "Shakespeare's Sister": "Pop",
    "Godley & Creme": "Pop",
    "BulletBoys": "Metal", # Glam Metal
    "REO Speedwagon": "Pop", # Pop Rock
    "Matt Bianco": "Pop", # Sophisti-pop
    "Survivor": "Rock Alternativo",
    "Rick Springfield": "Pop",
    "Vinnie Vincent": "Metal",
    "Cliff Richard": "Pop",
    "Peter Cetera": "Pop",
    "Chayanne": "Pop",
    "Icehouse": "Rock Alternativo",
    "Jean Beauvoir": "Pop",
    "Nick Kamen": "Pop",
    "Britny Fox": "Metal",
    "Michael Bolton": "Pop",
    "Big Country": "Rock Alternativo",
    "Toni Childs": "Pop",
    "Agitpop": "Rock Alternativo",
    "Deacon Blue": "Pop",
    "The Alarm": "Rock Alternativo",
    "Alarm (3)": "Rock Alternativo",
    "Spagna": "Pop",
    "The Godfathers": "Rock Alternativo",
    "Was (Not Was)": "Pop",
    "Melissa Etheridge": "Rock Alternativo",
    "The Moody Blues": "Rock Alternativo",
    "Duran Duran": "Pop",
    "Voice Of The Beehive": "Rock Alternativo",
    "Titãs": "Rock Alternativo",
    "Bee Gees": "Pop",
    "Candlemass": "Metal", # Doom Metal
    "Nymphs": "Rock Alternativo",
    "Sparks": "Pop",
    "Womack & Wowack": "Pop",
    "Womack & Womack": "Pop",
    "'Til Tuesday": "Pop",
    "Velore & Double O": "Eletronico", # House/Dance
    "Corey Hart": "Pop",
    "John Lennon": "Pop", # Rock
    "Peter Noone": "Pop",
    "Robert Tepper": "Pop",
    "Paul Dean": "Rock Alternativo",
    "Magnolias": "Rock Alternativo", # Punk
    "Roachford": "Pop",
    "Perfect Day": "Pop",
    "Lenny Kravitz": "Rock Alternativo",
    "Breathe": "Pop",
    "Breathe (4)": "Pop",
    "Carmel": "Pop",
    "Mr. Mister": "Pop",
    "Diamanda Galas": "Rock Alternativo",
    "Diamanda Que": "Rock Alternativo",
    "Diamanda Galás": "Rock Alternativo",
    "Nick Heyward": "Pop",
    "Jane Wiedlin": "Pop",
    "UB40": "Pop", # Reggae Pop
    "Sam Kinison": "Metal", # Comedy / Rock
    "3": "Rock Alternativo", # Prog
    "Ry Cooder": "Rock Alternativo",
    "Martini Ranch": "Rock Alternativo", # New Wave
    "Joy Division": "Rock Alternativo",
    "Amy Grant": "Pop",
    "Audio Two": "Rap",
    "Deniece Williams": "Pop",
    "E.U.": "Rap", # Go-go
    "The Boys": "Rap",
    "Ultra Vivid Scene": "Rock Alternativo",
    "Eddie Money": "Rock Alternativo",
    "Kenny G": "Pop", # Jazz
    "CCCP": "Punk",
    "CCCP - Fedeli Alla Linea": "Punk",
    "Alien Sex Fiend": "Rock Alternativo", # Goth
    "Orchestral Manoeuvres In The Dark": "Pop",
    "OMD": "Pop",
    "Taste Of Sugar": "Eletronico",
    "Thomas Dolby": "Pop",
    "Divinyls": "Rock Alternativo",
    "Shinehead": "Pop", # Reggae
    "The Communards": "Pop",
    "Kim Carnes": "Pop",
    "Aslan": "Rock Alternativo",
    "Ziggy Marley": "Pop", # Reggae
    "Bad Company": "Rock Alternativo",
    "Bad Company (2)": "Rock Alternativo",
    "Weird Al Yankovic": "Pop" # Comedy
}

# Normalize function
def normalize_artist(name):
    if not name:
        return "Unknown"
    return str(name).strip()

# Load the file
with open('data/1988.json', 'r') as f:
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
with open('data/1988.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Updated {updated_count} entries.")
