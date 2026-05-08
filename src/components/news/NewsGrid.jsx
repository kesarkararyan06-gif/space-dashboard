import { Search, RefreshCw, ArrowDownUp } from 'lucide-react'
import NewsCard from './NewsCard'
import Skeleton from '../ui/Skeleton'
import ErrorCard from '../ui/ErrorCard'

export default function NewsGrid({ articles, loading, error, searchTerm, setSearchTerm, sortBy, setSortBy, onRefresh }) {
  return (
    <div className="space-y-3 animate-fade">
      {/* Header + Controls */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Breaking News
        </h2>
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px]"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}
          >
            <Search size={11} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-[11px] w-24 sm:w-32"
              style={{ color: 'var(--text-primary)' }}
              id="news-search-input"
            />
          </div>
          <button
            onClick={() => setSortBy(sortBy === 'date' ? 'source' : 'date')}
            className="btn-ghost flex items-center gap-1 px-2 py-1.5 text-[11px]"
            id="news-sort-btn"
          >
            <ArrowDownUp size={10} />
            {sortBy === 'date' ? 'Date' : 'Source'}
          </button>
          <button
            onClick={onRefresh}
            className="btn-ghost flex items-center gap-1 px-2 py-1.5 text-[11px]"
            id="news-refresh-btn"
          >
            <RefreshCw size={10} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card-flat flex items-center gap-3 p-3">
              <Skeleton width="56px" height="56px" rounded="8px" />
              <div className="flex-1 space-y-1.5">
                <Skeleton height="12px" width="85%" />
                <Skeleton height="10px" width="45%" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && <ErrorCard message={error} onRetry={onRefresh} />}

      {/* Articles — stacked list */}
      {!loading && !error && (
        <>
          {articles.length === 0 ? (
            <div className="card p-6 text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {searchTerm ? 'No articles match your search.' : 'No articles available.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-0.5">
              {articles.map((a, i) => (
                <NewsCard key={`${a.title}-${i}`} article={a} delay={i * 40} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
