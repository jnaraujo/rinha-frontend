export function sliceJson(data: any, start: number, end: number) {
  if (Array.isArray(data)) {
    return data.slice(start, end)
  } else if (typeof data === "object") {
    const slicedData = {} as any

    for (const key in data) {
      slicedData[key] = sliceJson(data[key], start, end)
    }
    return slicedData
  } else {
    return data
  }
}

export function mergeJson(data: any, newData: any) {
  if (Array.isArray(data)) {
    if (Array.isArray(newData)) {
      return [...data, ...newData]
    } else {
      return data // Keep the existing array if newData is not an array.
    }
  } else if (typeof data === "object" && typeof newData === "object") {
    const mergedData = { ...data }

    for (const key in newData) {
      mergedData[key] = mergeJson(data[key], newData[key])
    }

    return mergedData
  } else {
    return newData !== undefined ? newData : data
  }
}
