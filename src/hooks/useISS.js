import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchISSPosition, fetchAstronauts, reverseGeocode } from '../services/issService'
import { useDashboard } from '../context/DashboardContext'
import toast from 'react-hot-toast'

const MAX_HISTORY = 15
const MAX_SPEED_HISTORY = 30
const POLL_INTERVAL = 15000
const GEOCODE_MIN_DIST = 0.5 // Only geocode if ISS moved at least 0.5 degrees

export function useISS() {
  const { state, dispatch } = useDashboard()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Refs for polling safety and state tracking ──
  const isFetching = useRef(false)             // Primary request lock
  const lastPosition = useRef(null)            // For meaningful change check
  const lastGeocodeTime = useRef(0)            // Time throttle
  const astronautsFetched = useRef(false)      // Strictly fetch once

  // Refs to maintain state for callbacks without dependency loops
  const historyRef = useRef([])
  const speedHistoryRef = useRef([])

  useEffect(() => { historyRef.current = state.issHistory }, [state.issHistory])
  useEffect(() => { speedHistoryRef.current = state.issSpeed }, [state.issSpeed])

  /**
   * Core fetch function for ISS data.
   * Prevents overlapping calls and implements strict polling.
   */
  const fetchISSData = useCallback(async (isManual = false) => {
    // ── Request Protection: Prevent overlapping calls ──
    if (isFetching.current) return
    isFetching.current = true

    try {
      setError(null)
      const data = await fetchISSPosition()

      // ── Dispatch current position ──
      dispatch({ type: 'SET_ISS_DATA', payload: data })

      // ── Update history ──
      const newHistory = [...historyRef.current, data].slice(-MAX_HISTORY)
      dispatch({ type: 'SET_ISS_HISTORY', payload: newHistory })

      // ── Update speed history ──
      const newSpeedHistory = [
        ...speedHistoryRef.current,
        { time: data.timestamp, speed: data.velocity },
      ].slice(-MAX_SPEED_HISTORY)
      dispatch({ type: 'SET_ISS_SPEED', payload: newSpeedHistory })

      // ── Reverse Geocoding: Only run if coordinates change meaningfully ──
      const hasMovedSignificantly = !lastPosition.current ||
        Math.abs(data.latitude - lastPosition.current.latitude) > GEOCODE_MIN_DIST ||
        Math.abs(data.longitude - lastPosition.current.longitude) > GEOCODE_MIN_DIST

      const now = Date.now()
      const enoughTimePassed = now - lastGeocodeTime.current > 60000 // At most once per minute

      if (hasMovedSignificantly && enoughTimePassed) {
        lastGeocodeTime.current = now
        lastPosition.current = data
        reverseGeocode(data.latitude, data.longitude).then((place) => {
          dispatch({ type: 'SET_NEAREST_PLACE', payload: place })
        })
      }

      if (isManual) toast.success('ISS position updated!')
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      if (isManual) toast.error('Failed to update ISS position')
    } finally {
      // ── Cleanup: Ensure lock is always released ──
      isFetching.current = false
    }
  }, [dispatch])

  /**
   * Fetch Astronauts: Runs strictly once on mount.
   */
  const fetchInitialData = useCallback(async () => {
    if (astronautsFetched.current) return
    astronautsFetched.current = true
    try {
      const data = await fetchAstronauts()
      dispatch({ type: 'SET_ASTRONAUTS', payload: data.people })
    } catch (err) {
      console.warn('Astronaut API failed:', err.message)
      astronautsFetched.current = false // Allow retry on manual refresh
    }
  }, [dispatch])

  /**
   * Polling System: Initializes once on mount.
   */
  useEffect(() => {
    // Initial fetch
    fetchISSData()
    fetchInitialData()

    // ── Strict 15s Interval ──
    const interval = setInterval(() => {
      fetchISSData()
    }, POLL_INTERVAL)

    // ── Cleanup: Prevent duplicate intervals ──
    return () => clearInterval(interval)
  }, [fetchISSData, fetchInitialData])

  /**
   * Manual refresh handler.
   */
  const refresh = useCallback(() => {
    fetchISSData(true)
    if (!astronautsFetched.current) fetchInitialData()
  }, [fetchISSData, fetchInitialData])

  return {
    issData: state.issData,
    issHistory: state.issHistory,
    issSpeed: state.issSpeed,
    astronauts: state.astronauts,
    nearestPlace: state.nearestPlace,
    loading,
    error,
    refresh,
  }
}
