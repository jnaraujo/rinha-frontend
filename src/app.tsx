import { JsonProvider } from "./context/JsonContext"
import { Home } from "./routes/home"

export function App() {
  return (
    <JsonProvider>
      <Home />
    </JsonProvider>
  )
}
