import json

# Mapping of artists to genres for 1987
genre_mapping = {
    # Pop
    "Madonna": "Pop",
    "Michael Jackson": "Pop",
    "Whitney Houston": "Pop",
    "Janet Jackson": "Pop",
    "George Michael": "Pop",
    "Tiffany": "Pop",
    "Debbie Gibson": "Pop",
    "Belinda Carlisle": "Pop",
    "Kylie Minogue": "Pop",
    "Rick Astley": "Pop",
    "Bananarama": "Pop",
    "Exposé": "Pop",
    "Lisa Lisa & Cult Jam": "Pop",
    "Taylor Dayne": "Pop",
    "Jody Watley": "Pop",
    "Gloria Estefan": "Pop",
    "Miami Sound Machine": "Pop",
    "Swing Out Sister": "Pop",
    "Simply Red": "Pop",
    "Level 42": "Pop",
    "Huey Lewis": "Pop",
    "Kenny Loggins": "Pop",
    "Richard Marx": "Pop",
    "Steve Winwood": "Pop",
    "Starship": "Pop",
    "Chicago": "Pop",
    "Fleetwood Mac": "Pop",
    "Toto": "Pop",
    "Foreigner": "Pop",
    "Heart": "Pop",
    "Roxette": "Pop",
    "Eurythmics": "Pop",
    "Pet Shop Boys": "Pop",
    "Erasure": "Pop",
    "A-ha": "Pop",
    "a-ha": "Pop",
    "Alphaville": "Pop",
    "Modern Talking": "Pop",
    "Sandra": "Pop",
    "C.C. Catch": "Pop",
    "Falco": "Pop",
    "Desireless": "Pop",
    "France Gall": "Pop",
    "Vanessa Paradis": "Pop",
    "Sabrina": "Pop",
    "Samantha Fox": "Pop",
    "Kim Wilde": "Pop",
    "Mel & Kim": "Pop",
    "Bros": "Pop",
    "Wet Wet Wet": "Pop",
    "Curiosity Killed The Cat": "Pop",
    "Living In A Box": "Pop",
    "Johnny Hates Jazz": "Pop",
    "Climie Fisher": "Pop",
    "T'Pau": "Pop",
    "Go West": "Pop",
    "The Communards": "Pop",
    "The Christians": "Pop",
    "Black": "Pop",
    "Terence Trent D'Arby": "Pop",
    "Sananda Maitreya": "Pop",
    "Prince": "Pop",
    "Sheila E.": "Pop",
    "The Bangles": "Pop",
    "Cyndi Lauper": "Pop",
    "The Jets": "Pop",
    "Atlantic Starr": "Pop",
    "The Whispers": "Pop",
    "Club Nouveau": "Pop",
    "LeVert": "Pop",
    "Smokey Robinson": "Pop",
    "Aretha Franklin": "Pop",
    "Dionne Warwick": "Pop",
    "Barbra Streisand": "Pop",
    "Linda Ronstadt": "Pop",
    "Carly Simon": "Pop",
    "Cher": "Pop",
    "Bette Midler": "Pop",
    
    # Rock / Alternativo
    "U2": "Rock Alternativo",
    "R.E.M.": "Rock Alternativo",
    "The Cure": "Rock Alternativo",
    "The Smiths": "Rock Alternativo",
    "Depeche Mode": "Rock Alternativo",
    "New Order": "Rock Alternativo",
    "INXS": "Rock Alternativo",
    "Midnight Oil": "Rock Alternativo",
    "The Jesus And Mary Chain": "Rock Alternativo",
    "Sonic Youth": "Rock Alternativo",
    "Dinosaur Jr.": "Rock Alternativo",
    "Pixies": "Rock Alternativo",
    "Echo & The Bunnymen": "Rock Alternativo",
    "Siouxsie & The Banshees": "Rock Alternativo",
    "The Cult": "Rock Alternativo",
    "Love And Rockets": "Rock Alternativo",
    "The Sisters Of Mercy": "Rock Alternativo",
    "The Mission": "Rock Alternativo",
    "Gene Loves Jezebel": "Rock Alternativo",
    "The Psychedelic Furs": "Rock Alternativo",
    "XTC": "Rock Alternativo",
    "Squeeze": "Rock Alternativo",
    "Crowded House": "Rock Alternativo",
    "Split Enz": "Rock Alternativo",
    "Hoodoo Gurus": "Rock Alternativo",
    "The Church": "Rock Alternativo",
    "10,000 Maniacs": "Rock Alternativo",
    "Suzanne Vega": "Rock Alternativo",
    "Tracy Chapman": "Rock Alternativo",
    "Sinead O'Connor": "Rock Alternativo",
    "Sinéad O'Connor": "Rock Alternativo",
    "Bruce Springsteen": "Rock Alternativo",
    "Bryan Adams": "Rock Alternativo",
    "John Mellencamp": "Rock Alternativo",
    "Tom Petty": "Rock Alternativo",
    "Tom Petty And The Heartbreakers": "Rock Alternativo",
    "Bob Seger": "Rock Alternativo",
    "The Georgia Satellites": "Rock Alternativo",
    "The Fabulous Thunderbirds": "Rock Alternativo",
    "Los Lobos": "Rock Alternativo",
    "Billy Idol": "Rock Alternativo",
    "The Cars": "Rock Alternativo",
    "Talking Heads": "Rock Alternativo",
    "Peter Gabriel": "Rock Alternativo",
    "Sting": "Rock Alternativo",
    "Paul Simon": "Rock Alternativo",
    "Steve Earle": "Rock Alternativo", # Or Country
    "Chris Isaak": "Rock Alternativo",
    "The Replacements": "Rock Alternativo",
    "Hüsker Dü": "Rock Alternativo",
    "The Pogues": "Rock Alternativo",
    "The Proclaimers": "Rock Alternativo",
    "Violent Femmes": "Rock Alternativo",
    "They Might Be Giants": "Rock Alternativo",
    "Camper Van Beethoven": "Rock Alternativo",
    "Meat Puppets": "Rock Alternativo",
    "Butthole Surfers": "Rock Alternativo",
    "Big Black": "Rock Alternativo",
    "Fugazi": "Rock Alternativo",
    "Bad Brains": "Rock Alternativo",
    "Suicidal Tendencies": "Rock Alternativo", # Crossover Thrash
    
    # Metal / Hard Rock
    "Guns N' Roses": "Metal",
    "Whitesnake": "Metal",
    "Def Leppard": "Metal",
    "Bon Jovi": "Metal",
    "Aerosmith": "Metal",
    "Mötley Crüe": "Metal",
    "Poison": "Metal",
    "Cinderella": "Metal",
    "Dokken": "Metal",
    "Ratt": "Metal",
    "Great White": "Metal",
    "Twisted Sister": "Metal",
    "Quiet Riot": "Metal",
    "W.A.S.P.": "Metal",
    "Danzig": "Metal", 
    "Metallica": "Metal",
    "Megadeth": "Metal",
    "Slayer": "Metal",
    "Anthrax": "Metal",
    "Iron Maiden": "Metal",
    "Judas Priest": "Metal",
    "Motorhead": "Metal",
    "Motörhead": "Metal",
    "Ozzy Osbourne": "Metal",
    "Dio": "Metal",
    "Scorpions": "Metal",
    "Europe": "Metal",
    "Helloween": "Metal",
    "Testament": "Metal",
    "Exodus": "Metal",
    "Overkill": "Metal",
    "Death": "Metal",
    "Napalm Death": "Metal",
    "Sepultura": "Metal",
    "Kreator": "Metal",
    "Sodom": "Metal",
    "Destruction": "Metal",
    "Celtic Frost": "Metal",
    "Bathory": "Metal",
    "King Diamond": "Metal",
    "Mercyful Fate": "Metal",
    "Manowar": "Metal",
    "Queensrÿche": "Metal",
    "Fates Warning": "Metal",
    "Van Halen": "Metal",
    "Kiss": "Metal",
    "Alice Cooper": "Metal",
    "Tesla": "Metal",
    "L.A. Guns": "Metal",
    "Faster Pussycat": "Metal",
    "Vixen": "Metal",
    "Lita Ford": "Metal",
    "Skid Row": "Metal",
    "Warrant": "Metal",
    "Night Ranger": "Metal",
    "Survivor": "Metal", # Or Pop Rock
    "REO Speedwagon": "Metal", # Or Pop Rock
    "Journey": "Metal", # Or Pop Rock
    "Stryper": "Metal",
    
    # Rap / Hip Hop
    "Run-D.M.C.": "Rap",
    "Run-DMC": "Rap",
    "Beastie Boys": "Rap",
    "LL Cool J": "Rap",
    "Public Enemy": "Rap",
    "Eric B. & Rakim": "Rap",
    "Boogie Down Productions": "Rap",
    "KRS-One": "Rap",
    "Salt-N-Pepa": "Rap",
    "Salt 'N' Pepa": "Rap",
    "Ice-T": "Rap",
    "N.W.A": "Rap", # 1988 mostly, but maybe late 87
    "Eazy-E": "Rap",
    "Schoolly D": "Rap",
    "Big Daddy Kane": "Rap",
    "Biz Markie": "Rap",
    "DJ Jazzy Jeff & The Fresh Prince": "Rap",
    "Fat Boys": "Rap",
    "Heavy D & The Boyz": "Rap",
    "Heavy D. & The Boyz": "Rap",
    "Whodini": "Rap",
    "Doug E. Fresh": "Rap",
    "Slick Rick": "Rap",
    "Kool Moe Dee": "Rap",
    "Mantronix": "Rap",
    "Stetsasonic": "Rap",
    "Too $hort": "Rap",
    "The D.O.C.": "Rap",
    "Grandmaster Flash": "Rap",
    "Afrika Bambaataa": "Rap",
    "Tone-Loc": "Rap",
    "Young MC": "Rap",
    "Rob Base & DJ E-Z Rock": "Rap",
    "J.J. Fad": "Rap",
    "MC Hammer": "Rap", # Early
    
    # Eletronico / Dance
    "M/A/R/R/S": "Eletronico",
    "Bomb The Bass": "Eletronico",
    "S'Express": "Eletronico",
    "Coldcut": "Eletronico",
    "Inner City": "Eletronico",
    "Technotronic": "Eletronico", # 1989 mostly
    "Black Box": "Eletronico", # 1989
    "Soul II Soul": "Eletronico", # 1989
    "808 State": "Eletronico",
    "A Guy Called Gerald": "Eletronico",
    "Phuture": "Eletronico",
    "Model 500": "Eletronico",
    "Derrick May": "Eletronico",
    "Juan Atkins": "Eletronico",
    "Kevin Saunderson": "Eletronico",
    "Frankie Knuckles": "Eletronico",
    "Marshall Jefferson": "Eletronico",
    "Mr. Fingers": "Eletronico",
    "Kraftwerk": "Eletronico",
    "Yello": "Eletronico",
    "Art of Noise": "Eletronico",
    "Front 242": "Eletronico",
    "Nitzer Ebb": "Eletronico",
    "Skinny Puppy": "Eletronico",
    "Ministry": "Eletronico", # Industrial
    "KMFDM": "Eletronico",
    "Nine Inch Nails": "Eletronico", # 1989
    "Coil": "Eletronico",
    "Die Krupps": "Eletronico",
    "Laibach": "Eletronico",
    "Information Society": "Eletronico",
    "Kon Kan": "Eletronico",
    "When In Rome": "Eletronico",
    "Camouflage": "Eletronico",
    "Book of Love": "Eletronico",
    "Red Flag": "Eletronico",
    "Anything Box": "Eletronico",
    "Celebrate the Nun": "Eletronico",
    
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
    "The Forester Sisters": "Country",
    "Highway 101": "Country",
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
    
    # Punk
    "The Ramones": "Punk",
    "Ramones": "Punk",
    "Bad Religion": "Punk",
    "Descendents": "Punk",
    "Dead Kennedys": "Punk",
    "Minor Threat": "Punk", # Earlier, but influence remains
    "Black Flag": "Punk",
    "Circle Jerks": "Punk",
    "Misfits": "Punk",
    "Social Distortion": "Punk",
    "The Clash": "Punk", # Split in 86, but still relevant
    "Siouxsie and the Banshees": "Punk", # Post-punk
    "The Damned": "Punk",
    "Buzzcocks": "Punk",
    "Generation X": "Punk",
    "X": "Punk",
    "The Germs": "Punk",
    "Fear": "Punk",
    "Agent Orange": "Punk",
    "T.S.O.L.": "Punk",
    "Minutemen": "Punk",
    "Husker Du": "Punk", # Alt Rock / Punk
    "Dag Nasty": "Punk",
    "Gorilla Biscuits": "Punk",
    "Youth of Today": "Punk",
    "7 Seconds": "Punk",
    "Operation Ivy": "Punk", # Late 80s
    "Green Day": "Punk", # Started late 80s
    "The Offspring": "Punk", # Started late 80s
    "NOFX": "Punk",
    "Pennywise": "Punk",
    "Fugazi": "Punk", # Post-hardcore
    "Rites of Spring": "Punk", # Emo/Post-hardcore
    "Didgits": "Punk",
    "Big Black": "Punk",
    
    # New additions
    "Big Trouble House": "Rock Alternativo",
    "The Blow Monkeys": "Pop",
    "Cutting Crew": "Pop",
    "The Hooters": "Rock Alternativo",
    "Loverboy": "Rock Alternativo", # or Pop Rock
    "The Grateful Dead": "Rock Alternativo", # Classic Rock / Jam Band
    "Mr. Mister": "Pop",
    "David Bowie": "Rock Alternativo", # Pop / Rock
    "Spagna": "Pop", # Italo Disco
    "John Norum": "Metal", # Europe guitarist
    "Icehouse": "Rock Alternativo", # New Wave
    "Alison Moyet": "Pop",
    "ABC": "Pop", # New Wave
    "Indochine": "Rock Alternativo", # New Wave
    "Angela Winbush": "Pop", # R&B
    "Cliff Richard": "Pop",
    "Corey Hart": "Pop",
    "Then Jerico": "Rock Alternativo",
    "The The": "Rock Alternativo",
    "Full Force (3)": "Rap", # R&B / Hip Hop
    "Basia": "Pop", # Jazz Pop
    "Enya": "Pop", # New Age
    "Bee Gees": "Pop",
    "The Outfield": "Pop",
    "Patty Smyth": "Pop",
    "Thompson Twins": "Pop",
    "Men Without Hats": "Pop", # Synth-pop
    "Mason Ruffner": "Rock Alternativo", # Blues Rock
    "Deep Purple": "Metal",
    "Andy Taylor": "Rock Alternativo",
    "The Rainmakers": "Rock Alternativo",
    "Rush": "Rock Alternativo", # Prog Rock
    "Duran Duran": "Pop",
    "Jennifer Rush": "Pop",
    "Buster Poindexter": "Pop",
    "Timbuk 3": "Rock Alternativo",
    "The Tragically Hip": "Rock Alternativo",
    "Blue Rodeo": "Country", # Country Rock
    "Keith Sweat": "Pop", # R&B
    "Pink Floyd": "Rock Alternativo", # Prog Rock
    "Supertramp": "Rock Alternativo",
    "Farrenheit": "Rock Alternativo",
    "Genesis": "Pop", # Prog / Pop
    "Public Image Limited": "Rock Alternativo",
    "Eddie Money": "Rock Alternativo",
    "Doctor & The Medics": "Rock Alternativo",
    "Jimmy Barnes": "Rock Alternativo",
    "George Harrison": "Pop",
    "Was (Not Was)": "Pop",
    "Carmel": "Pop"
}

# Normalize function
def normalize_artist(name):
    if not name:
        return "Unknown"
    return str(name).strip()

# Load the file
with open('data/1987.json', 'r') as f:
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
    # Check if artist contains mapped artist (e.g. "Feat.")
    else:
        for mapped_artist, genre in genre_mapping.items():
            if mapped_artist in artist:
                 item['artist_genre'] = genre
                 updated_count += 1
                 break

# Save back to file
with open('data/1987.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Updated {updated_count} entries.")
