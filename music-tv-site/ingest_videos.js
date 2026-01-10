
import { createClient } from '@supabase/supabase-js'

// Configuration
const IMVDB_KEY = 'tlwzyv5nkAyeBJzu7khW2SJTF9pXxuIz2lrvsVOb'
const SUPABASE_URL = 'https://enyevbcvignhhgccufxu.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVueWV2YmN2aWduaGhnY2N1Znh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjU2NzgsImV4cCI6MjA4MzYwMTY3OH0.0RAtlBB9fe0LbytjnWzBs5V6NRoCvyoRc0L4p1eSO8Q'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const ARTISTS = [
    // 80s
    'Michael Jackson', 'Madonna', 'Queen', 'Prince', 'Whitney Houston',
    // 90s
    'Nirvana', 'Britney Spears', 'Backstreet Boys', 'Tupac', 'Spice Girls',
    // 00s
    'Beyonce', 'Eminem', 'Linkin Park', 'Lady Gaga', 'Rihanna',
    // 10s
    'Taylor Swift', 'Drake', 'Adele', 'Justin Bieber', 'Katy Perry',
    // 20s
    'The Weeknd', 'Dua Lipa', 'BTS', 'Olivia Rodrigo', 'Doja Cat'
]

async function ingest() {
    console.log('Starting ingestion...')

    for (const artist of ARTISTS) {
        console.log(`\nSearching for: ${artist}`)
        try {
            // 1. Search for videos
            const searchResp = await fetch(`https://imvdb.com/api/v1/search/videos?q=${encodeURIComponent(artist)}`, {
                headers: { 'IMVDB-APP-KEY': IMVDB_KEY, 'Accept': 'application/json' }
            })
            const searchData = await searchResp.json()

            if (!searchData.results) continue

            // Take top 5 videos per artist to ensure variety
            const videosToProcess = searchData.results.slice(0, 5)

            for (const vid of videosToProcess) {
                // Check if already exists to skip (optional, but good)
                const { data: existing } = await supabase.from('videos').select('id').eq('imvdb_id', String(vid.id)).single()
                if (existing) {
                    process.stdout.write('.')
                    continue
                }

                // 2. Fetch Details for YouTube ID
                const detailResp = await fetch(`https://imvdb.com/api/v1/video/${vid.id}?include=sources`, {
                    headers: { 'IMVDB-APP-KEY': IMVDB_KEY, 'Accept': 'application/json' }
                })
                const detailData = await detailResp.json()

                const youtubeSource = detailData.sources?.find(s => s.source === 'youtube')

                if (youtubeSource) {
                    const videoRecord = {
                        imvdb_id: String(vid.id),
                        title: vid.song_title,
                        artist: vid.artists[0]?.name || artist,
                        year: vid.year,
                        youtube_id: youtubeSource.source_data,
                        data: detailData
                    }

                    const { error } = await supabase.from('videos').upsert(videoRecord)
                    if (error) console.error('Supabase Error:', error)
                    else process.stdout.write('+')
                } else {
                    process.stdout.write('x')
                }
            }
        } catch (e) {
            console.error(`Error processing ${artist}:`, e)
        }
    }
    console.log('\nIngestion complete!')
}

ingest()
