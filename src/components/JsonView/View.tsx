import { AutoSizer, List, WindowScroller } from "react-virtualized"
import Primitive from "./Primitive"
import Open from "./Open"
import Close from "./Close"

export default function View({
  node: nodeList,
}: {
  node: {
    distance: number
    key: string
    type: string
    value?: string
  }[]
}) {
  if (nodeList.length === 0) return null

  return (
    <div className="flex-1">
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }: any) => (
          <AutoSizer disableHeight>
            {({ width }: any) => {
              const rowCount = nodeList.length
              const ITEM_HEIGHT = 25
              return (
                <List
                  autoHeight
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  width={width}
                  height={height}
                  rowCount={rowCount}
                  rowHeight={ITEM_HEIGHT}
                  overscanRowCount={3}
                  tabIndex={-1}
                  rowRenderer={({ index, key, style }: any) => {
                    const node = nodeList[index]

                    if (node.type === "objOpen" || node.type === "arrayOpen") {
                      return (
                        <Open
                          key={key}
                          distance={node.distance}
                          title={node.key}
                          style={style}
                          type={node.type}
                        />
                      )
                    }

                    if (
                      node.type === "objClose" ||
                      node.type === "arrayClose"
                    ) {
                      return (
                        <Close
                          key={key}
                          distance={node.distance}
                          title={node.key}
                          style={style}
                          type={node.type}
                        />
                      )
                    }

                    if (node.type === "primitive") {
                      return (
                        <Primitive
                          key={key}
                          distance={node.distance}
                          style={style}
                          value={node.value}
                          title={node.key}
                        />
                      )
                    }
                  }}
                />
              )
            }}
          </AutoSizer>
        )}
      </WindowScroller>
    </div>
  )
}
