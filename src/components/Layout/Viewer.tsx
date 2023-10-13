import { useEffect, useMemo, useRef, useState } from "preact/hooks"
import { jsonStore } from "../../store/json-store"
import View from "../JsonView/View"
import { useNavigate } from "react-router-dom"
import { useJson } from "../../context/JsonContext"

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
    let cb = () => {}
    function handleScroll() {
      const { scrollY, innerHeight } = window
      const { offsetHeight } = document.body

      const threshold = offsetHeight - 2000

      if (scrollY + innerHeight >= threshold) {
        if (timeout.current) clearTimeout(timeout.current)

        timeout.current = setTimeout(() => {
          setPos((prev) => {
            const length = json.parsed.length || 0
            if (prev.end >= length) return prev

            return {
              start: prev.end,
              end: prev.end + 15,
            }
          })
        }, 50)
      }

      cb()
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!json.parsed) return

    async function slice() {
      console.time("diff")
      const diff = await sliceJson(json.parsed, pos.start, pos.end)
      console.timeEnd("diff")

      setTree((prev: any) => [...(prev || []), diff])
    }

    slice()
  }, [pos])

  const list = useMemo(() => {
    if (!tree) return null

    return tree.map((node: any, index: number) => {
      return (
        <div key={index} className="mt-4">
          <View node={node} />
        </div>
      )
    })
  }, [tree])

  if (!json.name) return null

  return (
    <section className="mx-auto flex w-[638px] flex-1 flex-col gap-4">
      <h1 className="mt-4 text-4xl font-bold">{json.name}</h1>
      <div>{list}</div>
    </section>
  )
}
