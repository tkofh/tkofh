import type { Vector2 } from '~/types/Vector2'

interface Options {
  width: number
  height: number
  min: number
  max: number
  inputs: Vector2[]
}
export function correctPositions(options: Options) {
  const start = performance.now()
  const center = {
    x: 0.5,
    y: 0.5,
  } satisfies Vector2

  const neighbors = new Map<Vector2, Set<Vector2>>()
  const frame = new Set<Vector2>()
  const centerDistances = new Map<Vector2, number>()

  let x = 0
  let y = 0
  for (const point of options.inputs) {
    const pointNeighbors = new Set<Vector2>()
    neighbors.set(point, pointNeighbors)

    const centerDistance = Math.sqrt(
      (point.x - center.x) ** 2 + (point.y - center.y) ** 2
    )
    centerDistances.set(point, centerDistance)

    if (
      x === 1 ||
      x === options.width - 2 ||
      y === 1 ||
      y === options.height - 2
    ) {
      frame.add(point)
    }

    const isLeft = x === 0
    const isRight = x === options.width - 1
    const isTop = y === options.height - 1
    const isBottom = y === 0

    if (!isLeft) {
      pointNeighbors.add(options.inputs[y * options.width + x - 1])
    }
    if (!isRight) {
      pointNeighbors.add(options.inputs[y * options.width + x + 1])
    }
    if (!isTop) {
      pointNeighbors.add(options.inputs[(y + 1) * options.width + x])
    }
    if (!isBottom) {
      pointNeighbors.add(options.inputs[(y - 1) * options.width + x])
    }
    if (!(isLeft || isTop)) {
      pointNeighbors.add(options.inputs[(y + 1) * options.width + x - 1])
    }
    if (!(isLeft || isBottom)) {
      pointNeighbors.add(options.inputs[(y - 1) * options.width + x - 1])
    }
    if (!(isRight || isTop)) {
      pointNeighbors.add(options.inputs[(y + 1) * options.width + x + 1])
    }
    if (!(isRight || isBottom)) {
      pointNeighbors.add(options.inputs[(y - 1) * options.width + x + 1])
    }

    if (x < options.width - 1) {
      x++
    } else {
      x = 0
      y++
    }
  }

  const points = [...options.inputs].sort((a, b) => {
    return (centerDistances.get(a) ?? 0) - (centerDistances.get(center) ?? 0)
  })

  // for (let firstIndex = 0; firstIndex < points.length; firstIndex++) {
  //   const first = points[firstIndex]
  //   for (
  //     let secondIndex = firstIndex + 1;
  //     secondIndex < points.length;
  //     secondIndex++
  //   ) {
  //     const second = points[secondIndex]
  //     const distance = Math.sqrt(
  //       (second.x - first.x) ** 2 + (second.y - first.y) ** 2
  //     )
  //     // graph.get(first)?.set(second, distance)
  //     // graph.get(second)?.set(first, distance)
  //     const compression = Math.max(options.min * 2 - distance, 0)
  //     const expansion = Math.max(options.max * 2 - distance, 0)
  //     if (compression !== 0 || expansion !== 0) {
  //       console.log({ compression, expansion, first, second })
  //     }
  //   }
  // }

  console.log(performance.now() - start)

  console.log(neighbors)
}

export function getPointOffset(
  current: Vector2,
  initial: Vector2,
  neighbor: Vector2,
  radius: number
) {
  const distance = Math.max(
    Math.sqrt((neighbor.x - current.x) ** 2 + (neighbor.y - current.y) ** 2),
    0.0001
  )

  const overlap = Math.max(radius * 2 - distance, 0)

  const offset = {
    x: 0,
    y: 0,
  } satisfies Vector2

  if (overlap !== 0) {
    const deltaX = initial.x - current.x
    const deltaY = initial.y - current.y
    if (deltaX === 0) {
      offset.y = Math.sign(deltaY) * overlap
    } else if (deltaY === 0) {
      offset.x = Math.sign(deltaX) * overlap
    } else {
      // slope/intercept of the line from initial to current
      const m = deltaY / deltaX
      const b = current.y - m * current.x

      // x/y of current on the initial-current line that is closest to the neighbor
      const px = (neighbor.x + m * neighbor.y - m * b) / (m ** 2 + 1)
      const py = (m * neighbor.x + m ** 2 * neighbor.y + b) / (m ** 2 + 1)

      // distance from the initial-current line to the neighbor
      const p = Math.sqrt((neighbor.x - px) ** 2 + (neighbor.y - py) ** 2)

      // distance from the neighbor projection to the result
      const h = Math.sqrt((2 * radius) ** 2 - p ** 2)

      // x/y of the result
      const rx = px + (h * (neighbor.y - py)) / p
      const ry = py - (h * (neighbor.x - px)) / p

      offset.x = rx - current.x
      offset.y = ry - current.y
    }
  }

  return offset
}
