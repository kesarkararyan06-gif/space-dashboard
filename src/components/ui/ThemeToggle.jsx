import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
      style={{
        background: 'var(--bg-inset)',
        border: '1px solid var(--border-default)',
        color: 'var(--accent)',
      }}
      aria-label="Toggle theme"
      id="theme-toggle-btn"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
