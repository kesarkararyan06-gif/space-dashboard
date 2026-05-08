export default function Skeleton({ className = '', width, height, rounded = '8px' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height: height || '16px', borderRadius: rounded }}
    />
  )
}
