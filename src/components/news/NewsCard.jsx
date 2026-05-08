import { useState } from 'react'
import { ExternalLink, Calendar, ChevronDown } from 'lucide-react'
import { formatDate, truncate } from '../../utils/helpers'

export default function NewsCard({ article, delay = 0 }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="card-flat overflow-hidden transition-all animate-slide cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Compact row */}
      <div className="flex items-center gap-3 p-3">
        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-inset)' }}>
          {article.image ? (
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <div
            className={`${article.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-lg`}
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            📰
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            <span className="font-medium" style={{ color: 'var(--accent)' }}>{article.source}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <Calendar size={9} />
              {formatDate(article.date)}
            </span>
          </div>
        </div>

        {/* Expand arrow */}
        <ChevronDown
          size={14}
          className="flex-shrink-0 transition-transform duration-200"
          style={{
            color: 'var(--text-tertiary)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>

      {/* Expandable detail */}
      <div className={`news-expand-content ${expanded ? 'open' : ''}`}>
        <div className="news-expand-inner">
          <div className="px-3 pb-3 pt-0 space-y-2">
            {/* Larger image if available */}
            {article.image && (
              <div className="rounded-lg overflow-hidden h-36">
                <img src={article.image} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {truncate(article.description, 250)}
            </p>
            <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                By {truncate(article.author, 20)}
              </span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-semibold transition-all hover:gap-1.5"
                style={{ color: 'var(--accent)' }}
                onClick={(e) => e.stopPropagation()}
              >
                Read More
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
