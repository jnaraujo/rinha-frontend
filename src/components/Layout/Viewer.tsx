import View from "../View"
import Virtualized from "../Virtualized"
import { useMemo, useRef, useState } from "react"
import { jsonNodes } from "../../lib/json"

interface Props {
  fileName: string
}

export default function Viewer({ fileName }: Props) {
  const [page, setPage] = useState(0)
  const controlRef = useRef<HTMLDivElement>(null)

  const chunks = useMemo(() => {
    if (jsonNodes.length === 0) {
      return [[]]
    }

    const MAX_HEIGHT = 1_000_000
    const ITEM_HEIGHT = 28
    const CHUNK_SIZE = Math.floor(MAX_HEIGHT / ITEM_HEIGHT)

    const chunks = []

    for (let i = 0; i < jsonNodes.length; i += CHUNK_SIZE) {
      chunks.push(jsonNodes.slice(i, i + CHUNK_SIZE))
    }

    return chunks
  }, [jsonNodes])

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-2">
      <div className="mt-4 flex items-center gap-2">
        <h1 className="text-4xl font-bold">{fileName}</h1>
      </div>
      <div className="mb-6 flex flex-col items-center gap-6">
        <Virtualized
          data={chunks[page] ?? []}
          itemHeight={28}
          overscan={20}
          itemCount={chunks[page].length}
          role="list"
          aria-label={`Tree view of ${fileName} file`}
          render={(index, style, node) => {
            return (
              <div key={index} style={style}>
                <View node={node} />
              </div>
            )
          }}
        />
        {chunks.length > 1 ? (
          <div
            className="flex items-center justify-center gap-2"
            ref={controlRef}
          >
            <button
              onClick={() => {
                setPage((prev) => Math.max(0, prev - 1))
                scrollTo({
                  top: controlRef.current?.offsetTop,
                  behavior: "smooth",
                })
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
                  scrollTo({
                    top: controlRef.current?.offsetTop,
                    behavior: "smooth",
                  })
                }}
                className="w-12 rounded-md border border-black text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />{" "}
              of {chunks.length}
            </p>

            <button
              onClick={() => {
                setPage((prev) => Math.min(prev + 1, chunks.length - 1))
                scrollTo({
                  top: controlRef.current?.offsetTop,
                  behavior: "smooth",
                })
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
