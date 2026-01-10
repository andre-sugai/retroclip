// using native fetch
// actually node usually has fetch in recent versions.

const API_KEY = 'tlwzyv5nkAyeBJzu7khW2SJTF9pXxuIz2lrvsVOb'
const BASE_URL = 'https://imvdb.com/api/v1'

async function testFetch() {
  try {
    const response = await fetch(`${BASE_URL}/search/videos?q=Michael+Jackson`, {
      headers: {
        'IMVDB-APP-KEY': API_KEY,
        'Accept': 'application/json'
      }
    })
    
    const data = await response.json()
    console.log(JSON.stringify(data, null, 2))
    
    // Also try to get specific video details to see sources
    if (data.results && data.results.length > 0) {
        const firstVideoId = data.results[0].id
        console.log(`Fetching details for video: ${firstVideoId}`)
        const detailResponse = await fetch(`${BASE_URL}/video/${firstVideoId}?include=sources`, {
            headers: {
                'IMVDB-APP-KEY': API_KEY,
                'Accept': 'application/json'
            }
        })
        const detailData = await detailResponse.json()
        console.log('Detail Data Source:', JSON.stringify(detailData.sources, null, 2))
    }

  } catch (err) {
    console.error(err)
  }
}

testFetch()
