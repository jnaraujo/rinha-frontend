export interface JsonNode {
  key: string | number
  value: any
  kind: "primitive" | "arrayClose" | "arrayOpen" | "objectOpen" | "objectClose"
  depth: number
}

export const jsonNodes: JsonNode[] = []

export function parseTree(node: any, depth = 0) {
  function handle(key: string | number, value: any) {
    if (typeof value !== "object" || value === null) {
      jsonNodes.push({
        key,
        value,
        kind: "primitive",
        depth,
      })
      return
    }
    const isArray = Array.isArray(value)

    jsonNodes.push({
      key,
      value: "",
      kind: isArray ? "arrayOpen" : "objectOpen",
      depth,
    })

    parseTree(value, depth + 1)

    if (isArray) {
      jsonNodes.push({
        key,
        value: "",
        kind: "arrayClose",
        depth,
      })
    }
  }

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      handle(i, node[i])
    }
  } else {
    for (const key in node) {
      handle(key, node[key])
    }
  }
}

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

export async function loadAndParseJsonFile(file: File) {
  return new Promise(async (resolve, reject) => {
    jsonNodes.length = 0 // reset jsonNodes

    let reader = new FileReader()

    console.time("loadfilestream")
    reader.onload = async function (e) {
      console.timeEnd("loadfilestream")

      const result = e.target?.result as string

      try {
        console.time("JSON.parse")
        const json = JSON.parse(result)
        console.timeEnd("JSON.parse")
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
    jsonNodes.length = 0 // reset jsonNodes
    console.time("loadfilestream")
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
              console.timeEnd("loadfilestream")

              console.time("JSON.parse")
              const json = JSON.parse(buffer)
              console.timeEnd("JSON.parse")

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
