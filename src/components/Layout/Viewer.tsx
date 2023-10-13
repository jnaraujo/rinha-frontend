import { useEffect, useRef, useState } from "preact/hooks"
import { jsonStore } from "../../store/json-store"
import View from "../JsonView/View"
import { Link, useNavigate } from "react-router-dom"
import { useJson } from "../../context/JsonContext"
import { ChevronLeft } from "lucide-preact"

function mergeJson(data: any, newData: any) {
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

export default function Viewer() {
  const navigate = useNavigate()
  const { json } = jsonStore()
  const { sliceJson } = useJson()
  const timeout = useRef<number | null>(null)

  const [pos, setPos] = useState({
    start: 0,
    end: 10,
  })
  const [tree, setTree] = useState<any>()

  useEffect(() => {
    if (!json.name) {
      navigate("/")
    }
  }, [json.name])

  useEffect(() => {
    function handleScroll() {
      const { scrollY, innerHeight } = window
      const { offsetHeight } = document.body

      const threshold = offsetHeight - 1000

      if (scrollY + innerHeight >= threshold) {
        if (timeout.current) clearTimeout(timeout.current)

        timeout.current = setTimeout(() => {
          setPos((prev) => {
            return {
              start: prev.end,
              end: prev.end + 15,
            }
          })
        }, 50)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    async function slice() {
      const newJson = await sliceJson(pos.start, pos.end)

      if (!tree) return setTree(newJson)

      setTree((prev: any) => {
        return mergeJson(prev, newJson)
      })
    }

    slice()
  }, [pos])

  if (!json.name) return null
  if (!tree) return null

  return (
    <section className="mx-auto flex w-[638px] max-w-[100%] flex-1 flex-col gap-4 px-2">
      <div className="mt-4 flex items-center gap-2">
        <Link to="/">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-4xl font-bold">{json.name}</h1>
      </div>
      <div>{<View node={tree} />}</div>
    </section>
  )
}
