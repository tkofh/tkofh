precision mediump float;

varying vec2 v_uv;
// varying vec2 v_displacement;
varying vec2 v_velocity;
// varying vec2 v_acceleration;
varying vec2 v_curvature;

const float PI = 3.1415926525;

void main() {
  float base = 0.1;

  vec2 uv = v_uv; // + v_displacement * 0.125;
  // float velocity = length(v_velocity);

  // float velocity_is_negative = min((1.0 - step(0.0, sign(v_velocity.y))) + (1.0 - step(0.0, sign(v_curvature.y))), 1.0);
  // float velocity_is_negative = min((1.0 - step(0.5, v_velocity.y)) + (1.0 - step(0.5, v_velocity.x)), 1.0);
  float velocity_is_negative = length(min(v_velocity, vec2(0.5))) < 0.5 ? 1.0 : 0.0;

  // float crease = pow((1.0 - smoothstep(0.0, 1.5, velocity)), 5.0) * 0.5;
  // vec3 uv_color = vec3(base + mix(0.0, 1.0 - base, uv.x), base, base + mix(0.0, 1.0 - base, uv.y));

  // vec3 color = mix(uv_color, vec3(1.0), crease);
  float visible = 0.8;
  float thickness = 0.05;

  vec2 grid = abs(sin(v_uv * PI * 30.0 - PI * 0.5));
  float lines = smoothstep(0.95, 1.0, pow(grid.x, 20.0)) + smoothstep(0.95, 1.0, pow(grid.y, 20.0));
  float boxes = step(0.75, pow(grid.x, 5.0)) * step(0.75, pow(grid.y, 5.0));
  float scanline = step(visible - (thickness * 0.5), uv.x) * step(uv.x, visible + (thickness * 0.5));
  float result = (lines + boxes); // * scanline;
  gl_FragColor = vec4(mix(vec3(result), vec3(result, 0.0, 0.0), velocity_is_negative), 1.0);
}
