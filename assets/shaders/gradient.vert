const int CP_GRID_X = 0;
const int CP_GRID_Y = 0;
const int CP_COUNT = CP_GRID_X * CP_GRID_Y;
const mat4 IDEN_MAT = mat4(0.0, -0.5, 1.0, -0.5, 1.0, 0.0, -2.5, 1.5, 0.0, 0.5, 2.0, -1.5, 0.0, 0.0, -0.5, 0.5);

uniform float u_time;
uniform vec2 u_cp_positions[CP_COUNT];
uniform vec2 u_cp_amplitudes[CP_COUNT];
uniform vec2 u_cp_frequencies[CP_COUNT];

attribute float a_cp_start;
attribute vec2 a_t;
attribute vec2 a_uv;

varying vec2 v_uv;
varying vec2 v_displacement;
varying vec2 v_velocity;
varying vec2 v_curvature;
// varying vec2 v_acceleration;

mat4 cp_positions_x(const int start) {
  return mat4(
    u_cp_positions[start].x, u_cp_positions[start + CP_GRID_X].x, u_cp_positions[start + CP_GRID_X * 2].x, u_cp_positions[start + CP_GRID_X * 3].x,
    u_cp_positions[start + 1].x, u_cp_positions[start + 1 + CP_GRID_X].x, u_cp_positions[start + 1 + CP_GRID_X * 2].x, u_cp_positions[start + 1 + CP_GRID_X * 3].x,
    u_cp_positions[start + 2].x, u_cp_positions[start + 2 + CP_GRID_X].x, u_cp_positions[start + 2 + CP_GRID_X * 2].x, u_cp_positions[start + 2 + CP_GRID_X * 3].x,
    u_cp_positions[start + 3].x, u_cp_positions[start + 3 + CP_GRID_X].x, u_cp_positions[start + 3 + CP_GRID_X * 2].x, u_cp_positions[start + 3 + CP_GRID_X * 3].x
  );
}
mat4 cp_positions_y(const int start) {
  return mat4(
    u_cp_positions[start].y, u_cp_positions[start + 1].y, u_cp_positions[start + 2].y, u_cp_positions[start + 3].y,
    u_cp_positions[start + CP_GRID_X].y, u_cp_positions[start + 1 + CP_GRID_X].y, u_cp_positions[start + 2 + CP_GRID_X].y, u_cp_positions[start + 3 + CP_GRID_X].y,
    u_cp_positions[start + CP_GRID_X * 2].y, u_cp_positions[start + 1 + CP_GRID_X * 2].y, u_cp_positions[start + 2 + CP_GRID_X * 2].y, u_cp_positions[start + 3 + CP_GRID_X * 2].y,
    u_cp_positions[start + CP_GRID_X * 3].y, u_cp_positions[start + 1 + CP_GRID_X * 3].y, u_cp_positions[start + 2 + CP_GRID_X * 3].y, u_cp_positions[start + 3 + CP_GRID_X * 3].y
  );
}
mat4 cp_amplitudes_x(const int start) {
  return mat4(
    u_cp_amplitudes[start].x, u_cp_amplitudes[start + CP_GRID_X].x, u_cp_amplitudes[start + CP_GRID_X * 2].x, u_cp_amplitudes[start + CP_GRID_X * 3].x,
    u_cp_amplitudes[start + 1].x, u_cp_amplitudes[start + 1 + CP_GRID_X].x, u_cp_amplitudes[start + 1 + CP_GRID_X * 2].x, u_cp_amplitudes[start + 1 + CP_GRID_X * 3].x,
    u_cp_amplitudes[start + 2].x, u_cp_amplitudes[start + 2 + CP_GRID_X].x, u_cp_amplitudes[start + 2 + CP_GRID_X * 2].x, u_cp_amplitudes[start + 2 + CP_GRID_X * 3].x,
    u_cp_amplitudes[start + 3].x, u_cp_amplitudes[start + 3 + CP_GRID_X].x, u_cp_amplitudes[start + 3 + CP_GRID_X * 2].x, u_cp_amplitudes[start + 3 + CP_GRID_X * 3].x
  );
}
mat4 cp_amplitudes_y(const int start) {
  return mat4(
    u_cp_amplitudes[start].y, u_cp_amplitudes[start + 1].y, u_cp_amplitudes[start + 2].y, u_cp_amplitudes[start + 3].y,
    u_cp_amplitudes[start + CP_GRID_X].y, u_cp_amplitudes[start + 1 + CP_GRID_X].y, u_cp_amplitudes[start + 2 + CP_GRID_X].y, u_cp_amplitudes[start + 3 + CP_GRID_X].y,
    u_cp_amplitudes[start + CP_GRID_X * 2].y, u_cp_amplitudes[start + 1 + CP_GRID_X * 2].y, u_cp_amplitudes[start + 2 + CP_GRID_X * 2].y, u_cp_amplitudes[start + 3 + CP_GRID_X * 2].y,
    u_cp_amplitudes[start + CP_GRID_X * 3].y, u_cp_amplitudes[start + 1 + CP_GRID_X * 3].y, u_cp_amplitudes[start + 2 + CP_GRID_X * 3].y, u_cp_amplitudes[start + 3 + CP_GRID_X * 3].y
  );
}
mat4 cp_frequencies_x(const int start) {
  return mat4(
    u_cp_frequencies[start].x, u_cp_frequencies[start + CP_GRID_X].x, u_cp_frequencies[start + CP_GRID_X * 2].x, u_cp_frequencies[start + CP_GRID_X * 3].x,
    u_cp_frequencies[start + 1].x, u_cp_frequencies[start + 1 + CP_GRID_X].x, u_cp_frequencies[start + 1 + CP_GRID_X * 2].x, u_cp_frequencies[start + 1 + CP_GRID_X * 3].x,
    u_cp_frequencies[start + 2].x, u_cp_frequencies[start + 2 + CP_GRID_X].x, u_cp_frequencies[start + 2 + CP_GRID_X * 2].x, u_cp_frequencies[start + 2 + CP_GRID_X * 3].x,
    u_cp_frequencies[start + 3].x, u_cp_frequencies[start + 3 + CP_GRID_X].x, u_cp_frequencies[start + 3 + CP_GRID_X * 2].x, u_cp_frequencies[start + 3 + CP_GRID_X * 3].x
  );
}
mat4 cp_frequencies_y(const int start) {
  return mat4(
    u_cp_frequencies[start].y, u_cp_frequencies[start + 1].y, u_cp_frequencies[start + 2].y, u_cp_frequencies[start + 3].y,
    u_cp_frequencies[start + CP_GRID_X].y, u_cp_frequencies[start + 1 + CP_GRID_X].y, u_cp_frequencies[start + 2 + CP_GRID_X].y, u_cp_frequencies[start + 3 + CP_GRID_X].y,
    u_cp_frequencies[start + CP_GRID_X * 2].y, u_cp_frequencies[start + 1 + CP_GRID_X * 2].y, u_cp_frequencies[start + 2 + CP_GRID_X * 2].y, u_cp_frequencies[start + 3 + CP_GRID_X * 2].y,
    u_cp_frequencies[start + CP_GRID_X * 3].y, u_cp_frequencies[start + 1 + CP_GRID_X * 3].y, u_cp_frequencies[start + 2 + CP_GRID_X * 3].y, u_cp_frequencies[start + 3 + CP_GRID_X * 3].y
  );
}
vec4 bern_pos_x(vec2 t) {
  return vec4(1.0, t.x, pow(t.x, 2.0), pow(t.x, 3.0)) * IDEN_MAT;
}
vec4 bern_pos_y(vec2 t) {
  return vec4(1.0, t.y, pow(t.y, 2.0), pow(t.y, 3.0)) * IDEN_MAT;
}
vec4 bern_vel_x(vec2 t) {
  return vec4(0.0, 1.0, 2.0 * t.x, 3.0 * pow(t.x, 2.0)) * IDEN_MAT;
}
vec4 bern_vel_y(vec2 t) {
  return vec4(0.0, 1.0, 2.0 * t.y, 3.0 * pow(t.y, 2.0)) * IDEN_MAT;
}
vec4 bern_acc_x(vec2 t) {
  return vec4(0.0, 0.0, 2.0, 6.0 * t.x) * IDEN_MAT;
}
vec4 bern_acc_y(vec2 t) {
  return vec4(0.0, 0.0, 2.0, 6.0 * t.y) * IDEN_MAT;
}
vec4 axis_positions_x(const int start, vec2 t) {
  mat4 amplitudes = cp_amplitudes_x(start);
  mat4 frequencies = cp_frequencies_x(start);

  mat4 motion_inputs = frequencies * u_time;
  mat4 motion = matrixCompMult(mat4(sin(motion_inputs[0]), sin(motion_inputs[1]), sin(motion_inputs[2]), sin(motion_inputs[3])), amplitudes);

  mat4 positions = cp_positions_x(start) + motion;
  vec4 bern = bern_pos_y(t);

  return vec4(dot(bern, positions[0]), dot(bern, positions[1]), dot(bern, positions[2]), dot(bern, positions[3]));
}
vec4 axis_positions_y(const int start, vec2 t) {
  mat4 amplitudes = cp_amplitudes_y(start);
  mat4 frequencies = cp_frequencies_y(start);

  mat4 motion_inputs = frequencies * u_time;
  mat4 motion = matrixCompMult(mat4(sin(motion_inputs[0]), sin(motion_inputs[1]), sin(motion_inputs[2]), sin(motion_inputs[3])), amplitudes);

  mat4 positions = cp_positions_y(start) + motion;
  vec4 bern = bern_pos_x(t);

  return vec4(dot(bern, positions[0]), dot(bern, positions[1]), dot(bern, positions[2]), dot(bern, positions[3]));
}

vec2 position(const int start, vec2 t) {
  return vec2(
    dot(bern_pos_x(t), axis_positions_x(start, t)),
    dot(bern_pos_y(t), axis_positions_y(start, t))
  );
}
vec2 velocity(const int start, vec2 t) {
  return vec2(
    dot(bern_vel_x(t), axis_positions_x(start, t)),
    dot(bern_vel_y(t), axis_positions_y(start, t))
  );
}
vec2 acceleration(const int start, vec2 t) {
  return vec2(
    dot(bern_acc_x(t), axis_positions_x(start, t)),
    dot(bern_acc_y(t), axis_positions_y(start, t))
  );
}

void main() {
  int CP_START = int(a_cp_start);

  float z = (0.5 * (a_uv.x + a_uv.y) * (1.0 + a_uv.x + a_uv.y) + a_uv.y) * 0.25;

  v_uv = a_uv;

  // vec4 initial_inter_p_x = vec4(dot(bern_pos_y, initial_positions_x[0]), dot(bern_pos_y, initial_positions_x[1]), dot(bern_pos_y, initial_positions_x[2]), dot(bern_pos_y, initial_positions_x[3]));
  // vec4 initial_inter_p_y = vec4(dot(bern_pos_x, initial_positions_y[0]), dot(bern_pos_x, initial_positions_y[1]), dot(bern_pos_x, initial_positions_y[2]), dot(bern_pos_x, initial_positions_y[3]));

  // vec2 initial_pos = vec2(
  //   dot(bern_pos_x, initial_inter_p_x),
  //   dot(bern_pos_y, initial_inter_p_y)
  // );

  // v_displacement = pos.xy - initial_pos;


  vec2 self_velocity = velocity(CP_START, a_t);
  vec2 self_acceleration = acceleration(CP_START, a_t);

  v_velocity = self_velocity;
  // v_acceleration = acceleration;

  vec2 curvature = vec2(
    self_acceleration.x / pow(1.0 + pow(self_velocity.x, 2.0), 1.5),
    self_acceleration.y / pow(1.0 + pow(self_velocity.y, 2.0), 1.5)
  );

  v_curvature = curvature;

  gl_Position = vec4(position(CP_START, a_t), z, 1.0);
}
