import clsx from "clsx"
import { formatValue, isNumber } from "./helper"

export default function View({ node }: { node: object }) {
  if (node === null) return null

  const entries = Object.entries(node)

  if (entries.length === 0) return null

  return (
    <div className="space-y-1">
      {entries.map(([key, value]) => {
        if (typeof value !== "object" || value === null) {
          return (
            <div key={key} className="ml-5 flex gap-1">
              <span
                className={clsx({
                  "text-teal-600": !isNumber(key),
                  "text-zinc-400": isNumber(key),
                })}
              >
                {key}:
              </span>
              <span>{formatValue(value)}</span>
            </div>
          )
        }

        const isArray = Array.isArray(value)

        return (
          <div key={key} className="ml-5 flex flex-col gap-1">
            <span
              className={clsx({
                "text-teal-600": !isNumber(key),
                "text-zinc-400": isNumber(key),
              })}
            >
              {key}:<span className="text-rose-200">{isArray ? " [" : ""}</span>
            </span>
            <div className="border-l-2 border-zinc-300">
              <View node={value} />
            </div>
            <span className="text-rose-200">{isArray ? "] " : ""}</span>
          </div>
        )
      })}
    </div>
  )
}
