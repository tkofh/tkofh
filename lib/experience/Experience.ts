import { ControlGrid } from './ControlGrid'
import { PRNG } from './PRNG'
import type { Vector2 } from './types'

interface Options {
  seed: number
  grid: Vector2
  // subdivisions: number
}

export class Experience {
  #prng: PRNG
  #grid: ControlGrid

  constructor(options: Options) {
    this.#prng = new PRNG(options.seed)

    this.#grid = new ControlGrid({
      prng: this.#prng,
      points: options.grid,
    })
    console.log(this.#grid)
  }
}
