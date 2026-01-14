/**
 * GoatCounter Service
 * Fetches total visit statistics from GoatCounter API
 */

const GOATCOUNTER_SITE = 'grooovio';
const GOATCOUNTER_API_URL = `https://${GOATCOUNTER_SITE}.goatcounter.com/api/v0`;

// Cache configuration
const CACHE_KEY = 'goatcounter_total_visits_v2';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedData {
  count: number;
  timestamp: number;
}

interface GoatCounterTotalResponse {
  total: number;
  total_display: string;
}

export async function getTotalVisits(): Promise<number | null> {
  try {
    // Check cache first
    const cached = getCachedData();
    if (cached !== null) {
      return cached;
    }

    // Fetch from GoatCounter API
    const url = `https://${GOATCOUNTER_SITE}.goatcounter.com/counter/${encodeURIComponent('/')}.json`;
    
    let response;
    try {
      response = await fetch(url);
    } catch (e) {
      console.warn(`[GoatCounter] API blocked or network error for ${url}. AdBlocker might be active.`);
      return null;
    }
    
    if (!response.ok && response.status !== 404) {
      console.warn(`[GoatCounter] API error: ${response.status} for ${url}`);
      return null;
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('[GoatCounter] Failed to parse JSON:', e);
      return null;
    }

    const countStr = data?.count;
    if (countStr === undefined) return null;

    const totalCount = parseInt(countStr.toString().replace(/,/g, ''), 10);
    
    if (!isNaN(totalCount)) {
        console.log(`[GoatCounter] Fetched count for ${GOATCOUNTER_SITE}: ${totalCount}`);
        setCachedData(totalCount);
        return totalCount;
    }

    return null;
  } catch (error) {
    console.error('Error fetching GoatCounter data:', error);
    return null;
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
