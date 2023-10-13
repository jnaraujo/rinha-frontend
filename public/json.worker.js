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

function sliceJson(data, start, end) {
  if (Array.isArray(data)) {
    return data.slice(start, end);
  } else if (typeof data === "object") {
      const slicedData = {};
      for (const key in data) {
          slicedData[key] = sliceJson(data[key], start, end);
      }
      return slicedData;
  } else {
      return data;
  }
}

let jsonStore = null

onmessage = function (e) {
  const action = e.data.action
  const json = e.data.data
  const id = e.data.id

  switch (action) {
    case "validate":
      console.time("validateJson")
      const { isValid, parsedJson } = isJsonValid(json)
      console.timeEnd("validateJson")
      
      jsonStore = parsedJson

      self.postMessage({
        id: id,
        isValid
      })
      break
    case "load":
      jsonStore = json
      break
    case "slice":
      const slicedJson = sliceJson(jsonStore, e.data.start, e.data.end)

      self.postMessage({
        id: id,
        slicedJson: slicedJson,
      })
      break
    default:
      self.postMessage("Unknown action")
  }
}