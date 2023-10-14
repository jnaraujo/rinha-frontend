import { useRef, useState } from "preact/hooks"
import type { TargetedEvent } from "preact/compat"
import { jsonStore } from "../../store/json-store"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-preact"

export default function UploadFile() {
  const { setJson } = jsonStore()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFileChange(event: TargetedEvent<HTMLInputElement, Event>) {
    setError(null)
    setLoading(true)

    const target = event.target as HTMLInputElement & {
      files: FileList
    }

    if (target.files && target.files[0]) {
      const file = target.files[0]

      let reader = new FileReader()
      reader.onload = async function (e) {
        const result = e.target?.result as string

        try {
          const parsed = JSON.parse(result)
          setJson({
            name: file.name,
            parsed,
          })
        } catch (error) {
          setError("Invalid file. Please load a valid JSON file.")
        } finally {
          setLoading(false)
          navigate("/json-viewer")
        }
      }

      reader.readAsText(file)
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
    <section className="flex flex-1 items-center justify-center bg-zinc-100">
      <form className="space-y-4 text-center">
        <h1 className="text-5xl font-bold">JSON Tree Viewer</h1>
        <p className="text-lg font-normal">
          Simple JSON Viewer that runs completely on-client. No data exchange.
        </p>

        <div>
          <label htmlFor="jsonInput">
            <button
              type="button"
              disabled={loading}
              className="mx-auto rounded-md bg-zinc-950 px-4 py-2 text-zinc-100 transition-all duration-300 ease-in-out hover:bg-zinc-800  hover:shadow-lg disabled:cursor-progress disabled:bg-zinc-700 disabled:text-zinc-100 disabled:hover:shadow-none"
              onClick={handleClick}
            >
              {loading ? (
                <span className="flex gap-2">
                  <Loader2 className="animate-spin" /> Loading file...
                </span>
              ) : (
                "Select JSON file"
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
          />
        </div>

        {error ? <p className="text-red-500">{error}</p> : null}
      </form>
    </section>
  )
}
