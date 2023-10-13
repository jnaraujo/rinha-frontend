import { memo, useMemo } from "preact/compat"
import { formatValue, isNumber } from "./helper"
import clsx from "clsx"

interface Props {
  node: object
}

function View({ node }: Props) {
  if (node === null) return null

  const entries = useMemo(() => {
    if (!node) return []

    return Object.entries(node)
  }, [node])

  let index = 0

  const list = useMemo(() => {
    return entries.map(([key, value]) => {
      index++

      if (typeof value !== "object" || value === null) {
        return (
          <li key={`tag-${index - 1}`} className="space-y-1">
            <span
              className={clsx({
                "text-teal-600": !isNumber(key),
                "text-zinc-400": isNumber(key),
              })}
            >
              {key}:
            </span>
            <p className="inline break-all">{formatValue(value)}</p>
          </li>
        )
      }

      const isArray = Array.isArray(value)

      return (
        <div key={`view-${index - 1}`} className="flex flex-col gap-1">
          <li
            className={clsx({
              "text-teal-600": !isNumber(key),
              "text-zinc-400": isNumber(key),
            })}
          >
            {key}:<span className="text-rose-200">{isArray ? " [" : ""}</span>
          </li>
          <div className="ml-[1px] border-l-2 border-zinc-300 pl-4">
            <View node={value} />
          </div>
          <span className="text-rose-200">{isArray ? "] " : ""}</span>
        </div>
      )
    })
  }, [entries])

  if (entries.length === 0) return null

  return <ul tabIndex={0}>{list}</ul>
}

export default memo(View, () => false)
