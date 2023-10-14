export const throttle = (fn: any, wait: number) => {
  let inThrottle: boolean, lastFn: any, lastTime: number

  return function () {
    // @ts-ignore
    const context = this

    const args = arguments
    if (!inThrottle) {
      fn.apply(context, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(
        function () {
          if (Date.now() - lastTime >= wait) {
            fn.apply(context, args)
            lastTime = Date.now()
          }
        },
        Math.max(wait - (Date.now() - lastTime), 0),
      )
    }
  }
}
