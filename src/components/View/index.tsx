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

  const listItemRole = type === "arrayClose" ? "presentation" : "listitem"

  const listItemLabel =
    type !== "arrayClose" && key && value
      ? `${key}: ${formatValue(value)}`
      : formatValue(value)

  return (
    <li
      className="relative flex h-7 items-center"
      style={style}
      tabIndex={0}
      role={listItemRole}
      aria-label={listItemLabel}
    >
      <div className="flex h-full shrink-0 items-center">
        {[...Array(distance)].map((_, i) => (
          <div
            role="none"
            key={i}
            className="ml-[2px] mr-4 h-full w-[2px] bg-zinc-300"
          />
        ))}
      </div>

      <div
        className={clsx("flex gap-1", {
          "text-teal-600": !isNumber(key),
          "text-zinc-400": isNumber(key),
        })}
      >
        {type !== "arrayClose" ? (
          <>
            <p role="text" aria-label={`Key: ${key}`}>
              {key}:{" "}
            </p>
          </>
        ) : null}

        {type === "arrayEnter" ? (
          <span className="text-rose-200" role="none">
            {" ["}
          </span>
        ) : null}
      </div>

      {type === "primitive" ? (
        <p
          title={value}
          className="ml-1 line-clamp-1"
          role="text"
          aria-label={`Value: ${formatValue(value)}`}
        >
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
