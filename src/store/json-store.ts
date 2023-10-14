import { create } from "zustand"
import { JsonNode } from "../lib/json"

interface JsonData {
  name: string
  nodeList: JsonNode[]
}

interface JsonStore {
  json: JsonData
  setJson: (json: JsonData) => void
}

export const jsonStore = create<JsonStore>((set) => ({
  json: {} as JsonData,
  setJson: (json) => set({ json }),
}))
