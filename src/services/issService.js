import axios from 'axios'

const ISS_POSITION_URL = 'https://api.wheretheiss.at/v1/satellites/25544'
const ASTROS_URL = 'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json'
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'

/**
 * Fetch current ISS position.
 * Uses HTTPS-compatible API for production.
 */
export async function fetchISSPosition() {
  const { data } = await axios.get(ISS_POSITION_URL, { timeout: 10000 })
  return {
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
    velocity: data.velocity, // km/h
    timestamp: data.timestamp,
  }
}

/**
 * Fetch astronauts currently in space.
 * Uses HTTPS-compatible API for production.
 */
export async function fetchAstronauts() {
  const { data } = await axios.get(ASTROS_URL, { timeout: 10000 })
  return {
    count: data.number,
    people: data.people.map(p => ({
      name: p.name,
      craft: p.spacecraft || p.craft || 'ISS' // Map spacecraft to craft for UI compatibility
    })),
  }
}

/**
 * Reverse geocode to find nearest place name.
 */
export async function reverseGeocode(lat, lon) {
  try {
    const { data } = await axios.get(NOMINATIM_URL, {
      params: {
        format: 'json',
        lat,
        lon,
        zoom: 5,
        addressdetails: 1,
      },
      timeout: 5000,
      headers: {
        'User-Agent': 'SpaceDashboard/1.0',
      },
    })

    if (data && data.display_name) {
      return data.display_name.split(',').slice(0, 2).join(',').trim()
    }
    return 'Over the Ocean'
  } catch {
    return 'Unknown Location'
  }
}
