import { lerp } from 'micro-math'
import type { PRNG } from './PRNG'
import type { Vector2, Range } from './types'
import { Oscillator } from './Oscillator'
// import type { SpringSystem, Spring } from 'coily'

export interface ControlPointOptions {
  prng: PRNG
  // springs: SpringSystem
  amplitude: Vector2<Range>
  frequency: Vector2<Range>
  minDistance: number
}

export class ControlPoint {
  readonly #freeze: Readonly<Vector2<boolean>>

  readonly #initialPosition: Readonly<Vector2>
  readonly #current: Vector2

  readonly #oscillators: Vector2<Oscillator>

  readonly #minDistance: number

  readonly neighbors: Set<ControlPoint> = new Set()

  constructor(
    position: Vector2,
    freeze: Vector2<boolean>,
    options: ControlPointOptions
  ) {
    this.#current = { ...position }
    this.#initialPosition = { ...position }

    this.#freeze = freeze

    this.#oscillators = {
      x: new Oscillator(
        lerp(
          options.prng.next(),
          options.amplitude.x.min,
          options.amplitude.x.max
        ),
        lerp(
          options.prng.next(),
          options.frequency.x.min,
          options.frequency.x.max
        ),
        options.prng.next() * Math.PI * 2
      ),
      y: new Oscillator(
        lerp(
          options.prng.next(),
          options.amplitude.y.min,
          options.amplitude.y.max
        ),
        lerp(
          options.prng.next(),
          options.frequency.y.min,
          options.frequency.y.max
        ),
        options.prng.next() * Math.PI * 2
      ),
    }

    this.#minDistance = options.minDistance
  }

  public update(time: number) {
    if (!this.#freeze.x) {
      this.#current.x =
        this.#oscillators.x.value(time) + this.#initialPosition.x
    }
    if (!this.#freeze.y) {
      this.#current.y =
        this.#oscillators.y.value(time) + this.#initialPosition.y
    }
  }

  public correct() {
    if (this.#freeze.x && this.#freeze.y) return

    const correction: Vector2 = { x: 0, y: 0 }
    let corrections = 0

    for (const neighbor of this.neighbors) {
      const squareDistance =
        (neighbor.#current.x - this.#current.x) ** 2 +
        (neighbor.#current.y - this.#current.y) ** 2

      if (squareDistance < this.#minDistance ** 2) {
        corrections++

        const distance = Math.sqrt(squareDistance)
        const overlap = this.#minDistance - distance

        const selfDeltaX = this.#initialPosition.x - this.#current.x
        const selfDeltaY = this.#initialPosition.y - this.#current.y

        if (selfDeltaX === 0) {
          correction.y += Math.sign(selfDeltaY) * overlap
        } else if (selfDeltaY === 0) {
          correction.x += Math.sign(selfDeltaX) * overlap
        } else {
          // slope/intercept of the line from initial to current
          const m = selfDeltaY / selfDeltaX
          const b = this.#current.y - m * this.#current.x

          // x/y of current on the initial-current line that is closest to the neighbor
          const px =
            (neighbor.position.x + m * neighbor.position.y - m * b) /
            (m ** 2 + 1)
          const py =
            (m * neighbor.position.x + m ** 2 * neighbor.position.y + b) /
            (m ** 2 + 1)

          // distance from the initial-current line to the neighbor
          const p = Math.sqrt(
            (neighbor.position.x - px) ** 2 + (neighbor.position.y - py) ** 2
          )

          // distance from the neighbor projection to the result
          const h = Math.sqrt(this.#minDistance ** 2 - p ** 2)

          // x/y of the result
          correction.x +=
            px + (h * (neighbor.position.y - py)) / p - this.#current.x
          correction.y +=
            py - (h * (neighbor.position.x - px)) / p - this.#current.y
        }
      }
    }

    this.#current.x += corrections === 0 ? 0 : correction.x / corrections
    this.#current.y += corrections === 0 ? 0 : correction.y / corrections
  }

  get position(): Vector2 {
    return this.#current
  }

  get freeze(): Vector2<boolean> {
    return this.#freeze
  }
}
