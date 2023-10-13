import { jsonStore } from "../../store/json-store"
import View from "../JsonView/View"

export default function JsonViewer() {
  const { json } = jsonStore()

  return (
    <section className="mx-auto flex w-[638px] flex-1 flex-col gap-4">
      <h1 className="mt-4 text-4xl font-bold">{json.name}</h1>

      <View node={json.parsed} />
    </section>
  )
}
