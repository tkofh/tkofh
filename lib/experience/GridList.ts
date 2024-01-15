import type { Vector2, OptionalKeys } from './types'

interface ElementNeighbors {
  readonly right: number | null
  readonly top: number | null
  readonly left: number | null
  readonly bottom: number | null

  readonly topRight: number | null
  readonly topLeft: number | null
  readonly bottomLeft: number | null
  readonly bottomRight: number | null
}

export interface ElementOffsets {
  readonly right: number
  readonly top: number
  readonly left: number
  readonly bottom: number
}

interface ElementPosition extends Vector2 {
  readonly index: number
  readonly neighbors: ElementNeighbors
  readonly offsets: ElementOffsets
}

interface Element<T> {
  readonly value: T
  readonly position: ElementPosition
}

export type OffsetInput =
  | { top: number; right: number }
  | { top: number; left: number }
  | { bottom: number; right: number }
  | { bottom: number; left: number }

export class GridList<T> {
  #elements: Element<T>[] = []

  constructor(
    public readonly size: Readonly<Vector2>,
    initializer: (position: ElementPosition) => T
  ) {
    const length = size.x * size.y

    for (let index = 0; index < length; index++) {
      const x = index % size.x
      const y = Math.floor(index / size.x)

      const offsets: ElementOffsets = {
        right: size.x - x - 1,
        top: size.y - y - 1,
        left: x,
        bottom: y,
      }

      const neighbors: ElementNeighbors = {
        right: offsets.right === 0 ? null : index + 1,
        top: offsets.top === 0 ? null : index + size.x,
        left: offsets.left === 0 ? null : index - 1,
        bottom: offsets.bottom === 0 ? null : index - size.x,

        topRight:
          offsets.right === 0 || offsets.top === 0 ? null : index + size.x + 1,
        topLeft:
          offsets.left === 0 || offsets.top === 0 ? null : index + size.x - 1,
        bottomLeft:
          offsets.left === 0 || offsets.bottom === 0
            ? null
            : index - size.x - 1,
        bottomRight:
          offsets.right === 0 || offsets.bottom === 0
            ? null
            : index - size.x + 1,
      }

      const position: ElementPosition = {
        x,
        y,
        index,
        offsets,
        neighbors,
      }

      const value = initializer(position)

      this.#elements.push({ value, position })
    }
  }

  get elements(): readonly Element<T>[] {
    return this.#elements
  }

  get center(): Readonly<Vector2> {
    return {
      x: Math.floor(this.size.x / 2),
      y: Math.floor(this.size.y / 2),
    }
  }

  sliceByOffsets(offsets: Partial<ElementOffsets>): readonly Element<T>[] {
    const elements: Element<T>[] = []

    const inputRight = offsets.right ?? 0
    const inputTop = offsets.top ?? 0
    const inputLeft = offsets.left ?? 0
    const inputBottom = offsets.bottom ?? 0

    const right = inputRight < 0 ? this.size.x + inputRight : inputRight
    const top = inputTop < 0 ? this.size.y + inputTop : inputTop
    const left = inputLeft < 0 ? this.size.x + inputLeft : inputLeft
    const bottom = inputBottom < 0 ? this.size.y + inputBottom : inputBottom

    for (let y = bottom; y < this.size.y - top; y++) {
      for (let x = left; x < this.size.x - right; x++) {
        const index = y * this.size.x + x

        elements.push(this.#elements[index])
      }
    }

    return elements
  }

  sliceByPositions(
    bottomLeft: Vector2,
    topRight: Vector2
  ): readonly Element<T>[] {
    const elements: Element<T>[] = []

    for (let y = bottomLeft.y; y < topRight.y; y++) {
      for (let x = bottomLeft.x; x < topRight.x; x++) {
        const index = y * this.size.x + x

        elements.push(this.#elements[index])
      }
    }

    return elements
  }

  indexOfOffsets(input: OffsetInput) {
    let x = 0
    let y = 0

    if ('top' in input) {
      if ('right' in input) {
        x = this.size.x - input.right - 1
        y = this.size.y - input.top - 1
      } else {
        x = input.left
        y = this.size.y - input.top - 1
      }
    } else {
      if ('right' in input) {
        x = this.size.x - input.right - 1
        y = input.bottom
      } else {
        x = input.left
        y = input.bottom
      }
    }

    return y * this.size.x + x
  }

  getByOffsets(input: OffsetInput) {
    return this.#elements[this.indexOfOffsets(input)]
  }

  indexOfPosition(position: Vector2) {
    return position.y * this.size.x + position.x
  }

  getByPosition(position: Vector2) {
    return this.#elements[this.indexOfPosition(position)]
  }
}
