import { createStage } from "@webgl-tools/stage"
import { lerp } from "micro-math"
import type { Vector2 } from "~/types/Vector2"
import vertexShader from "~/assets/shaders/gradient.vert?raw"
import fragmentShader from "~/assets/shaders/gradient.frag?raw"

const points = 5
const subdivisions = 25

const config = {
  points: {
    x: points,
    y: points - 1,
  },
  subdivisions: {
    x: subdivisions,
    y: subdivisions,
  },
  amplitude: {
    x: {
      min: 0.15,
      max: 0.4,
    },
    y: {
      min: 0.15,
      max: 0.4,
    },
  },
  frequency: {
    x: {
      min: 0.1,
      max: 0.7,
    },
    y: {
      min: 0.1,
      max: 0.7,
    },
  },
} as const

const createGeometry = () => {
  const controlPointPositions: number[] = []

  const pointTValues: number[] = []
  const pointControlPointStartIndices: number[] = []
  const pointNeighborInvertT: number[] = []
  const pointNeighborControlPointStartIndexOffset: number[] = []
  const uvs: number[] = []

  const triangles: number[] = []

  const cpSpacing: Vector2 = {
    x: 2 / (config.points.x - 1),
    y: 2 / (config.points.y - 1),
  }
  const tScalar: Vector2 = {
    x: 1 / (config.subdivisions.x + 1), // +1 rather than +2 because the denominator should include the final point
    y: 1 / (config.subdivisions.y + 1),
  }
  const controlPointCount: Vector2 = {
    x: config.points.x + 2,
    y: config.points.y + 2,
  }
  const pointCount: Vector2 = {
    x: config.points.x + config.subdivisions.x * (config.points.x - 1),
    y: config.points.y + config.subdivisions.y * (config.points.y - 1),
  }

  const controlPointAmplitudes: number[] = []
  const controlPointFrequencies: number[] = []

  for (let y = -1; y <= config.points.y; y++) {
    const isFrameY = y === 0 || y === config.points.y - 1
    const isFrameStructureY = isFrameY || y === 0 || y === config.points.y

    for (let x = -1; x <= config.points.x; x++) {
      const isFrameX = x === 0 || x === config.points.x - 1
      const isFrameStructureX = isFrameX || x === 0 || x === config.points.x

      controlPointPositions.push(x * cpSpacing.x - 1, y * cpSpacing.y - 1)

      const fixX = isFrameX || isFrameY || isFrameStructureY
      const fixY = isFrameX || isFrameY || isFrameStructureX

      controlPointAmplitudes.push(
        fixX
          ? 0
          : lerp(Math.random(), config.amplitude.x.min, config.amplitude.x.max),
        fixY
          ? 0
          : lerp(Math.random(), config.amplitude.y.min, config.amplitude.y.max),
      )
      controlPointFrequencies.push(
        fixX
          ? 0
          : lerp(Math.random(), config.frequency.x.min, config.frequency.x.max),
        fixY
          ? 0
          : lerp(Math.random(), config.frequency.y.min, config.frequency.y.max),
      )
    }
  }

  for (let y = 0; y < pointCount.y; y++) {
    for (let x = 0; x < pointCount.x; x++) {
      const isTopEdge = y === pointCount.y - 1
      const isRightEdge = x === pointCount.x - 1
      const isBottomEdge = y === 0
      const isLeftEdge = x === 0

      const tX = isRightEdge ? 1 : (x % (1 + config.subdivisions.x)) * tScalar.x
      const tY = isTopEdge ? 1 : (y % (1 + config.subdivisions.y)) * tScalar.y

      pointTValues.push(tX, tY)

      pointNeighborInvertT.push(
        isRightEdge ? -1 : 1,
        isTopEdge ? -1 : 1,
        isLeftEdge ? -1 : 1,
        isBottomEdge ? -1 : 1,
      )
      pointNeighborControlPointStartIndexOffset.push(
        tX === 0 && !isLeftEdge ? -1 : 0,
        tY === 0 && !isBottomEdge ? -pointCount.x : 0,
      )

      const cpX = Math.floor(x * tScalar.x) - (isRightEdge ? 1 : 0)
      const cpY = Math.floor(y * tScalar.y) - (isTopEdge ? 1 : 0)

      pointControlPointStartIndices.push(cpY * controlPointCount.x + cpX)

      uvs.push(x / (pointCount.x - 1), y / (pointCount.y - 1))

      if (x >= 1 && y >= 1) {
        const tr = y * pointCount.x + x
        const tl = y * pointCount.x + x - 1
        const br = (y - 1) * pointCount.x + x
        const bl = (y - 1) * pointCount.x + x - 1
        triangles.push(bl, br, tr, bl, tr, tl)
      }
    }
  }

  return {
    controlPointCount,
    pointCount,

    tScalar,

    controlPointPositions: new Float32Array(controlPointPositions),
    pointTValues: new Float32Array(pointTValues),
    pointControlPointStartIndices: new Float32Array(
      pointControlPointStartIndices,
    ),
    pointNeighborInvertT: new Float32Array(pointNeighborInvertT),
    pointNeighborControlPointStartIndexOffset: new Float32Array(
      pointNeighborControlPointStartIndexOffset,
    ),
    controlPointAmplitudes: new Float32Array(controlPointAmplitudes),
    controlPointFrequencies: new Float32Array(controlPointFrequencies),
    uvs: new Float32Array(uvs),

    triangles: new Uint16Array(triangles),
  }
}

export const createExperience = (canvas: HTMLCanvasElement) => {
  const geometry = createGeometry()

  // geometry.controlPointPositions[24] = 0.8
  // geometry.controlPointPositions[25] = 0.5

  // for (let i = 0; i < geometry.controlPointPositions.length; i++) {
  //   geometry.controlPointPositions[i] *= 0.5
  // }

  console.log(geometry)

  const stage = createStage({
    canvas,
    observeResize: true,
    maxPixelRatio: 2,
    attributes: {
      a_cp_start: {
        data: geometry.pointControlPointStartIndices,
        size: 1,
        usage: "STATIC_DRAW",
      },
      a_t: {
        data: geometry.pointTValues,
        size: 2,
        usage: "STATIC_DRAW",
      },
      a_uv: {
        data: geometry.uvs,
        size: 2,
        usage: "STATIC_DRAW",
      },
      // a_neighbor_invert_t: {
      //   data: geometry.pointNeighborInvertT,
      //   size: 4,
      //   usage: "STATIC_DRAW",
      // },
      // a_neighbor_cp_start_offset: {
      //   data: geometry.pointNeighborControlPointStartIndexOffset,
      //   size: 2,
      //   usage: "STATIC_DRAW",
      // },
    },
    uniforms: {
      u_cp_positions: {
        data: geometry.controlPointPositions,
        type: "vec2",
      },
      u_cp_amplitudes: {
        data: geometry.controlPointAmplitudes,
        type: "vec2",
      },
      u_cp_frequencies: {
        data: geometry.controlPointFrequencies,
        type: "vec2",
      },
      u_time: {
        data: new Float32Array([0]),
        type: "float",
      },
      u_t_scalar: {
        data: new Float32Array([geometry.tScalar.x, geometry.tScalar.y]),
        type: "vec2",
      },
    },
    elements: {
      data: geometry.triangles,
      type: "UNSIGNED_SHORT",
      mode: "TRIANGLES",
    },
    vertexShader: vertexShader
      .replace("CP_GRID_X = 0", `CP_GRID_X = ${geometry.controlPointCount.x}`)
      .replace("CP_GRID_Y = 0", `CP_GRID_Y = ${geometry.controlPointCount.y}`)
      .replace("POINT_GRID_X = 0", `POINT_GRID_X = ${geometry.pointCount.x}`)
      .replace("POINT_GRID_Y = 0", `POINT_GRID_Y = ${geometry.pointCount.y}`),
    fragmentShader: fragmentShader,
  })

  if (stage instanceof Error) {
    throw new Error(`Failed to create stage: ${stage.cause ?? stage.message}`, {
      cause: stage.cause,
    })
  }

  stage.gl.enable(stage.gl.DEPTH_TEST)
  stage.gl.depthFunc(stage.gl.LESS)
  // stage.gl.enable(stage.gl.BLEND)
  // stage.gl.blendFunc(stage.gl.SRC_ALPHA, stage.gl.ONE_MINUS_SRC_ALPHA)

  stage.render()

  console.log(stage.canvas === canvas)

  console.log(stage.vertexShader)
  console.log(stage.fragmentShader)

  const render = (time: number) => {
    const data = stage.uniforms.u_time.data
    data[0] = (time + 1000) * 0.001
    stage.setUniform("u_time", data)
    stage.render()
  }

  return {
    render,
  }
}
