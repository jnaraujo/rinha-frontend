import { jsonStore } from "../../store/json-store"
import View from "../JsonView/View"
import { useNavigate } from "react-router-dom"
import Virtualized from "../Virtualized"
import { useEffect } from "react"

export default function Viewer() {
  const navigate = useNavigate()
  const { json } = jsonStore()

  useEffect(() => {
    if (!json.name) {
      navigate("/")
    }
  }, [json.name])

  if (!json.name) return null
  if (!json.nodeList) return null

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-2">
      <div className="mt-4 flex items-center gap-2">
        <h1 className="text-4xl font-bold">{json.name}</h1>
      </div>
      <Virtualized
        data={json.nodeList}
        itemHeight={28}
        overscan={14}
        threshold={7}
        itemCount={json.nodeList.length}
        render={(index, style, node) => {
          return <View key={index} node={node} style={style} />
        }}
      />
    </section>
  )
}
