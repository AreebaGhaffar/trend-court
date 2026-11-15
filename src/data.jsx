import { createContext, useContext, useEffect, useState } from 'react'

const TrendsContext = createContext(null)

export function TrendsProvider({ children }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/trends.json')
      .then((r) => {
        if (!r.ok) throw new Error('trends.json could not be loaded')
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  if (error) {
    return (
      <main className="page">
        <h1>Evidence file missing</h1>
        <p>
          Trend Court reads every number from trends.json, and that file could not be
          loaded ({error}). Nothing is shown rather than inventing numbers.
        </p>
      </main>
    )
  }
  if (!data) return <main className="page"><p>Opening the court — loading trends.json…</p></main>
  return <TrendsContext.Provider value={data}>{children}</TrendsContext.Provider>
}

export function useTrends() {
  return useContext(TrendsContext)
}

export function defendantById(data, id) {
  return data.defendants.find((d) => d.id === id) || data.defendants[0]
}
