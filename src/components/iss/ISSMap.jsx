import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

// Custom ISS marker icon
const issIcon = new L.DivIcon({
  html: `<div style="
    width: 32px; height: 32px;
    background: var(--map-marker-bg, #5b5bf6);
    border-radius: 50%;
    border: 2.5px solid #fff;
    box-shadow: 0 0 14px var(--map-marker-glow, rgba(91,91,246,0.35));
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    animation: breathe 2s ease-in-out infinite;
  ">🛰️</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
})

function FlyToISS({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.flyTo(position, map.getZoom(), { duration: 1.2 })
  }, [position, map])
  return null
}

export default function ISSMap({ issData, issHistory }) {
  const { theme } = useTheme()
  const position = issData ? [issData.latitude, issData.longitude] : [0, 0]
  const path = issHistory.map((p) => [p.latitude, p.longitude])

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  return (
    <div className="card overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
      <MapContainer
        center={position}
        zoom={3}
        style={{ height: '100%', minHeight: '340px', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        id="iss-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
        />
        {issData && (
          <>
            <FlyToISS position={position} />
            <Marker position={position} icon={issIcon}>
              <Popup>
                <div style={{ fontFamily: 'var(--font-sans)', padding: '2px 0' }}>
                  <strong style={{ fontSize: '13px' }}>🛰️ ISS Position</strong><br/>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {issData.latitude.toFixed(4)}°, {issData.longitude.toFixed(4)}°
                  </span>
                </div>
              </Popup>
            </Marker>
          </>
        )}
        {path.length > 1 && (
          <Polyline
            positions={path}
            pathOptions={{ color: 'var(--accent)', weight: 2, opacity: 0.6, dashArray: '6 4' }}
          />
        )}
      </MapContainer>
    </div>
  )
}
