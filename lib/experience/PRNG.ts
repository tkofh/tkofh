export class PRNG {
  #seed: number
  constructor(seed = 1) {
    if (seed === 0) {
      throw new Error('Seed must not be zero')
    }
    this.#seed = seed
  }

  public next(): number {
    let x = this.#seed
    x ^= x << 13
    x ^= x >> 17
    x ^= x << 5

    this.#seed = x
    return x / 0x100000000
  }
}
