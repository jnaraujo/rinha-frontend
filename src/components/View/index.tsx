import { isNumber } from "./helper"
import clsx from "clsx"
import { JsonNode } from "../../lib/json"
import { memo } from "react"

interface Props {
  node: JsonNode
  style?: any
}

function View({ node, style }: Props) {
  if (!node) return null

  const { key, value, kind, depth } = node

  const listItemRole = kind === "arrayClose" ? "presentation" : "listitem"

  const listItemLabel =
    kind !== "arrayClose" && key && value ? `${key}: ${value}` : value

  return (
    <li
      className="relative flex h-7 items-center"
      style={style}
      tabIndex={0}
      role={listItemRole}
      aria-label={listItemLabel}
    >
      <div className="flex h-full shrink-0 items-center">
        {[...Array(depth)].map((_, i) => (
          <div
            role="none"
            key={i}
            className="ml-[2px] mr-4 h-full w-[2px] bg-gray"
          />
        ))}
      </div>

      <div
        className={clsx("flex gap-1", {
          "text-accent": !isNumber(key),
          "text-gray": isNumber(key),
        })}
      >
        {kind !== "arrayClose" ? (
          <>
            <p role="text" aria-label={`Key: ${key}`}>
              {key}:{" "}
            </p>
          </>
        ) : null}

        {kind === "arrayOpen" ? (
          <span className="text-brackets" role="none">
            {" ["}
          </span>
        ) : null}
      </div>

      {kind === "primitive" ? (
        <p
          title={String(value)}
          className="ml-1 line-clamp-1"
          role="text"
          aria-label={`Value: ${value}`}
        >
          {value}
        </p>
      ) : null}

      {kind === "arrayClose" ? (
        <span className="text-brackets">{"] "}</span>
      ) : null}
    </li>
  )
}

export default memo(View)
