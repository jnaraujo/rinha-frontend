import { useEffect, useRef, useState } from "preact/hooks"
import { jsonStore } from "../../store/json-store"
import View from "../JsonView/View"
import { useNavigate } from "react-router-dom"
import { mergeJson, sliceJson } from "../../lib/json"

export default function Viewer() {
  const navigate = useNavigate()
  const { json } = jsonStore()
  const timeout = useRef<number | null>(null)

  const [pos, setPos] = useState({
    start: 0,
    end: 5,
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
              end: prev.end + 5,
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
      const newJson = await sliceJson(json.parsed, pos.start, pos.end)

      if (!tree) return setTree(newJson)

      setTree((prev: any) => {
        return mergeJson(prev, newJson)
      })
    }

    slice()
  }, [pos])

  if (!json.name) return null

  return (
    <section className="mx-auto flex w-[638px] max-w-[100%] flex-1 flex-col gap-4 px-2">
      <div className="mt-4 flex items-center gap-2">
        <h1 className="text-4xl font-bold">{json.name}</h1>
      </div>
      <div>{tree ? <View node={tree} /> : <div>Loading...</div>}</div>
    </section>
  )
}
