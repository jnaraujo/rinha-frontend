import { jsonStore } from "../../store/json-store"
import View from "../View"
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
        overscan={20}
        itemCount={json.nodeList.length}
        role="list"
        aria-label={`Tree view of ${json.name} file`}
        render={(index, style, node) => {
          return (
            <div key={index} style={style}>
              <View node={node} />
            </div>
          )
        }}
      />
    </section>
  )
}
