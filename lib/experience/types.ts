export interface Vector2<T = number> {
  x: T
  y: T
}

export interface Range {
  min: number
  max: number
}

type UnionKeys<T> = T extends unknown ? keyof T : never

export type OptionalKeys<T> = {
  [P in UnionKeys<T>]?: T extends Record<P, unknown> ? T[P] : never
}
