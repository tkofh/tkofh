precision mediump float;

varying vec2 v_uv;
// varying vec2 v_displacement;
varying vec2 v_velocity;
// varying vec2 v_acceleration;
varying vec2 v_curvature;
varying float v_squish;

const float PI = 3.1415926525;

void main() {

  vec2 uv = v_uv; // + v_displacement * 0.125;
  // float velocity = length(v_velocity);
  float squish =  1.0 - clamp(length(v_velocity), 0.0, 1.0);

  // float velocity_is_negative = length(min(v_velocity, vec2(0.5))) < 0.5 ? 1.0 : 0.0;

  // vec3 color = mix(uv_color, vec3(1.0), crease);
  // float visible = 0.8;
  // float thickness = 0.05;

  vec3 color = vec3(v_uv.x, 0.0, v_uv.y);
  gl_FragColor = vec4(mix(color, 0.2 + clamp(color * 3., 0.0, 0.8), pow(squish, 3.0)), 1.0);
}
