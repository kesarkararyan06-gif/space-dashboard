/**
 * Calculate ISS speed in km/h using the Haversine formula for distance.
 * pos1 and pos2 should have latitude and longitude properties.
 * timeDiffSeconds is the time interval between measurements.
 */
export function calculateSpeed(pos1, pos2, timeDiffSeconds) {
  if (timeDiffSeconds <= 0) return 0

  const R = 6371 // Earth's radius in km
  const toRad = (deg) => (deg * Math.PI) / 180

  // Extract coordinates supporting both lat/lng and latitude/longitude
  const lat1 = pos1.lat ?? pos1.latitude
  const lon1 = pos1.lng ?? pos1.longitude
  const lat2 = pos2.lat ?? pos2.latitude
  const lon2 = pos2.lng ?? pos2.longitude

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // distance in km

  const speedKmh = (distance / timeDiffSeconds) * 3600

  // Guard against NaN/Infinity
  if (isNaN(speedKmh) || !isFinite(speedKmh)) return 0

  return speedKmh
}

/**
 * Format a Unix timestamp to a readable string.
 */
export function formatTimestamp(ts) {
  return new Date(ts * 1000).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

/**
 * Format a full datetime.
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Truncate text to a max length.
 */
export function truncate(str, max = 120) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

/**
 * localStorage helper with JSON serialisation.
 */
export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // quota exceeded — silently ignore
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  },
}
