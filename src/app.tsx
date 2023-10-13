import { JsonProvider } from "./context/JsonContext"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      let YourComponent = await import("./routes/home")
      return { Component: YourComponent.Home }
    },
  },
  {
    path: "/json-viewer",
    lazy: async () => {
      let YourComponent = await import("./routes/json-viewer")
      return { Component: YourComponent.JsonViewer }
    },
  },
])

export function App() {
  return (
    <JsonProvider>
      <RouterProvider router={router} />
    </JsonProvider>
  )
}
