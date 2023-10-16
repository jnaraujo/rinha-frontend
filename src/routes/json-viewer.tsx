import { useEffect } from "react"
import Viewer from "../components/Layout/Viewer"
import { useLocation, useNavigate } from "react-router-dom"
import { jsonNodes } from "../lib/json"

export default function JsonViewer() {
  const { state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state || !state.fileName || jsonNodes.length === 0) {
      navigate("/")
    }
  }, [state, jsonNodes])

  if (!state || !state.fileName) return null

  return (
    <main className="flex min-h-[100svh] flex-col bg-white">
      <Viewer fileName={state.fileName} />
    </main>
  )
}
