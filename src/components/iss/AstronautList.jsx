import { Users } from 'lucide-react'
import Skeleton from '../ui/Skeleton'

export default function AstronautList({ astronauts, loading }) {
  if (loading) {
    return (
      <div className="card p-4 animate-fade">
        <Skeleton height="16px" width="45%" className="mb-3" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} height="14px" width="75%" className="mb-2" />
        ))}
      </div>
    )
  }

  return (
    <div className="card p-4 animate-fade">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <Users size={15} />
        </div>
        <div>
          <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            People in Space
          </h3>
          <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            {astronauts.length} astronauts
          </p>
        </div>
      </div>
      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5">
        {astronauts.map((a, i) => (
          <div
            key={`${a.name}-${i}`}
            className="flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-colors text-xs"
            style={{ background: 'var(--bg-inset)' }}
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">👨‍🚀</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{a.name}</span>
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              {a.craft}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
