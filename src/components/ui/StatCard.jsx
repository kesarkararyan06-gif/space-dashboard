export default function StatCard({ icon: Icon, label, value, unit, color, delay = 0 }) {
  return (
    <div
      className="card-flat flex items-center gap-3 px-4 py-3 animate-slide"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}10`, color }}
      >
        <Icon size={17} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-wide uppercase truncate" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </p>
        <p className="text-base font-semibold truncate leading-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
          {value}
          {unit && (
            <span className="text-[10px] font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
