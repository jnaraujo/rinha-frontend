import { createContext } from "preact"
import { ReactNode } from "preact/compat"
import { useContext, useRef } from "preact/hooks"

interface IJsonContext {
  isJsonValid(json: string): boolean
  sliceJson(start: number, end: number): any
  load(json: any): void
}

const JsonContext = createContext<IJsonContext>({} as IJsonContext)

export const useJson = () => useContext(JsonContext)

export function JsonProvider({ children }: { children: ReactNode }) {
  const jsonStore = useRef<any>(null)

  function sliceJson(start: number, end: number) {
    if (!jsonStore.current) return null

    const slicedJson = _sliceJson(jsonStore.current, start, end)

    return slicedJson
  }

  function load(json: any) {
    jsonStore.current = json
  }

  function isJsonValid(json: string) {
    try {
      const parse = JSON.parse(json)

      load(parse)

      return true
    } catch (e) {
      return false
    }
  }

  return (
    <JsonContext.Provider value={{ isJsonValid, sliceJson, load }}>
      {children}
    </JsonContext.Provider>
  )
}

function _sliceJson(data: any, start: number, end: number) {
  if (Array.isArray(data)) {
    return data.slice(start, end)
  } else if (typeof data === "object") {
    const slicedData = {} as any

    for (const key in data) {
      slicedData[key] = _sliceJson(data[key], start, end)
    }
    return slicedData
  } else {
    return data
  }
}
