export interface JsonNode {
  key: string
  value?: any
  type: "primitive" | "arrayEnter" | "arrayClose" | "objectEnter"
  distance: number
}

export function render(node: any, arr: any = [], distance = 0) {
  if (node === null) return arr

  const entries = Object.entries(node)

  if (entries.length === 0) return null

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i]

    if (typeof value !== "object" || value === null) {
      arr.push({
        key,
        value,
        type: "primitive",
        distance,
      })
      continue
    }

    const isArray = Array.isArray(value)

    arr.push({
      type: isArray ? "arrayEnter" : "objectEnter",
      key,
      distance,
    })

    render(value, arr, distance + 1)

    if (isArray) {
      arr.push({
        type: "arrayClose",
        key,
        distance,
      })
    }
  }

  return arr
}
