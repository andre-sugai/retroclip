import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import YouTube from 'react-youtube'
import { ChevronRight, ChevronLeft, PanelRightOpen, PanelRightClose } from 'lucide-react'
import './App.css'

function App() {
  const [videos, setVideos] = useState([])
  const [currentVideo, setCurrentVideo] = useState(null)
  const [selectedDecade, setSelectedDecade] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [filterMode, setFilterMode] = useState('decade') // 'decade' | 'year'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    console.log('Fetching videos...')
    const { data, error } = await supabase
      .from('videos')
      .select('*')
    
    if (error) {
      console.error('Error fetching videos:', error)
    } else {
        console.log('Videos fetched:', data)
      setVideos(data)
    }
  }

  const handlePlayTv = () => {
      if (filteredVideos.length > 0) {
          // Play a random video from the CURRENT filtered list
          const randomIndex = Math.floor(Math.random() * filteredVideos.length)
          setCurrentVideo(filteredVideos[randomIndex])
      } else {
          alert('No videos found with current filters!')
      }
  }

  // Get unique years from videos for the year selector
  const availableYears = [...new Set(videos.map(v => v.year))].sort((a, b) => b - a)

  // Filter videos based on selection
  const filteredVideos = videos.filter(v => {
    if (filterMode === 'decade') {
       if (selectedDecade === 'all') return true;
       const decadeStart = parseInt(selectedDecade)
       return v.year >= decadeStart && v.year < decadeStart + 10
    } else {
       // Year mode
       if (selectedYear === 'all') return true;
       return v.year === parseInt(selectedYear)
    }
  })

  return (
    <div className={`main-container ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Setor 1: Video Player */}
      <div className="sector-1">
        <button 
            className="toggle-sidebar-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
            {isSidebarOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
        {currentVideo ? (
           <YouTube
            videoId={currentVideo.youtube_id}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
              },
            }}
            className="youtube-player"
            onEnd={() => handlePlayTv()} // Auto play next
          />
        ) : (
          <div className="placeholder">
            <h2>Select a video or click Play</h2>
          </div>
        )}
      </div>

      {/* Setor 2: Year/Decade Selector */}
      <div className="sector-2">
        <div className="sidebar-content-wrapper">
            <h3>Filter</h3>
            
            <div className="filter-mode-toggle">
                <label>
                    <input 
                        type="radio" 
                        name="filterMode" 
                        value="decade" 
                        checked={filterMode === 'decade'}
                        onChange={(e) => setFilterMode(e.target.value)}
                    /> Decade
                </label>
                <label>
                    <input 
                        type="radio" 
                        name="filterMode" 
                        value="year" 
                        checked={filterMode === 'year'}
                        onChange={(e) => setFilterMode(e.target.value)}
                    /> Year
                </label>
            </div>

            {filterMode === 'decade' ? (
                <select 
                    value={selectedDecade} 
                    onChange={(e) => setSelectedDecade(e.target.value)}
                    className="decade-selector"
                >
                    <option value="all">All Decades</option>
                    <option value="1980">1980s</option>
                    <option value="1990">1990s</option>
                    <option value="2000">2000s</option>
                    <option value="2010">2010s</option>
                    <option value="2020">2020s</option>
                </select>
            ) : (
                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="year-selector"
                >
                    <option value="all">All Years</option>
                    {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            )}
        </div>
      </div>

      {/* Setor 3: Play Button & Info */}
      <div className="sector-3">
        <div className="sidebar-content-wrapper">
            <button className="play-btn" onClick={handlePlayTv}>
            PLAY TV
            </button>
            
            {currentVideo && (
                <div className="video-info">
                    <h3>{currentVideo.title}</h3>
                    <p>{currentVideo.artist}</p>
                    <small>{currentVideo.year}</small>
                </div>
            )}

            <div className="playlist-test">
                <h3>Playlist ({filteredVideos.length})</h3>
                <div className="playlist-items">
                    {filteredVideos.map(video => (
                        <div 
                            key={video.id} 
                            className={`list-item ${currentVideo?.id === video.id ? 'active' : ''}`}
                            onClick={() => setCurrentVideo(video)}
                        >
                            <span className="video-title">{video.title}</span>
                            <span className="video-artist"> - {video.artist}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default App
