import { create } from "zustand"

interface JsonData {
  name: string
  size: number
  length: number
}

interface JsonStore {
  json: JsonData
  setJson: (json: JsonData) => void
}

export const jsonStore = create<JsonStore>((set) => ({
  json: {} as JsonData,
  setJson: (json) => set({ json }),
}))
