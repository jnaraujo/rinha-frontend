import { useEffect, useMemo, useRef, useState } from "preact/hooks"
import { throttle } from "../lib/utils"
import { ReactNode } from "preact/compat"

interface Props<T> {
  itemHeight: number
  itemCount: number
  render: (index: number, style: any, data: T) => ReactNode
  overscan?: number
  threshold?: number
  data?: T[]
}

export default function Virtualized<T>({
  itemCount,
  itemHeight,
  render,
  data,
  overscan = 40,
  threshold = 20,
}: Props<T>) {
  const ref = useRef<HTMLDivElement>(null)
  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(0)

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

      setFrom((prev) => {
        if (threshold > Math.abs(prev - from) && prev) {
          return prev
        }

        return from
      })

      setTo((prev) => {
        if (threshold > Math.abs(prev - to) && prev) {
          return prev
        }

        return to
      })
    }

    // const throttled = throttle(handleScroll, 100)

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const items = useMemo(() => {
    const items = []

    for (let i = 0; i < itemCount; i++) {
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
  }, [from, to])

  const renderedItems = useMemo(() => {
    let filtered = []

    for (let i = from; i <= to; i++) {
      filtered.push(items[i])
    }

    return filtered
  }, [items])

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        height: itemCount * itemHeight,
      }}
      ref={ref}
    >
      {renderedItems}
    </div>
  )
}
