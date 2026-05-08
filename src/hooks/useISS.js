import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchISSPosition, fetchAstronauts, reverseGeocode } from '../services/issService'
import { useDashboard } from '../context/DashboardContext'
import { calculateSpeed } from '../utils/helpers'
import toast from 'react-hot-toast'

const MAX_HISTORY = 15
const MAX_SPEED_HISTORY = 30
const POLL_INTERVAL = 15000
const GEOCODE_INTERVAL = 30000 // Geocode at most every 30s to avoid rate limits

export function useISS() {
  const { state, dispatch } = useDashboard()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Refs to avoid stale closures and prevent re-render loops ──
  const prevPositionRef = useRef(null)
  const historyRef = useRef([])
  const speedHistoryRef = useRef([])
  const intervalRef = useRef(null)
  const isFetchingRef = useRef(false)          // Prevent overlapping requests
  const lastGeocodeRef = useRef(0)             // Throttle geocoding
  const astronautsFetchedRef = useRef(false)   // Fetch astronauts only once

  // Keep refs in sync with context state (one-way: context → ref)
  useEffect(() => { historyRef.current = state.issHistory }, [state.issHistory])
  useEffect(() => { speedHistoryRef.current = state.issSpeed }, [state.issSpeed])

  /**
   * Fetch ISS position. Astronauts are fetched only once on mount.
   * All mutable data is read from refs to avoid re-creating this callback.
   */
  const fetchPosition = useCallback(async (isManual = false) => {
    // Guard: skip if a request is already in-flight
    if (isFetchingRef.current) return
    isFetchingRef.current = true

    try {
      setError(null)
      const position = await fetchISSPosition()

      dispatch({ type: 'SET_ISS_DATA', payload: position })

      // ── Update history (last 15 positions) ──
      const newHistory = [...historyRef.current, position].slice(-MAX_HISTORY)
      historyRef.current = newHistory
      dispatch({ type: 'SET_ISS_HISTORY', payload: newHistory })

      // ── Calculate speed using previous position ──
      const prev = prevPositionRef.current
      if (prev) {
        const timeDiff = position.timestamp - prev.timestamp
        const speed = calculateSpeed(prev, position, timeDiff)

        // Clamp to reasonable ISS speed range (0–30 000 km/h)
        const clampedSpeed = Math.min(Math.max(speed, 0), 30000)

        const newSpeedHistory = [
          ...speedHistoryRef.current,
          { time: position.timestamp, speed: clampedSpeed },
        ].slice(-MAX_SPEED_HISTORY)
        speedHistoryRef.current = newSpeedHistory
        dispatch({ type: 'SET_ISS_SPEED', payload: newSpeedHistory })
      }

      prevPositionRef.current = position

      // ── Reverse geocode (throttled) ──
      const now = Date.now()
      if (now - lastGeocodeRef.current >= GEOCODE_INTERVAL) {
        lastGeocodeRef.current = now
        reverseGeocode(position.latitude, position.longitude).then((place) => {
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
      isFetchingRef.current = false
    }
  }, [dispatch]) // dispatch is stable — no re-creation

  /**
   * Fetch astronauts — called only once on mount.
   */
  const fetchAstronautData = useCallback(async () => {
    if (astronautsFetchedRef.current) return
    astronautsFetchedRef.current = true
    try {
      const data = await fetchAstronauts()
      dispatch({ type: 'SET_ASTRONAUTS', payload: data.people })
    } catch (err) {
      console.warn('Failed to fetch astronauts:', err.message)
      astronautsFetchedRef.current = false // Allow retry
    }
  }, [dispatch])

  // ── Mount: initial fetch + interval ──
  useEffect(() => {
    // Fetch immediately
    fetchPosition()
    fetchAstronautData()

    // Poll ISS position every 15 seconds
    intervalRef.current = setInterval(() => {
      fetchPosition()
    }, POLL_INTERVAL)

    // Cleanup — prevents duplicate intervals from StrictMode double-mount
    return () => {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Empty deps: runs once on mount. fetchPosition/fetchAstronautData are stable.

  // ── Manual refresh (with debounce guard via isFetchingRef) ──
  const refresh = useCallback(() => {
    fetchPosition(true)
    // Also retry astronauts if the initial fetch failed
    if (!astronautsFetchedRef.current) fetchAstronautData()
  }, [fetchPosition, fetchAstronautData])

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
