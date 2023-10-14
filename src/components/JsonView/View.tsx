import { formatValue, isNumber } from "./helper"
import clsx from "clsx"
import { JsonNode } from "../../lib/json"
import { memo } from "react"

interface Props {
  node: JsonNode
  style?: any
}

function View({ node, style }: Props) {
  if (!node) return null

  const { key, value, type, distance } = node

  return (
    <li className="relative flex h-7 items-center" style={style} tabIndex={0}>
      <div className="flex h-full shrink-0 items-center">
        {[...Array(distance)].map((_, i) => (
          <div key={i} className="ml-[2px] mr-4 h-full w-[2px] bg-zinc-300" />
        ))}
      </div>

      <span
        className={clsx({
          "text-teal-600": !isNumber(key),
          "text-zinc-400": isNumber(key),
        })}
      >
        {type !== "arrayClose" ? <>{key}: </> : null}
        {type === "arrayEnter" ? (
          <span className="text-rose-200">{" ["}</span>
        ) : null}
      </span>

      {type === "primitive" ? (
        <p title={value} className="line-clamp-1">
          {formatValue(value)}
        </p>
      ) : null}

      {type === "arrayClose" ? (
        <span className="text-rose-200">{"] "}</span>
      ) : null}
    </li>
  )
}

export default memo(View)
