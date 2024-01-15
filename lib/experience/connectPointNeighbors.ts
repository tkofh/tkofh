import type { ControlPoint } from './ControlPoint'
import type { GridList } from './GridList'

const directions = ['right', 'top', 'left', 'bottom'] as const
const nextLookup = {
  right: 'top',
  top: 'left',
  left: 'bottom',
  bottom: 'right',
} as const
const prevLookup = {
  right: 'bottom',
  top: 'right',
  left: 'top',
  bottom: 'left',
} as const
const innerLookup = {
  right: 'left',
  top: 'bottom',
  left: 'right',
  bottom: 'top',
} as const
const innerNextLookup = {
  right: 'topLeft',
  top: 'bottomLeft',
  left: 'bottomRight',
  bottom: 'topRight',
} as const
const innerPrevLookup = {
  right: 'bottomLeft',
  top: 'bottomRight',
  left: 'topRight',
  bottom: 'topLeft',
} as const
const outerNextLookup = {
  right: 'topRight',
  top: 'topLeft',
  left: 'bottomLeft',
  bottom: 'bottomRight',
} as const
const outerPrevLookup = {
  right: 'bottomRight',
  top: 'topRight',
  left: 'topLeft',
  bottom: 'bottomLeft',
} as const

export function connectPointNeighbors(grid: GridList<ControlPoint>): void {
  for (const direction of directions) {
    const next = nextLookup[direction]
    const prev = prevLookup[direction]

    const innerNext = innerNextLookup[direction]
    const inner = innerLookup[direction]
    const innerPrev = innerPrevLookup[direction]

    const outerNext = outerNextLookup[direction]
    const outerPrev = outerPrevLookup[direction]

    // edges, spokes, and corners
    for (const element of grid.sliceByOffsets({ [inner]: -1 })) {
      const elementNext = element.position.neighbors[next]
      const elementInnerNext = element.position.neighbors[innerNext]
      const elementInner = element.position.neighbors[inner]
      const elementInnerPrev = element.position.neighbors[innerPrev]
      const elementPrev = element.position.neighbors[prev]

      if (elementInner !== null) {
        element.value.neighbors.add(grid.elements[elementInner].value)
      }

      if (
        element.position.offsets[next] !== 1 &&
        element.position.offsets[prev] !== 1
      ) {
        if (elementInnerNext !== null) {
          element.value.neighbors.add(grid.elements[elementInnerNext].value)
        }
        if (elementInnerPrev !== null) {
          element.value.neighbors.add(grid.elements[elementInnerPrev].value)
        }

        if (
          (element.position.offsets[next] === 0 ||
            element.position.offsets[prev] === 2) &&
          elementPrev !== null
        ) {
          element.value.neighbors.add(grid.elements[elementPrev].value)
        }
        if (
          (element.position.offsets[prev] === 0 ||
            element.position.offsets[next] === 2) &&
          elementNext !== null
        ) {
          element.value.neighbors.add(grid.elements[elementNext].value)
        }

        if (
          element.position.offsets[next] >= 2 &&
          element.position.offsets[prev] >= 3 &&
          elementPrev !== null
        ) {
          element.value.neighbors.add(grid.elements[elementPrev].value)
        }
      }
    }

    // gutters
    for (const element of grid.sliceByOffsets({
      [direction]: 2,
      [inner]: -3,
      [next]: 2,
      [prev]: 2,
    })) {
      const elementOuterNext = element.position.neighbors[outerNext]
      const outer = element.position.neighbors[direction]
      const elementOuterPrev = element.position.neighbors[outerPrev]

      if (elementOuterNext !== null) {
        element.value.neighbors.add(grid.elements[elementOuterNext].value)
      }
      if (outer !== null) {
        element.value.neighbors.add(grid.elements[outer].value)
      }
      if (elementOuterPrev !== null) {
        element.value.neighbors.add(grid.elements[elementOuterPrev].value)
      }
    }
  }
}
