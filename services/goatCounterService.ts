/**
 * GoatCounter Service
 * Fetches total visit statistics from GoatCounter API
 */

const GOATCOUNTER_SITE = 'grooovio';
const GOATCOUNTER_API_URL = `https://${GOATCOUNTER_SITE}.goatcounter.com/api/v0`;

// Cache configuration
const CACHE_KEY = 'goatcounter_total_visits';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedData {
  count: number;
  timestamp: number;
}

interface GoatCounterTotalResponse {
  total: number;
  total_display: string;
}

/**
 * Fetches the total visit count from GoatCounter
 * Uses caching to avoid hitting rate limits
 */
export async function getTotalVisits(): Promise<number> {
  try {
    // Check cache first
    const cached = getCachedData();
    if (cached !== null) {
      return cached;
    }

    // Fetch from GoatCounter API
    // Note: Using the public counter endpoint which doesn't require authentication
    const response = await fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/counter/${encodeURIComponent('/')}.json`);
    
    // GoatCounter returns 404 if the path has no visits or is new, but still includes the JSON body
    // We should parse the body regardless of status if it's JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      if (!response.ok) {
        console.warn('GoatCounter API request failed:', response.status);
        return getFallbackCount();
      }
    }

    // Parse the count from string to number (API returns "count": "123")
    // If 404 and valid JSON with count "0", this will correctly return 0
    const countStr = data?.count;
    const totalCount = countStr ? parseInt(countStr.toString().replace(/,/g, ''), 10) : 0;

    if (isNaN(totalCount)) {
      return getFallbackCount();
    }

    // Cache the result
    setCachedData(totalCount);

    return totalCount;
  } catch (error) {
    console.error('Error fetching GoatCounter data:', error);
    return getFallbackCount();
  }
}

/**
 * Gets cached visit count if available and not expired
 */
function getCachedData(): number | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - data.timestamp < CACHE_DURATION) {
      return data.count;
    }

    // Cache expired
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Caches the visit count with timestamp
 */
function setCachedData(count: number): void {
  try {
    const data: CachedData = {
      count,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

/**
 * Returns a fallback count when API is unavailable
 * Uses the last cached value if available, otherwise returns 0
 */
function getFallbackCount(): number {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const data: CachedData = JSON.parse(cached);
      return data.count;
    }
  } catch (error) {
    console.error('Error reading fallback cache:', error);
  }
  return 0;
}
