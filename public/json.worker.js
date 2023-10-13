function isJsonValid(json) {
  if (typeof json !== "string"){
    return {
      isValid: false,
      parsedJson: null
    }
  }

  try {
    const parse = JSON.parse(json);
    const isValid = typeof parse === 'object';

    return {
      isValid: isValid,
      parsedJson: parse
    }
  } catch (e) {
    return {
      isValid: false,
      parsedJson: null
    }
  }
}

function render(node, distance = 0, arr=[]) {
  if (node === null) return null

  const entries = Object.entries(node)

  if (entries.length === 0) return null

  for(let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i]

    if (typeof value !== "object" || value === null) {
      arr.push({
        key, value, type: "primitive",
        distance,
      })
      continue;
    }

    const isArray = Array.isArray(value)

    arr.push({
      type: isArray ? "arrayOpen" : "objOpen",
      key,
      distance,
    })

    render(value, distance + 1, arr)

    arr.push({
      type: isArray ? "arrayClose" : "objClose",
      key,
      distance,
    })
  }
}

onmessage = function(e) {
  const action = e.data.action;
  const json = e.data.data;
  const id = e.data.id;

  switch (action) {
    case 'validate':
      console.time("validateJson")
      const {isValid, parsedJson} = isJsonValid(json);
      console.timeEnd("validateJson")
      const arr = []
      console.time("render")
      render(parsedJson, 0, arr);
      console.timeEnd("render")

      self.postMessage({
        id: id,
        isValid,
        parsed: arr
      });
      break;
    default:
      self.postMessage('Unknown action');
  }

}
