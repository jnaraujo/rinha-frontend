import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import {
  jsonNodes,
  loadAndParseJsonFileStream,
  parseTree,
} from "../../lib/json"
import { useRef, useState } from "react"

export default function UploadFile() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    setLoading(true)

    const target = event.target as HTMLInputElement & {
      files: FileList
    }

    if (target.files && target.files[0]) {
      const file = target.files[0]

      console.time("loadAndParseJsonFile")

      loadAndParseJsonFileStream(file)
        .then((json) => {
          console.timeEnd("loadAndParseJsonFile")
          console.time("parseTree")
          parseTree(json)
          console.timeEnd("parseTree")

          console.log(jsonNodes.length)

          navigate("/json-viewer", {
            state: {
              fileName: file.name,
            },
          })
        })
        .catch((_) => {
          setError("Invalid file. Please load a valid JSON file.")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }

    ;(event.target as any).value = null // reset input
  }

  const handleClick = () => {
    if (!inputRef.current) return
    inputRef.current.click()
  }

  return (
    <section className="flex flex-1 items-center justify-center">
      <form
        className="space-y-4 text-center"
        aria-label="Upload JSON file"
        role="form"
      >
        <h1 className="text-5xl font-bold">JSON Tree Viewer</h1>
        <p className="text-lg font-normal">
          Simple JSON Viewer that runs completely on-client. No data exchange.
        </p>

        <div>
          <label htmlFor="jsonInput">
            <button
              type="button"
              disabled={loading}
              className="mx-auto rounded-md border border-black bg-gradient-to-r from-[#E4E4E4]
              to-[#F7F7F7] px-2 py-1 text-black transition-all duration-200 hover:drop-shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleClick}
              aria-label="Load JSON"
            >
              {loading ? (
                <span className="flex gap-2">
                  <Loader2 className="animate-spin" /> Loading file...
                </span>
              ) : (
                "Load JSON"
              )}
            </button>
          </label>
          <input
            name="jsonInput"
            accept=".json"
            onChange={handleFileChange}
            ref={inputRef}
            id="jsonInput"
            className="hidden"
            type="file"
            aria-labelledby="jsonInput"
          />
        </div>

        {error ? (
          <p className="text-red-500" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  )
}
