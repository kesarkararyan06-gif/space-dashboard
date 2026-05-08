import { createContext, useContext, useReducer } from 'react'

const DashboardContext = createContext()

const initialState = {
  issData: null,
  issHistory: [],
  issSpeed: [],
  astronauts: [],
  newsArticles: [],
  nearestPlace: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ISS_DATA':
      return { ...state, issData: action.payload }
    case 'SET_ISS_HISTORY':
      return { ...state, issHistory: action.payload }
    case 'SET_ISS_SPEED':
      return { ...state, issSpeed: action.payload }
    case 'SET_ASTRONAUTS':
      return { ...state, astronauts: action.payload }
    case 'SET_NEWS':
      return { ...state, newsArticles: action.payload }
    case 'SET_NEAREST_PLACE':
      return { ...state, nearestPlace: action.payload }
    default:
      return state
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
