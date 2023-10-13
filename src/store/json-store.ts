import { create } from "zustand"

interface JsonData {
  raw: string
  parsed: any
  name: string
  size: number
}

interface JsonStore {
  json: JsonData
  setJson: (json: JsonData) => void
}

export const jsonStore = create<JsonStore>((set) => ({
  json: {} as JsonData,
  setJson: (json) => set({ json }),
}))
