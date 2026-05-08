import {
  MapPin, Gauge, Clock, Navigation, Globe, Hash, RefreshCw
} from 'lucide-react'
import StatCard from '../ui/StatCard'
import Skeleton from '../ui/Skeleton'
import { formatTimestamp } from '../../utils/helpers'

export default function ISSStats({ issData, issSpeed, nearestPlace, issHistory, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card-flat p-4">
            <Skeleton height="12px" width="50%" className="mb-2" />
            <Skeleton height="20px" width="70%" />
          </div>
        ))}
      </div>
    )
  }

  const latestSpeed = issSpeed.length > 0 ? issSpeed[issSpeed.length - 1].speed : 0

  const stats = [
    { icon: MapPin, label: 'Latitude', value: issData?.latitude?.toFixed(4) || '—', color: '#5b5bf6' },
    { icon: Navigation, label: 'Longitude', value: issData?.longitude?.toFixed(4) || '—', color: '#7c5bf6' },
    { icon: Gauge, label: 'Speed', value: latestSpeed.toFixed(0), unit: 'km/h', color: '#22c55e' },
    { icon: Clock, label: 'Updated', value: issData?.timestamp ? formatTimestamp(issData.timestamp) : '—', color: '#f59e0b' },
    { icon: Globe, label: 'Location', value: nearestPlace || 'Locating…', color: '#06b6d4' },
    { icon: Hash, label: 'Tracked', value: issHistory.length, color: '#ec4899' },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Live Telemetry
        </h2>
        <button
          onClick={onRefresh}
          className="btn-ghost flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium"
          id="iss-refresh-btn"
        >
          <RefreshCw size={11} />
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 40} />
        ))}
      </div>
    </div>
  )
}
