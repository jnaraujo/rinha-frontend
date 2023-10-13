import { createContext } from "preact"
import { ReactNode } from "preact/compat"
import { useContext, useEffect, useRef } from "preact/hooks"

interface IJsonContext {
  isJsonValid(json: string): Promise<boolean>
  sliceJson(start: number, end: number): Promise<any>
  getJsonLength(): Promise<number>
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

  function sliceJson(start: number, end: number) {
    return new Promise<any>((resolve) => {
      if (!worker.current) return resolve(null)

      const id = Math.random()

      worker.current?.postMessage({
        id,
        action: "slice",
        start,
        end,
      })

      worker.current.onmessage = (event) => {
        if (event.data.id !== id) return
        resolve(event.data.slicedJson)
      }
    })
  }

  function getJsonLength() {
    return new Promise<number>((resolve) => {
      if (!worker.current) return 0

      const id = Math.random()

      worker.current?.postMessage({
        id,
        action: "getLength",
      })

      worker.current.onmessage = (event) => {
        if (event.data.id !== id) return
        resolve(event.data.length)
      }
    })
  }

  function isJsonValid(json: string) {
    return new Promise<boolean>((resolve) => {
      if (!worker.current) return resolve(false)

      const id = Math.random()

      worker.current?.postMessage({
        id,
        action: "validate",
        data: json,
      })

      worker.current.onmessage = (event) => {
        if (event.data.id !== id) return

        resolve(event.data.isValid)
      }
    })
  }

  return (
    <JsonContext.Provider value={{ isJsonValid, sliceJson, getJsonLength }}>
      {children}
    </JsonContext.Provider>
  )
}
