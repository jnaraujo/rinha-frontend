import { useEffect } from "preact/hooks"
import { jsonStore } from "../../store/json-store"
import View from "../JsonView/View"
import { useNavigate } from "react-router-dom"

export default function Viewer() {
  const navigate = useNavigate()
  const { json } = jsonStore()

  useEffect(() => {
    if (!json.name) {
      navigate("/")
    }
  }, [json.name])

  if (!json.name) return null

  return (
    <section className="mx-auto flex w-[638px] flex-1 flex-col gap-4">
      <h1 className="mt-4 text-4xl font-bold">{json.name}</h1>

      <View node={json.parsed} />
    </section>
  )
}
