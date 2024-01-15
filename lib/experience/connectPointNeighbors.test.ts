import { describe, test } from 'vitest'
import { GridList } from './GridList'
import { ControlPoint } from './ControlPoint'
import { PRNG } from './PRNG'
import { connectPointNeighbors } from './connectPointNeighbors'

describe('connectPointNeighbors', () => {
  const controlPointFactory = () =>
    new ControlPoint(
      { x: 0, y: 0 },
      { x: false, y: false },
      {
        prng: new PRNG(),
        amplitude: { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } },
        frequency: { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } },
        minDistance: 0,
      }
    )

  describe('corners', () => {
    test('should have three neighbors', ({ expect }) => {
      const grid = new GridList({ x: 5, y: 5 }, controlPointFactory)

      connectPointNeighbors(grid)

      expect(grid.getByOffsets({ top: 0, right: 0 }).value.neighbors.size).toBe(
        3
      )
      expect(grid.getByOffsets({ top: 0, left: 0 }).value.neighbors.size).toBe(
        3
      )
      expect(
        grid.getByOffsets({ bottom: 0, left: 0 }).value.neighbors.size
      ).toBe(3)
      expect(
        grid.getByOffsets({ bottom: 0, right: 0 }).value.neighbors.size
      ).toBe(3)
    })

    test('should connect to adjacent frame points', ({ expect }) => {
      const grid = new GridList({ x: 5, y: 5 }, controlPointFactory)

      connectPointNeighbors(grid)

      const topRight = grid.getByOffsets({ top: 0, right: 0 })
      expect(
        topRight.value.neighbors.has(
          grid.getByOffsets({ top: 1, right: 0 }).value
        )
      ).toBe(true)
      expect(
        topRight.value.neighbors.has(
          grid.getByOffsets({ top: 0, right: 1 }).value
        )
      ).toBe(true)
      expect(
        topRight.value.neighbors.has(
          grid.getByOffsets({ top: 1, right: 1 }).value
        )
      ).toBe(true)

      const topLeft = grid.getByOffsets({ top: 0, left: 0 })
      expect(
        topLeft.value.neighbors.has(
          grid.getByOffsets({ top: 1, left: 0 }).value
        )
      ).toBe(true)
      expect(
        topLeft.value.neighbors.has(
          grid.getByOffsets({ top: 0, left: 1 }).value
        )
      ).toBe(true)
      expect(
        topLeft.value.neighbors.has(
          grid.getByOffsets({ top: 1, left: 1 }).value
        )
      ).toBe(true)

      const bottomLeft = grid.getByOffsets({ bottom: 0, left: 0 })
      expect(
        bottomLeft.value.neighbors.has(
          grid.getByOffsets({ bottom: 1, left: 0 }).value
        )
      ).toBe(true)
      expect(
        bottomLeft.value.neighbors.has(
          grid.getByOffsets({ bottom: 0, left: 1 }).value
        )
      ).toBe(true)
      expect(
        bottomLeft.value.neighbors.has(
          grid.getByOffsets({ bottom: 1, left: 1 }).value
        )
      ).toBe(true)

      const bottomRight = grid.getByOffsets({ bottom: 0, right: 0 })
      expect(
        bottomRight.value.neighbors.has(
          grid.getByOffsets({ bottom: 1, right: 0 }).value
        )
      ).toBe(true)
      expect(
        bottomRight.value.neighbors.has(
          grid.getByOffsets({ bottom: 0, right: 1 }).value
        )
      ).toBe(true)
      expect(
        bottomRight.value.neighbors.has(
          grid.getByOffsets({ bottom: 1, right: 1 }).value
        )
      ).toBe(true)
    })
  })

  describe('spokes', () => {
    test('should have one neighbor', ({ expect }) => {
      const grid = new GridList({ x: 5, y: 5 }, controlPointFactory)

      connectPointNeighbors(grid)

      expect(grid.getByOffsets({ top: 1, right: 0 }).value.neighbors.size).toBe(
        1
      )
      expect(grid.getByOffsets({ top: 0, right: 1 }).value.neighbors.size).toBe(
        1
      )

      expect(grid.getByOffsets({ top: 0, left: 1 }).value.neighbors.size).toBe(
        1
      )
      expect(grid.getByOffsets({ top: 1, left: 0 }).value.neighbors.size).toBe(
        1
      )

      expect(
        grid.getByOffsets({ bottom: 1, left: 0 }).value.neighbors.size
      ).toBe(1)
      expect(
        grid.getByOffsets({ bottom: 0, left: 1 }).value.neighbors.size
      ).toBe(1)

      expect(
        grid.getByOffsets({ bottom: 0, right: 1 }).value.neighbors.size
      ).toBe(1)
      expect(
        grid.getByOffsets({ bottom: 1, right: 0 }).value.neighbors.size
      ).toBe(1)
    })
    test('should connect spokes to their frame neighbor', ({ expect }) => {
      const grid = new GridList({ x: 5, y: 5 }, controlPointFactory)

      connectPointNeighbors(grid)

      expect(
        grid
          .getByOffsets({ top: 1, right: 0 })
          .value.neighbors.has(grid.getByOffsets({ top: 1, right: 1 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ top: 0, right: 1 })
          .value.neighbors.has(grid.getByOffsets({ top: 1, right: 1 }).value)
      ).toBe(true)

      expect(
        grid
          .getByOffsets({ top: 0, left: 1 })
          .value.neighbors.has(grid.getByOffsets({ top: 1, left: 1 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ top: 1, left: 0 })
          .value.neighbors.has(grid.getByOffsets({ top: 1, left: 1 }).value)
      ).toBe(true)

      expect(
        grid
          .getByOffsets({ bottom: 1, left: 0 })
          .value.neighbors.has(grid.getByOffsets({ bottom: 1, left: 1 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ bottom: 0, left: 1 })
          .value.neighbors.has(grid.getByOffsets({ bottom: 1, left: 1 }).value)
      ).toBe(true)

      expect(
        grid
          .getByOffsets({ bottom: 0, right: 1 })
          .value.neighbors.has(grid.getByOffsets({ bottom: 1, right: 1 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ bottom: 1, right: 0 })
          .value.neighbors.has(grid.getByOffsets({ bottom: 1, right: 1 }).value)
      ).toBe(true)
    })
  })

  describe('edges', () => {
    test('should have four neighbors when not tailing', ({ expect }) => {
      const grid = new GridList({ x: 7, y: 7 }, controlPointFactory)

      connectPointNeighbors(grid)

      const rightEdgeWithoutTail = grid.sliceByOffsets({
        left: -1,
        top: 3,
        bottom: 2,
      })
      const topEdgeWithoutTail = grid.sliceByOffsets({
        bottom: -1,
        left: 3,
        right: 2,
      })
      const leftEdgeWithoutTail = grid.sliceByOffsets({
        right: -1,
        bottom: 3,
        top: 2,
      })
      const bottomEdgeWithoutTail = grid.sliceByOffsets({
        top: -1,
        right: 3,
        left: 2,
      })
      for (const { value } of [
        ...rightEdgeWithoutTail,
        ...topEdgeWithoutTail,
        ...leftEdgeWithoutTail,
        ...bottomEdgeWithoutTail,
      ]) {
        expect(value.neighbors.size).toBe(4)
      }
    })

    test('should have five neighbors when tailing', ({ expect }) => {
      const grid = new GridList({ x: 7, y: 7 }, controlPointFactory)

      connectPointNeighbors(grid)

      const rightEdgeTail = grid.getByOffsets({ right: 0, top: 2 })
      const topEdgeTail = grid.getByOffsets({ top: 0, left: 2 })
      const leftEdgeTail = grid.getByOffsets({ left: 0, bottom: 2 })
      const bottomEdgeTail = grid.getByOffsets({ bottom: 0, right: 2 })

      expect(rightEdgeTail.value.neighbors.size).toBe(5)
      expect(topEdgeTail.value.neighbors.size).toBe(5)
      expect(leftEdgeTail.value.neighbors.size).toBe(5)
      expect(bottomEdgeTail.value.neighbors.size).toBe(5)
    })

    test('should connect to their frame neighbors', ({ expect }) => {
      const grid = new GridList({ x: 7, y: 7 }, controlPointFactory)

      connectPointNeighbors(grid)

      const rightEdge = grid.sliceByOffsets({ left: -1, top: 2, bottom: 2 })
      for (const { value, position } of rightEdge) {
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x - 1, y: position.y + 1 }).value
          )
        ).toBe(true)
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x - 1, y: position.y }).value
          )
        ).toBe(true)
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x - 1, y: position.y - 1 }).value
          )
        ).toBe(true)
      }

      const topEdge = grid.sliceByOffsets({ left: 2, right: 2, bottom: -1 })
      for (const { value, position } of topEdge) {
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x + 1, y: position.y - 1 }).value
          )
        ).toBe(true)
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x, y: position.y - 1 }).value
          )
        ).toBe(true)
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x - 1, y: position.y - 1 }).value
          )
        ).toBe(true)
      }
      const leftEdge = grid.sliceByOffsets({ right: -1, top: 2, bottom: 2 })
      for (const { value, position } of leftEdge) {
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x + 1, y: position.y + 1 }).value
          )
        ).toBe(true)
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x + 1, y: position.y }).value
          )
        ).toBe(true)
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x + 1, y: position.y - 1 }).value
          )
        ).toBe(true)
      }

      const bottomEdge = grid.sliceByOffsets({ left: 2, right: 2, top: -1 })
      for (const { value, position } of bottomEdge) {
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x + 1, y: position.y + 1 }).value
          )
        ).toBe(true)
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x, y: position.y + 1 }).value
          )
        ).toBe(true)
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x - 1, y: position.y + 1 }).value
          )
        ).toBe(true)
      }
    })

    test('should connect to their leading edge point when not leading', ({
      expect,
    }) => {
      const grid = new GridList({ x: 7, y: 7 }, controlPointFactory)

      connectPointNeighbors(grid)

      const rightTailingEdge = grid.sliceByOffsets({
        left: -1,
        bottom: 3,
        top: 2,
      })
      for (const { value, position } of rightTailingEdge) {
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x, y: position.y - 1 }).value
          )
        ).toBe(true)
      }

      const topTailingEdge = grid.sliceByOffsets({
        bottom: -1,
        right: 3,
        left: 2,
      })
      for (const { value, position } of topTailingEdge) {
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x + 1, y: position.y }).value
          )
        ).toBe(true)
      }

      const leftTailingEdge = grid.sliceByOffsets({
        right: -1,
        top: 3,
        bottom: 2,
      })
      for (const { value, position } of leftTailingEdge) {
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x, y: position.y + 1 }).value
          )
        ).toBe(true)
      }

      const bottomTailingEdge = grid.sliceByOffsets({
        top: -1,
        left: 3,
        right: 2,
      })
      for (const { value, position } of bottomTailingEdge) {
        expect(
          value.neighbors.has(
            grid.getByPosition({ x: position.x - 1, y: position.y }).value
          )
        ).toBe(true)
      }
    })

    test('should connect to spokes when at the extremes', ({ expect }) => {
      const grid = new GridList({ x: 7, y: 7 }, controlPointFactory)

      connectPointNeighbors(grid)

      expect(
        grid
          .getByOffsets({ top: 2, right: 0 })
          .value.neighbors.has(grid.getByOffsets({ top: 1, right: 0 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ top: 0, right: 2 })
          .value.neighbors.has(grid.getByOffsets({ top: 0, right: 1 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ top: 0, left: 2 })
          .value.neighbors.has(grid.getByOffsets({ top: 0, left: 1 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ top: 2, left: 0 })
          .value.neighbors.has(grid.getByOffsets({ top: 1, left: 0 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ bottom: 2, left: 0 })
          .value.neighbors.has(grid.getByOffsets({ bottom: 1, left: 0 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ bottom: 0, left: 2 })
          .value.neighbors.has(grid.getByOffsets({ bottom: 0, left: 1 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ bottom: 0, right: 2 })
          .value.neighbors.has(grid.getByOffsets({ bottom: 0, right: 1 }).value)
      ).toBe(true)
      expect(
        grid
          .getByOffsets({ bottom: 2, right: 0 })
          .value.neighbors.has(grid.getByOffsets({ bottom: 1, right: 0 }).value)
      ).toBe(true)
    })
  })

  // separate gutters by partition to count expected neighbors
  // describe('gutters', () => {
  // })
})
