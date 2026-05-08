import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorCard({ message, onRetry }) {
  return (
    <div
      className="card flex flex-col items-center justify-center gap-4 p-8 text-center animate-fade"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)' }}
      >
        <AlertTriangle size={20} />
      </div>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {message || 'Something went wrong'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-accent flex items-center gap-2 px-4 py-2 text-xs font-medium">
          <RefreshCw size={13} />
          Retry
        </button>
      )}
    </div>
  )
}
