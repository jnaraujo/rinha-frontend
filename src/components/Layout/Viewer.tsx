import { jsonStore } from "../../store/json-store"
import View from "../View"
import { useNavigate } from "react-router-dom"
import Virtualized from "../Virtualized"
import { useEffect, useMemo, useState } from "react"

export default function Viewer() {
  const navigate = useNavigate()
  const { json } = jsonStore()
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!json.name) {
      navigate("/")
    }
  }, [json.name])

  if (!json.name) return null
  if (!json.nodeList) return null

  const chunks = useMemo(() => {
    const MAX_HEIGHT = 1_000_000
    const ITEM_HEIGHT = 28
    const CHUNK_SIZE = MAX_HEIGHT / ITEM_HEIGHT

    const chunks = []

    for (let i = 0; i < json.nodeList.length; i += CHUNK_SIZE) {
      chunks.push(json.nodeList.slice(i, i + CHUNK_SIZE))
    }

    return chunks
  }, [json.nodeList])

  console.log(chunks[page], chunks.length)

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-2">
      <div className="mt-4 flex items-center gap-2">
        <h1 className="text-4xl font-bold">{json.name}</h1>
      </div>
      <div className="mb-6 flex flex-col items-center gap-6">
        <Virtualized
          data={chunks[page] ?? []}
          itemHeight={28}
          overscan={20}
          itemCount={chunks[page].length}
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
        {chunks.length > 1 ? (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setPage((prev) => Math.max(0, prev - 1))
              }}
              disabled={page === 0}
              className="mx-auto rounded-md border border-black bg-gradient-to-r from-[#E4E4E4]
              to-[#F7F7F7] px-2 text-black transition-all duration-200 hover:drop-shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              Back
            </button>

            <p className="text-lg font-normal">
              Page{" "}
              <input
                type="number"
                min={1}
                max={chunks.length}
                value={page + 1}
                aria-label="Page number"
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setPage(Math.max(0, Math.min(value - 1, chunks.length - 1)))
                }}
                className="w-12 rounded-md border border-black text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />{" "}
              of {chunks.length}
            </p>

            <button
              onClick={() => {
                setPage((prev) => Math.min(prev + 1, chunks.length - 1))
              }}
              disabled={page === chunks.length - 1}
              className="mx-auto rounded-md border border-black bg-gradient-to-r from-[#E4E4E4]
              to-[#F7F7F7] px-2 text-black transition-all duration-200 hover:drop-shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
