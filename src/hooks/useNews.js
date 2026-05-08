import { useState, useCallback } from 'react'
import { fetchNews, clearNewsCache } from '../services/newsService'
import { useDashboard } from '../context/DashboardContext'
import toast from 'react-hot-toast'

export function useNews() {
  const { state, dispatch } = useDashboard()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')

  const loadNews = useCallback(async (isManual = false) => {
    try {
      setLoading(true)
      setError(null)
      if (isManual) clearNewsCache()
      const articles = await fetchNews()
      dispatch({ type: 'SET_NEWS', payload: articles })
      if (isManual) toast.success('News refreshed!')
    } catch (err) {
      setError(err.message)
      if (isManual) toast.error('Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  // Filter and sort articles
  const filteredArticles = state.newsArticles
    .filter((a) => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return (
        a.title?.toLowerCase().includes(term) ||
        a.description?.toLowerCase().includes(term) ||
        a.source?.toLowerCase().includes(term)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'source') return (a.source || '').localeCompare(b.source || '')
      return 0
    })

  return {
    articles: filteredArticles,
    allArticles: state.newsArticles,
    loading,
    error,
    loadNews,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    refresh: () => loadNews(true),
  }
}
