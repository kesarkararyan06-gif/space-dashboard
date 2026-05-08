import { useEffect } from 'react'
import NewsGrid from '../components/news/NewsGrid'
import NewsChart from '../components/charts/NewsChart'
import { useNews } from '../hooks/useNews'

export default function NewsPage() {
  const {
    articles, allArticles, loading, error,
    loadNews, searchTerm, setSearchTerm,
    sortBy, setSortBy, refresh,
  } = useNews()

  useEffect(() => {
    loadNews()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Chart */}
      <NewsChart articles={allArticles} />

      {/* Grid */}
      <NewsGrid
        articles={articles}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onRefresh={refresh}
      />
    </div>
  )
}
