function isJsonValid(json) {
  if (typeof json !== "string") {
    return {
      isValid: false,
      parsedJson: null,
    }
  }

  try {
    const parse = JSON.parse(json)
    const isValid = typeof parse === "object"

    return {
      isValid: isValid,
      parsedJson: parse,
    }
  } catch (e) {
    return {
      isValid: false,
      parsedJson: null,
    }
  }
}

function sliceJson(json, start, end) {
  if (Array.isArray(json)) {
    return json.slice(start, end)
  }

  if (typeof json === "object") {
    const slicedJson = {}
    for (const key in json) {
      slicedJson[key] = sliceJson(json[key], start, end)
    }
    return slicedJson
  }

  return json
}

onmessage = function (e) {
  const action = e.data.action
  const json = e.data.data
  const id = e.data.id

  switch (action) {
    case "validate":
      console.time("validateJson")
      const { isValid, parsedJson } = isJsonValid(json)
      console.timeEnd("validateJson")

      self.postMessage({
        id: id,
        isValid,
        parsed: parsedJson,
      })
      break
    case "slice":
      console.time("sliceJson")
      const slicedJson = sliceJson(json, e.data.start, e.data.end)
      console.timeEnd("sliceJson")

      console.time("jPost")
      self.postMessage({
        id: id,
        slicedJson,
      })
      console.timeEnd("jPost")
      break
    default:
      self.postMessage("Unknown action")
  }
}
