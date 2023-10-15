export function formatValue(value: any) {
  switch (typeof value) {
    case "string":
      return `"${value}"`
    case "number":
      return `${value}`
    case "boolean":
      return `${value}`
    case "object":
      return "null"
    case "undefined":
      return "undefined"
    default:
      return value.toString()
  }
}

export function isNumber(value: any) {
  return Number.isNaN(Number(value)) === false
}
