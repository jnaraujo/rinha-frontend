import clsx from "clsx"
import Divider from "./Divider"
import { formatValue, isNumber } from "./helper"

interface Props {
  style: React.CSSProperties
  distance: number
  title: string
  value: any
}

export default function Primitive({ style, distance, title, value }: Props) {
  return (
    <div className="flex" style={style}>
      <div className="flex shrink-0">
        {Array.from({ length: distance }).map((_, i) => (
          <Divider key={i} />
        ))}
        <span
          className={clsx({
            "text-teal-600": !isNumber(title),
            "text-zinc-400": isNumber(title),
          })}
        >
          {title}:
        </span>
      </div>
      <span className="line-clamp-1" title={value}>
        {formatValue(value)}
      </span>
    </div>
  )
}
