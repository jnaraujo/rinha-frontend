import { useMemo } from "preact/compat"
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

  const list = useMemo(() => {
    return entries.map(([key, value]) => {
      const isArray = Array.isArray(value)
      const isPrimitive = typeof value !== "object" || value === null

      return (
        <li key={key} className="space-y-1">
          <span
            className={clsx({
              "text-teal-600": !isNumber(key),
              "text-zinc-400": isNumber(key),
            })}
          >
            {key}:{" "}
            {isArray ? <span className="text-rose-200">{" ["}</span> : null}
          </span>

          {isPrimitive ? (
            <p className="inline break-all">{formatValue(value)}</p>
          ) : null}

          {!isPrimitive ? (
            <div className="ml-[1px] border-l-2 border-zinc-300 pl-4">
              <View node={value} />
            </div>
          ) : null}

          {isArray ? <span className="text-rose-200">{"] "}</span> : null}
        </li>
      )
    })
  }, [entries])

  if (entries.length === 0) return null

  return <ul tabIndex={0}>{list}</ul>
}

export default View
