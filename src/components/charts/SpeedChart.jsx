import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatTimestamp } from '../../utils/helpers'

export default function SpeedChart({ speedData }) {
  const chartData = speedData.map((d) => ({
    time: formatTimestamp(d.time),
    speed: Math.round(d.speed),
  }))

  if (chartData.length < 2) {
    return (
      <div className="card p-4 animate-fade">
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          ISS Speed Trend
        </h3>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ height: '160px', background: 'var(--bg-inset)', color: 'var(--text-tertiary)' }}
        >
          <p className="text-[11px]">Collecting data… ({chartData.length}/2 points)</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-4 animate-fade">
      <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        ISS Speed Trend
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="speedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-line)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--chart-line)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="time" tick={{ fontSize: 9 }} interval="preserveStartEnd" stroke="var(--text-tertiary)" />
          <YAxis tick={{ fontSize: 9 }} stroke="var(--text-tertiary)" width={40} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-md)',
            }}
          />
          <Area
            type="monotone"
            dataKey="speed"
            stroke="var(--chart-line)"
            fill="url(#speedFill)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: 'var(--chart-line)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
