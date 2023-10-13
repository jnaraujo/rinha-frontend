import clsx from "clsx"
import { isNumber } from "./helper"
import Divider from "./Divider"

interface Props {
  style: React.CSSProperties
  distance: number
  title: string
  type: string
}

export default function Close({ style, distance, title, type }: Props) {
  return (
    <div className="flex items-center" style={style}>
      {Array.from({ length: distance }).map((_, i) => (
        <Divider key={i} />
      ))}
      <div
        className={clsx({
          "text-teal-600": !isNumber(title),
          "text-zinc-400": isNumber(title),
        })}
      >
        <span className="text-rose-200">
          {type === "arrayClose" ? "] " : ""}
        </span>
      </div>
    </div>
  )
}
