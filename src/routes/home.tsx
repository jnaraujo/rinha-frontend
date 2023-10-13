import { Suspense, lazy } from "preact/compat"
import { jsonStore } from "../store/json-store"
const JsonViewer = lazy(() => import("../components/Layout/JsonViewer"))
const UploadFile = lazy(() => import("../components/Layout/UploadFile"))

export function Home() {
  const { json } = jsonStore()
  return (
    <main className="flex min-h-[100svh] flex-col bg-zinc-100">
      <Suspense fallback={null}>
        {json.name ? <JsonViewer /> : <UploadFile />}
      </Suspense>
    </main>
  )
}
