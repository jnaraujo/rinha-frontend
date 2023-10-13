import { createContext } from "preact"
import { ReactNode } from "preact/compat"
import { useContext, useEffect, useRef } from "preact/hooks"

interface IJsonContext {
  isJsonValid(json: string): Promise<{
    isValid: boolean
    parsed: any
  }>
}

const JsonContext = createContext<IJsonContext>({} as IJsonContext)

export const useJson = () => useContext(JsonContext)

export function JsonProvider({ children }: { children: ReactNode }) {
  const worker = useRef<Worker | null>(null)

  useEffect(() => {
    worker.current = new Worker("/json.worker.js")

    return () => {
      worker.current?.terminate()
      worker.current = null
    }
  }, [])

  function isJsonValid(json: string) {
    return new Promise<{
      isValid: boolean
      parsed: any
    }>((resolve) => {
      if (!worker.current)
        return resolve({
          isValid: false,
          parsed: null,
        })

      const id = Math.random()

      worker.current?.postMessage({
        id,
        action: "validate",
        data: json,
      })

      worker.current.onmessage = (event) => {
        if (event.data.id !== id) return

        resolve({
          isValid: event.data.isValid,
          parsed: event.data.parsed,
        })
      }
    })
  }

  return (
    <JsonContext.Provider value={{ isJsonValid }}>
      {children}
    </JsonContext.Provider>
  )
}
