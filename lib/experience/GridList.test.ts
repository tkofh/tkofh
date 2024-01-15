import { describe, test } from 'vitest'
import { GridList } from './GridList'

describe('GridList', () => {
  test('should be able to create a grid list', ({ expect }) => {
    const sizeX = 3
    const sizeY = 3
    const grid = new GridList({ x: sizeX, y: sizeY }, () => null)

    expect(grid.elements).toHaveLength(sizeX * sizeY)

    for (let y = 0; y < sizeY; y++) {
      for (let x = 0; x < sizeX; x++) {
        const index = y * sizeX + x
        expect(grid.elements[index].position.x).toBe(x)
        expect(grid.elements[index].position.y).toBe(y)
        expect(grid.elements[index].position.index).toBe(index)

        expect(grid.elements[index].position.offsets.left).toBe(x)
        expect(grid.elements[index].position.offsets.right).toBe(sizeX - x - 1)
        expect(grid.elements[index].position.offsets.bottom).toBe(y)
        expect(grid.elements[index].position.offsets.top).toBe(sizeY - y - 1)

        if (x === 0) {
          expect(grid.elements[index].position.neighbors.left).toBe(null)
        } else {
          expect(grid.elements[index].position.neighbors.left).toBe(index - 1)
        }

        if (x === sizeX - 1) {
          expect(grid.elements[index].position.neighbors.right).toBe(null)
        } else {
          expect(grid.elements[index].position.neighbors.right).toBe(index + 1)
        }

        if (y === 0) {
          expect(grid.elements[index].position.neighbors.bottom).toBe(null)
        } else {
          expect(grid.elements[index].position.neighbors.bottom).toBe(
            index - sizeX
          )
        }

        if (y === sizeY - 1) {
          expect(grid.elements[index].position.neighbors.top).toBe(null)
        } else {
          expect(grid.elements[index].position.neighbors.top).toBe(
            index + sizeX
          )
        }
      }
    }
  })

  test('should be able to get elements by position', ({ expect }) => {
    const sizeX = 3
    const sizeY = 3
    const grid = new GridList({ x: sizeX, y: sizeY }, () => null)

    for (let y = 0; y < sizeY; y++) {
      for (let x = 0; x < sizeX; x++) {
        const index = y * sizeX + x
        expect(grid.getByPosition({ x, y }).position.index).toBe(index)
      }
    }
  })

  test('should be able to get elements by offset', ({ expect }) => {
    const sizeX = 3
    const sizeY = 3
    const grid = new GridList({ x: sizeX, y: sizeY }, () => null)

    expect(grid.getByOffsets({ left: 0, bottom: 0 }).position.index).toBe(0)
    expect(grid.getByOffsets({ left: 0, top: 0 }).position.index).toBe(
      sizeX * (sizeY - 1)
    )
    expect(grid.getByOffsets({ right: 0, bottom: 0 }).position.index).toBe(
      sizeX - 1
    )
    expect(grid.getByOffsets({ right: 0, top: 0 }).position.index).toBe(
      sizeX * sizeY - 1
    )
  })

  test('should be able to slice by offsets', ({ expect }) => {
    const sizeX = 3
    const sizeY = 3
    const grid = new GridList({ x: sizeX, y: sizeY }, () => null)

    expect(
      grid.sliceByOffsets({ right: 1, top: 1, left: 1, bottom: 1 })
    ).toHaveLength((sizeX - 2) * (sizeY - 2))
  })

  test('should be able to slice by negative offsets', ({ expect }) => {
    const sizeX = 3
    const sizeY = 3
    const grid = new GridList({ x: sizeX, y: sizeY }, () => null)

    expect(
      grid.sliceByOffsets({ right: -2, top: -2, left: -2, bottom: -2 })
    ).toHaveLength(1)
    expect(grid.sliceByOffsets({ right: -1 })).toHaveLength(3)
  })

  test('should be able to slice by positions', ({ expect }) => {
    const sizeX = 3
    const sizeY = 3
    const grid = new GridList({ x: sizeX, y: sizeY }, () => null)

    expect(grid.sliceByPositions({ x: 1, y: 1 }, { x: 2, y: 2 })).toHaveLength(
      1
    )
  })
})
