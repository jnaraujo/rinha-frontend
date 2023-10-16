export interface JsonNode {
  key: string
  value: string
  kind: "primitive" | "arrayClose" | "arrayOpen" | "objectOpen" | "objectClose"
  depth: number
}

export const jsonNodes: JsonNode[] = []

export function parseTree(node: any, depth = 0) {
  if (node === null) return

  const entries = Object.entries(node)

  if (entries.length === 0) return

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i]

    if (typeof value !== "object" || value === null) {
      jsonNodes.push({
        key,
        value: formatValue(value),
        kind: "primitive",
        depth,
      })
      continue
    }

    const isArray = Array.isArray(value)

    jsonNodes.push({
      key,
      value: "",
      kind: isArray ? "arrayOpen" : "objectOpen",
      depth,
    })

    if (value !== null) {
      parseTree(value, depth + 1)
    }

    if (isArray) {
      jsonNodes.push({
        key,
        value: "",
        kind: "arrayClose",
        depth,
      })
    }
  }
}

function formatValue(value: any) {
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

export async function loadAndParseJsonFile(file: File) {
  return new Promise(async (resolve, reject) => {
    let reader = new FileReader()

    reader.onload = async function (e) {
      const result = e.target?.result as string

      try {
        const json = JSON.parse(result)
        resolve(json)
      } catch (error) {
        reject(error)
      }
    }

    reader.readAsText(file)
  })
}

export async function loadAndParseJsonFileStream(file: File) {
  return new Promise(async (resolve, reject) => {
    let buffer = ""

    await file
      .stream()
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(
        new TransformStream({
          transform(chunk, _) {
            buffer += chunk
          },
          flush(controller) {
            try {
              const json = JSON.parse(buffer)
              controller.enqueue(json)
            } catch (error) {
              reject(error)
            }
          },
        }),
      )
      .pipeTo(
        new WritableStream({
          write(data) {
            resolve(data)
          },
        }),
      )
  })
}
