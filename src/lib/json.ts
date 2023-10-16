export const KIND = {
  PRIMITIVE: 0,
  ARRAY_ENTER: 1,
  ARRAY_CLOSE: 2,
  OBJECT_ENTER: 3,
}

export type JsonNode = [string, string, number, number]

export const jsonNodes: JsonNode[] = []

export function parseTree(node: any, distance = 0) {
  if (node === null) return

  const entries = Object.entries(node)

  if (entries.length === 0) return

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i]

    if (typeof value !== "object" || value === null) {
      jsonNodes.push([key, formatValue(value), KIND.PRIMITIVE, distance])
    } else {
      const isArray = Array.isArray(value)

      jsonNodes.push([
        key,
        "",
        isArray ? KIND.ARRAY_ENTER : KIND.OBJECT_ENTER,
        distance,
      ])
      if (value !== null) {
        parseTree(value, distance + 1)
      }

      if (isArray) {
        jsonNodes.push([key, "", KIND.ARRAY_CLOSE, distance])
      }
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
