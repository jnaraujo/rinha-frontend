import { type ReactNode, useState, useRef, useEffect, useMemo } from "react"
import { throttle } from "../lib/utils"

interface Props<T> extends React.HTMLAttributes<HTMLDivElement> {
  itemHeight: number
  itemCount: number
  render: (index: number, style: any, data: T) => ReactNode
  overscan?: number
  data?: T[]
}

export default function Virtualized<T>({
  itemCount,
  itemHeight,
  render,
  data,
  overscan = 40,
  ...rest
}: Props<T>) {
  const ref = useRef<HTMLDivElement>(null)
  const [range, setRange] = useState({
    from: 0,
    to: 0,
  })

  useEffect(() => {
    if (!ref.current) return
    handleScroll()

    function handleScroll() {
      const windowHeight = window.innerHeight!

      const scrollTop = window.scrollY!
      const offsetTop = ref.current?.offsetTop!

      const compHeight = ref.current?.clientHeight!

      const distanceToTop = offsetTop - scrollTop

      const offHeight = Math.max(0, scrollTop - offsetTop)

      const visibleArea = Math.max(
        0,
        Math.min(
          windowHeight,
          windowHeight - distanceToTop,
          -(-distanceToTop - compHeight),
        ),
      )

      const itemsOnScreen = Math.ceil(visibleArea / itemHeight) + overscan

      const from = Math.min(
        Math.max(0, Math.floor(offHeight / itemHeight) - overscan / 2),
        itemCount - 1,
      )
      const to = Math.min(from + itemsOnScreen + overscan / 2, itemCount - 1)

      setRange({
        from,
        to,
      })
    }

    const throttled = throttle(handleScroll, 100)

    window.addEventListener("scroll", throttled)

    return () => {
      window.removeEventListener("scroll", throttled)
    }
  }, [])

  const items = useMemo(() => {
    const items = []

    for (let i = range.from; i <= range.to; i++) {
      items.push(
        render(
          i,
          {
            position: "absolute",
            top: i * itemHeight,
            width: "100%",
            height: itemHeight,
          },
          data![i],
        ),
      )
    }

    return items
  }, [range.from, range.to, data])

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        height: itemCount * itemHeight,
      }}
      ref={ref}
      {...rest}
    >
      {items}
    </div>
  )
}
