import { JsonProvider } from "./context/JsonContext"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./routes/home"
import JsonViewer from "./routes/json-viewer"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/json-viewer",
    element: <JsonViewer />,
  },
])

export function App() {
  return (
    <JsonProvider>
      <RouterProvider router={router} />
    </JsonProvider>
  )
}
