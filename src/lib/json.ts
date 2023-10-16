export interface JsonNode {
  key: string
  value: string
  kind: "primitive" | "arrayClose" | "arrayOpen" | "objectOpen" | "objectClose"
  depth: number
}

export const jsonNodes: JsonNode[] = []

export function parseTree(node: any, depth = 0) {
  if (node === null) return

  function handle(key: string, value: any) {
    if (typeof value !== "object" || value === null) {
      jsonNodes.push({
        key,
        value: formatValue(value),
        kind: "primitive",
        depth,
      })
    } else {
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

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      handle(i.toString(), node[i])
    }
  } else if (typeof node === "object") {
    for (const key in node) {
      const value = node[key]
      handle(key, value)
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
