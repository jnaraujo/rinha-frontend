import { JsonProvider } from "./context/JsonContext"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./routes/home"
import JsonViewer from "./routes/json-viewer"

export function App() {
  return (
    <JsonProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="json-viewer" element={<JsonViewer />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </JsonProvider>
  )
}
