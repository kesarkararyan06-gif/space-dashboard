import { useEffect } from 'react'
import ISSMap from '../components/iss/ISSMap'
import ISSStats from '../components/iss/ISSStats'
import AstronautList from '../components/iss/AstronautList'
import SpeedChart from '../components/charts/SpeedChart'
import { useISS } from '../hooks/useISS'
import ErrorCard from '../components/ui/ErrorCard'

export default function ISSPage() {
  const {
    issData, issHistory, issSpeed, astronauts, nearestPlace,
    loading, error, refresh,
  } = useISS()

  if (error && !issData) {
    return <ErrorCard message={error} onRetry={refresh} />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <ISSStats
        issData={issData}
        issSpeed={issSpeed}
        nearestPlace={nearestPlace}
        issHistory={issHistory}
        loading={loading}
        onRefresh={refresh}
      />

      {/* Map + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ISSMap issData={issData} issHistory={issHistory} />
        </div>
        <div className="space-y-4">
          <AstronautList astronauts={astronauts} loading={loading} />
        </div>
      </div>

      {/* Speed Chart */}
      <SpeedChart speedData={issSpeed} />
    </div>
  )
}
