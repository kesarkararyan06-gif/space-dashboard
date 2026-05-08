import axios from 'axios'

const ISS_POSITION_URL = '/iss-api/iss-now.json'
const ASTROS_URL = '/iss-api/astros.json'
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'

/**
 * Fetch current ISS position.
 */
export async function fetchISSPosition() {
  const { data } = await axios.get(ISS_POSITION_URL, { timeout: 10000 })
  if (data.message !== 'success') throw new Error('ISS API error')
  return {
    latitude: parseFloat(data.iss_position.latitude),
    longitude: parseFloat(data.iss_position.longitude),
    timestamp: data.timestamp,
  }
}

/**
 * Fetch astronauts currently in space.
 */
export async function fetchAstronauts() {
  const { data } = await axios.get(ASTROS_URL, { timeout: 10000 })
  if (data.message !== 'success') throw new Error('Astros API error')
  return {
    count: data.number,
    people: data.people,
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
