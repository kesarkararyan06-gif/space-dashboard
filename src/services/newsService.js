import axios from 'axios'
import { storage } from '../utils/helpers'

const NEWS_CACHE_KEY = 'space-dashboard-news-gnews'
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes
const BASE_URL = 'https://gnews.io/api/v4/top-headlines'

/**
 * Fetch news articles exclusively from GNews API (Top Headlines).
 * Uses VITE_GNEWS_API_KEY from environment variables.
 */
export async function fetchNews() {
  // Check cache first
  const cached = storage.get(NEWS_CACHE_KEY)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.articles
  }

  const apiKey = import.meta.env.VITE_GNEWS_API_KEY

  if (!apiKey) {
    throw new Error('GNews API key is missing. Please set VITE_GNEWS_API_KEY in your .env file.')
  }

  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        category: 'general',
        q: 'space OR NASA OR ISS', // Keep relevant keywords in headlines if possible
        lang: 'en',
        max: 10,
        apikey: apiKey,
      },
      timeout: 10000,
    })

    if (!data.articles) {
      throw new Error('Invalid response from GNews API')
    }

    const articles = data.articles.map((a) => ({
      title: a.title || 'Untitled Article',
      source: a.source?.name || 'Unknown Source',
      author: a.source?.name || 'Staff Writer',
      date: a.publishedAt || new Date().toISOString(),
      image: a.image || null,
      description: a.description || 'No description available.',
      url: a.url || '#',
    }))

    // Save to cache
    storage.set(NEWS_CACHE_KEY, { articles, timestamp: Date.now() })
    return articles
  } catch (err) {
    const status = err.response?.status
    let errorMessage = err.message

    if (status === 401) {
      errorMessage = 'Invalid GNews API key. Please check your .env file.'
    } else if (status === 403) {
      errorMessage = 'GNews API quota exceeded or forbidden.'
    } else if (status === 429) {
      errorMessage = 'Too many requests to GNews API. Please try again later.'
    }

    // Return cached data if available as a last resort
    if (cached) {
      console.warn('GNews API error, returning cached data:', errorMessage)
      return cached.articles
    }

    throw new Error(`Failed to fetch news: ${errorMessage}`)
  }
}

/**
 * Clear news cache.
 */
export function clearNewsCache() {
  storage.remove(NEWS_CACHE_KEY)
}
