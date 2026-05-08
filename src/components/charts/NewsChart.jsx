import { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#5b5bf6', '#7c5bf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#64748b']

export default function NewsChart({ articles }) {
  const [activeSource, setActiveSource] = useState(null)

  const chartData = useMemo(() => {
    const counts = {}
    articles.forEach((a) => {
      const src = a.source || 'Unknown'
      counts[src] = (counts[src] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [articles])

  if (chartData.length === 0) {
    return (
      <div className="card p-4 animate-fade">
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          News Sources
        </h3>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ height: '160px', background: 'var(--bg-inset)', color: 'var(--text-tertiary)' }}
        >
          <p className="text-[11px]">No data yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-4 animate-fade">
      <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        News Sources
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
            onClick={(e) => setActiveSource(activeSource === e.name ? null : e.name)}
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            {chartData.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={COLORS[i % COLORS.length]}
                opacity={activeSource && activeSource !== entry.name ? 0.25 : 1}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: 'var(--text-primary)',
            }}
          />
          <Legend
            formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{v}</span>}
            wrapperStyle={{ fontSize: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
