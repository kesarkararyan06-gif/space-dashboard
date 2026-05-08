import { useState, useEffect } from 'react'
import { Satellite, Newspaper, Rocket, Menu, X } from 'lucide-react'
import ThemeToggle from './components/ui/ThemeToggle'
import ISSMap from './components/iss/ISSMap'
import ISSStats from './components/iss/ISSStats'
import AstronautList from './components/iss/AstronautList'
import NewsGrid from './components/news/NewsGrid'
import NewsChart from './components/charts/NewsChart'
import SpeedChart from './components/charts/SpeedChart'
import ChatBot from './components/chatbot/ChatBot'
import ErrorCard from './components/ui/ErrorCard'
import { useISS } from './hooks/useISS'
import { useNews } from './hooks/useNews'

const TABS = [
  { id: 'iss', label: 'ISS Tracker', icon: Satellite },
  { id: 'news', label: 'News', icon: Newspaper },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('iss')
  const [mobileMenu, setMobileMenu] = useState(false)

  // ISS data
  const {
    issData, issHistory, issSpeed, astronauts, nearestPlace,
    loading: issLoading, error: issError, refresh: issRefresh,
  } = useISS()

  // News data
  const {
    articles, allArticles, loading: newsLoading, error: newsError,
    loadNews, searchTerm, setSearchTerm, sortBy, setSortBy,
    refresh: newsRefresh,
  } = useNews()

  useEffect(() => { loadNews() }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>

      {/* ══════════════════════════════════════════════
          HEADER
         ══════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'var(--sidebar-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center animate-float"
                style={{
                  background: 'var(--accent)',
                  boxShadow: `0 0 12px var(--accent-glow)`,
                }}
              >
                <Rocket size={15} color="#fff" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
                  Space Dashboard
                </h1>
                <p className="text-[9px] font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  Live ISS · News · AI
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex items-center gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background: active ? 'var(--accent-soft)' : 'transparent',
                      color: active ? 'var(--accent)' : 'var(--text-secondary)',
                      border: active ? '1px solid var(--border-hover)' : '1px solid transparent',
                    }}
                    id={`tab-${tab.id}`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
                id="mobile-menu-btn"
              >
                {mobileMenu ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenu && (
            <div className="sm:hidden pb-2.5 animate-fade">
              <div className="flex gap-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setMobileMenu(false) }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
                      style={{
                        background: active ? 'var(--accent-soft)' : 'var(--bg-card)',
                        color: active ? 'var(--accent)' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <Icon size={13} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT — 2-column dashboard
         ══════════════════════════════════════════════ */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-6 py-5">

        {/* ── ISS TAB ── */}
        {activeTab === 'iss' && (
          <div className="animate-fade">
            {issError && !issData ? (
              <ErrorCard message={issError} onRetry={issRefresh} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* LEFT COLUMN — map dominant */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Stats row */}
                  <ISSStats
                    issData={issData}
                    issSpeed={issSpeed}
                    nearestPlace={nearestPlace}
                    issHistory={issHistory}
                    loading={issLoading}
                    onRefresh={issRefresh}
                  />

                  {/* Map — tall */}
                  <div style={{ height: 'clamp(320px, 50vh, 500px)' }}>
                    <ISSMap issData={issData} issHistory={issHistory} />
                  </div>

                  {/* News section below map */}
                  <NewsGrid
                    articles={articles}
                    loading={newsLoading}
                    error={newsError}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onRefresh={newsRefresh}
                  />
                </div>

                {/* RIGHT COLUMN — charts + astronauts */}
                <div className="lg:col-span-4 space-y-4">
                  <SpeedChart speedData={issSpeed} />
                  <NewsChart articles={allArticles} />
                  <AstronautList astronauts={astronauts} loading={issLoading} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NEWS TAB (full-width detail view) ── */}
        {activeTab === 'news' && (
          <div className="animate-fade space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <NewsGrid
                  articles={articles}
                  loading={newsLoading}
                  error={newsError}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onRefresh={newsRefresh}
                />
              </div>
              <div>
                <NewsChart articles={allArticles} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Chatbot ── */}
      <ChatBot />

      {/* ── Footer ── */}
      <footer
        className="text-center py-3.5 text-[10px]"
        style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)' }}
      >
        Space Dashboard © {new Date().getFullYear()} · Powered by Open APIs & AI
      </footer>
    </div>
  )
}
