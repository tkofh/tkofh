export class Oscillator {
  constructor(
    private readonly amplitude: number,
    private readonly frequency: number,
    private readonly offset: number
  ) {}

  value(time: number) {
    return (
      this.amplitude *
      Math.sin(this.offset + this.frequency * time * Math.PI * 2)
    )
  }
}
