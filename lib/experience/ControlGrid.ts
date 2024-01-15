import type { PRNG } from './PRNG'
import type { Vector2 } from './types'
import { ControlPoint, type ControlPointOptions } from './ControlPoint'
import { GridList, type ElementOffsets, type OffsetInput } from './GridList'
import { connectPointNeighbors } from './connectPointNeighbors'

interface Options {
  prng: PRNG
  points: Vector2
}

export class ControlGrid {
  readonly #prng: PRNG
  readonly #grid: GridList<ControlPoint>

  constructor(options: Options) {
    console.log(options)
    this.#prng = options.prng

    const spacing: Vector2 = {
      x: 2 / (options.points.x - 1),
      y: 2 / (options.points.y - 1),
    }

    const pointOptions: ControlPointOptions = {
      prng: this.#prng,
      amplitude: {
        x: { min: -spacing.x, max: spacing.x },
        y: { min: -spacing.y, max: spacing.y },
      },
      frequency: {
        x: { min: 0.1, max: 0.7 },
        y: { min: 0.1, max: 0.7 },
      },
      minDistance: Math.min(spacing.x, spacing.y) * 0.25,
    }

    this.#grid = new GridList(
      { x: options.points.x + 2, y: options.points.y + 2 },
      (position) => {
        const x = position.x - 1
        const y = position.y - 1

        const isFrameX =
          position.offsets.left === 1 || position.offsets.right === 1
        const isFrameY =
          position.offsets.top === 1 || position.offsets.bottom === 1

        const isFrameStructureX =
          isFrameX ||
          position.offsets.left === 0 ||
          position.offsets.right === 0
        const isFrameStructureY =
          isFrameY ||
          position.offsets.top === 0 ||
          position.offsets.bottom === 0

        return new ControlPoint(
          { x: x * spacing.x - 1, y: y * spacing.y - 1 },
          {
            x: isFrameX || (isFrameStructureY && !isFrameStructureX),
            y: isFrameY || (isFrameStructureX && !isFrameStructureY),
          },
          pointOptions
        )
      }
    )

    connectPointNeighbors(this.#grid)

    // right edge
    // for (const { value, position } of grid.sliceByOffsets({
    //   right: 0,
    //   top: 0,
    //   left: -1,
    //   bottom: 0,
    // })) {
    //   if (position.neighbors.left !== null) {
    //     value.neighbors.add(grid.elements[position.neighbors.left].value)
    //   }

    //   if (position.offsets.top !== 1 && position.offsets.bottom !== 1) {
    //     if (position.neighbors.topLeft !== null) {
    //       value.neighbors.add(grid.elements[position.neighbors.topLeft].value)
    //     }
    //     if (position.neighbors.bottomLeft !== null) {
    //       value.neighbors.add(
    //         grid.elements[position.neighbors.bottomLeft].value
    //       )
    //     }

    //     if (
    //       (position.offsets.top === 0 || position.offsets.bottom === 2) &&
    //       position.neighbors.bottom !== null
    //     ) {
    //       value.neighbors.add(grid.elements[position.neighbors.bottom].value)
    //     }
    //     if (
    //       (position.offsets.bottom === 0 || position.offsets.top === 2) &&
    //       position.neighbors.top !== null
    //     ) {
    //       value.neighbors.add(grid.elements[position.neighbors.top].value)
    //     }
    //   }

    //   if (
    //     position.offsets.top >= 3 &&
    //     position.offsets.bottom >= 2 &&
    //     position.neighbors.top !== null
    //   ) {
    //     value.neighbors.add(grid.elements[position.neighbors.top].value)
    //   }
    // }

    // for (const { value, position } of grid.elements) {
    //   const isRightEdge = position.offsets.right === 0
    //   const isRightFrame = position.offsets.right === 1
    //   const isRightGutter = position.offsets.right === 2
    //   const isTopEdge = position.offsets.top === 0
    //   const isTopFrame = position.offsets.top === 1
    //   const isTopGutter = position.offsets.top === 2
    //   const isLeftEdge = position.offsets.left === 0
    //   const isLeftFrame = position.offsets.left === 1
    //   const isLeftGutter = position.offsets.left === 2
    //   const isBottomEdge = position.offsets.bottom === 0
    //   const bottomFrame = position.offsets.bottom === 1
    //   const bottomGutter = position.offsets.bottom === 2

    //   const hasRight = position.neighbors.right !== null
    //   const hasTopRight = position.neighbors.topRight !== null
    //   const hasTop = position.neighbors.top !== null
    //   const hasTopLeft = position.neighbors.topLeft !== null
    //   const hasLeft = position.neighbors.left !== null
    //   const hasBottomLeft = position.neighbors.bottomLeft !== null
    //   const hasBottom = position.neighbors.bottom !== null
    //   const hasBottomRight = position.neighbors.bottomRight !== null

    //   const centerY = position.y === grid.center.y
    //   const aboveCenterY = position.y > grid.center.y
    //   const belowCenterY = position.y < grid.center.y
    //   const centerX = position.x === grid.center.x
    //   const rightOfCenterX = position.x > grid.center.x
    //   const leftOfCenterX = position.x < grid.center.x

    //   const rightPartition = centerY && rightOfCenterX
    //   const topRightPartition = aboveCenterY && rightOfCenterX
    //   const topPartition = aboveCenterY && centerX
    //   const topLeftPartition = aboveCenterY && leftOfCenterX
    //   const leftPartition = centerY && leftOfCenterX
    //   const bottomLeftPartition = belowCenterY && leftOfCenterX
    //   const bottomPartition = belowCenterY && centerX
    //   const bottomRightPartition = belowCenterY && rightOfCenterX

    //   if (isRightEdge || isLeftEdge) {
    //     if ((isTopEdge || bottomGutter) && hasBottom) {
    //       value.neighbors.add(grid.elements[position.neighbors.bottom].value)
    //     }
    //     if ((isBottomEdge || isTopGutter) && hasTop) {
    //       value.neighbors.add(grid.elements[position.neighbors.top].value)
    //     }

    //     if (!isTopFrame && !bottomFrame) {
    //       if (aboveCenterY && hasBottom) {
    //         value.neighbors.add(grid.elements[position.neighbors.bottom].value)
    //       } else if (belowCenterY && hasTop) {
    //         value.neighbors.add(grid.elements[position.neighbors.top].value)
    //       }
    //     }

    //     if (isRightEdge) {
    //       if (hasBottomLeft && !bottomFrame && !isTopFrame) {
    //         value.neighbors.add(
    //           grid.elements[position.neighbors.bottomLeft].value
    //         )
    //       }
    //       if (hasLeft) {
    //         value.neighbors.add(grid.elements[position.neighbors.left].value)
    //       }
    //       if (hasTopLeft && !bottomFrame && !isTopFrame) {
    //         value.neighbors.add(grid.elements[position.neighbors.topLeft].value)
    //       }
    //     } else if (isLeftEdge) {
    //       if (hasTopRight && !isTopFrame && !bottomFrame) {
    //         value.neighbors.add(
    //           grid.elements[position.neighbors.topRight].value
    //         )
    //       }
    //       if (hasRight) {
    //         value.neighbors.add(grid.elements[position.neighbors.right].value)
    //       }
    //       if (hasBottomRight && !isTopFrame && !bottomFrame) {
    //         value.neighbors.add(
    //           grid.elements[position.neighbors.bottomRight].value
    //         )
    //       }
    //     }
    //   }
    //   if (isTopEdge || isBottomEdge) {
    //     if ((isRightEdge || isLeftGutter) && hasLeft) {
    //       value.neighbors.add(grid.elements[position.neighbors.left].value)
    //     }
    //     if ((isLeftEdge || isRightGutter) && hasRight) {
    //       value.neighbors.add(grid.elements[position.neighbors.right].value)
    //     }

    //     if (!isLeftFrame && !isRightFrame) {
    //       if (rightOfCenterX && hasLeft) {
    //         value.neighbors.add(grid.elements[position.neighbors.left].value)
    //       } else if (leftOfCenterX && hasRight) {
    //         value.neighbors.add(grid.elements[position.neighbors.right].value)
    //       }
    //     }

    //     if (isTopEdge) {
    //       if (hasBottomLeft && !isLeftFrame && !isRightFrame) {
    //         value.neighbors.add(
    //           grid.elements[position.neighbors.bottomLeft].value
    //         )
    //       }
    //       if (hasBottom) {
    //         value.neighbors.add(grid.elements[position.neighbors.bottom].value)
    //       }
    //       if (hasBottomRight && !isLeftFrame && !isRightFrame) {
    //         value.neighbors.add(
    //           grid.elements[position.neighbors.bottomRight].value
    //         )
    //       }
    //     } else if (isBottomEdge) {
    //       if (hasTopRight && !isRightFrame && !isLeftFrame) {
    //         value.neighbors.add(
    //           grid.elements[position.neighbors.topRight].value
    //         )
    //       }
    //       if (hasTop) {
    //         value.neighbors.add(grid.elements[position.neighbors.top].value)
    //       }
    //       if (hasTopLeft && !isRightFrame && !isLeftFrame) {
    //         value.neighbors.add(grid.elements[position.neighbors.topLeft].value)
    //       }
    //     }
    //   }

    //   if (
    //     hasRight &&
    //     hasTopRight &&
    //     hasTop &&
    //     hasTopLeft &&
    //     hasLeft &&
    //     hasBottomLeft &&
    //     hasBottom &&
    //     hasBottomRight
    //   ) {
    //     if (isRightGutter) {
    //       value.neighbors.add(grid.elements[position.neighbors.topRight].value)
    //       value.neighbors.add(grid.elements[position.neighbors.right].value)
    //       value.neighbors.add(
    //         grid.elements[position.neighbors.bottomRight].value
    //       )
    //     }
    //     if (isTopGutter) {
    //       value.neighbors.add(grid.elements[position.neighbors.topLeft].value)
    //       value.neighbors.add(grid.elements[position.neighbors.top].value)
    //       value.neighbors.add(grid.elements[position.neighbors.topRight].value)
    //     }
    //     if (isLeftGutter) {
    //       value.neighbors.add(grid.elements[position.neighbors.topLeft].value)
    //       value.neighbors.add(grid.elements[position.neighbors.left].value)
    //       value.neighbors.add(
    //         grid.elements[position.neighbors.bottomLeft].value
    //       )
    //     }
    //     if (bottomGutter) {
    //       value.neighbors.add(
    //         grid.elements[position.neighbors.bottomLeft].value
    //       )
    //       value.neighbors.add(grid.elements[position.neighbors.bottom].value)
    //       value.neighbors.add(
    //         grid.elements[position.neighbors.bottomRight].value
    //       )
    //     }

    //     if (rightPartition) {
    //       value.neighbors.add(grid.elements[position.neighbors.left].value)
    //     } else if (topRightPartition) {
    //       value.neighbors.add(
    //         grid.elements[position.neighbors.bottomLeft].value
    //       )
    //       value.neighbors.add(grid.elements[position.neighbors.bottom].value)
    //     } else if (topPartition) {
    //       value.neighbors.add(grid.elements[position.neighbors.right].value)
    //       value.neighbors.add(
    //         grid.elements[position.neighbors.bottomRight].value
    //       )
    //       value.neighbors.add(grid.elements[position.neighbors.bottom].value)
    //     } else if (topLeftPartition) {
    //       value.neighbors.add(grid.elements[position.neighbors.right].value)
    //       value.neighbors.add(
    //         grid.elements[position.neighbors.bottomRight].value
    //       )
    //     } else if (leftPartition) {
    //       value.neighbors.add(grid.elements[position.neighbors.right].value)
    //       value.neighbors.add(grid.elements[position.neighbors.topRight].value)
    //       value.neighbors.add(grid.elements[position.neighbors.top].value)
    //     } else if (bottomLeftPartition) {
    //       value.neighbors.add(grid.elements[position.neighbors.topRight].value)
    //       value.neighbors.add(grid.elements[position.neighbors.top].value)
    //     } else if (bottomPartition) {
    //       value.neighbors.add(grid.elements[position.neighbors.topLeft].value)
    //       value.neighbors.add(grid.elements[position.neighbors.top].value)
    //       value.neighbors.add(grid.elements[position.neighbors.topRight].value)
    //     } else if (bottomRightPartition) {
    //       value.neighbors.add(grid.elements[position.neighbors.topLeft].value)
    //       value.neighbors.add(grid.elements[position.neighbors.top].value)
    //     }
    //   }
    // }

    // const pointsToUpdate = new Set<ControlPoint>([
    //   grid.getByOffsets({ right: 0, top: 1 }).value,
    //   grid.getByOffsets({ right: 1, top: 0 }).value,
    //   grid.getByOffsets({ left: 1, top: 0 }).value,
    //   grid.getByOffsets({ left: 0, top: 1 }).value,
    //   grid.getByOffsets({ left: 0, bottom: 1 }).value,
    //   grid.getByOffsets({ left: 1, bottom: 0 }).value,
    //   grid.getByOffsets({ right: 1, bottom: 0 }).value,
    //   grid.getByOffsets({ right: 0, bottom: 1 }).value,
    // ])

    // const centerElement = grid.getByPosition(grid.center)

    // pointsToUpdate.add(centerElement.value)

    // const maxOffsets = centerElement.position.offsets
    // const shortestOffset = Math.min(
    //   maxOffsets.right,
    //   maxOffsets.top,
    //   maxOffsets.left,
    //   maxOffsets.bottom
    // )
    // const rings = shortestOffset - 2
    // const deltaOffsets: ElementOffsets = {
    //   right: maxOffsets.right - shortestOffset,
    //   top: maxOffsets.top - shortestOffset,
    //   left: maxOffsets.left - shortestOffset,
    //   bottom: maxOffsets.bottom - shortestOffset,
    // }
  }
}
