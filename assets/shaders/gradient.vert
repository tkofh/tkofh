const int CP_GRID_X = 0;
const int CP_GRID_Y = 0;
const float POINT_GRID_X = 0.0;
const float POINT_GRID_Y = 0.0;
const int CP_COUNT = CP_GRID_X * CP_GRID_Y;
const mat4 IDEN_MAT = mat4(0.0, -0.5, 1.0, -0.5, 1.0, 0.0, -2.5, 1.5, 0.0, 0.5, 2.0, -1.5, 0.0, 0.0, -0.5, 0.5);

uniform float u_time;
uniform vec2 u_cp_positions[CP_COUNT];
uniform vec2 u_cp_amplitudes[CP_COUNT];
uniform vec2 u_cp_frequencies[CP_COUNT];
uniform vec2 u_t_scalar;

attribute float a_cp_start;
attribute vec2 a_t;
attribute vec2 a_uv;
// attribute vec4 a_neighbor_invert_t;
// attribute vec2 a_neighbor_cp_start_offset;
//
varying vec2 v_uv;
varying vec2 v_displacement;
varying vec2 v_velocity;
varying vec2 v_curvature;
varying float v_squish;
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
// float sq_dist(vec2 a, vec2 b) {
//   return pow(a.x - b.x, 2.0) + pow(a.y - b.y, 2.0);
// }

void main() {
  int CP_START = int(a_cp_start);


  v_uv = a_uv;

  vec2 self_position = position(CP_START, a_t);
  vec2 ss_uv = vec2(self_position.x * 0.5 + 0.5, self_position.y * 0.5 + 0.5);
  // vec2 z_basis =
  float z = (0.5 * (ss_uv.x + ss_uv.y) * (1.0 + ss_uv.x + ss_uv.y) + ss_uv.y) * 0.25 - distance(a_uv, ss_uv) * 0.3;
  // float z = distance(a_uv, ss_uv) * 0.3;

  // vec2 right_position = position(CP_START, a_t + vec2(u_t_scalar.x, 0.0));
  // vec2 top_position = position(CP_START, a_t + vec2(0.0, u_t_scalar.y));
  // vec2 left_position = position(CP_START, a_t - vec2(u_t_scalar.x, 0.0));
  // vec2 bottom_position = position(CP_START, a_t - vec2(0.0, u_t_scalar.y));

  // float delta_right = distance(self_position, right_position);
  // float delta_top = distance(self_position, top_position);
  // float delta_left = distance(self_position, left_position);
  // float delta_bottom = distance(self_position, bottom_position);

  // float squish_basis_x = min(delta_right, delta_left) * POINT_GRID_X;
  // float squish_basis_y = min(delta_top, delta_bottom) * POINT_GRID_Y;

  // float squish = 1.0 - clamp(min(squish_basis_x, squish_basis_y), 0.0, 1.0);


  // float delta_x = min(abs(right_position.x - self_position.x), abs(left_position.x - self_position.x)) * POINT_GRID_X;
  // float delta_y = min(abs(top_position.y - self_position.y), abs(bottom_position.y - self_position.y)) * POINT_GRID_Y;

  // vec2 squish_basis_x = mix(abs(right_position - self_position), abs(left_position - self_position), 0.5) * vec2(POINT_GRID_X, POINT_GRID_Y);
  // vec2 squish_basis_y = mix(abs(top_position - self_position), abs(bottom_position - self_position), 0.5) * vec2(POINT_GRID_X, POINT_GRID_Y);

  // float squish_det = squish_basis_x.x * squish_basis_y.y - squish_basis_x.y * squish_basis_y.x;

  // maybe the min of more deltas? could go top-right / bottom-left etc w sin/cos
  // float squish = 1.0 - clamp(squish_det, 0.0, 1.0);
  // float squish = 1.0 - clamp(delta_x * delta_y, 0.0, 1.0);
  // float squish = 1.0 - clamp(min(delta_right, delta_left) * INV_POINT_SPACE.x * min(delta_top, delta_bottom) * INV_POINT_SPACE.y, 0.0, 1.0);

  // vec4 initial_inter_p_x = vec4(dot(bern_pos_y, initial_positions_x[0]), dot(bern_pos_y, initial_positions_x[1]), dot(bern_pos_y, initial_positions_x[2]), dot(bern_pos_y, initial_positions_x[3]));
  // vec4 initial_inter_p_y = vec4(dot(bern_pos_x, initial_positions_y[0]), dot(bern_pos_x, initial_positions_y[1]), dot(bern_pos_x, initial_positions_y[2]), dot(bern_pos_x, initial_positions_y[3]));

  // vec2 initial_pos = vec2(
  //   dot(bern_pos_x, initial_inter_p_x),
  //   dot(bern_pos_y, initial_inter_p_y)
  // );

  // v_displacement = pos.xy - initial_pos;


  vec2 self_velocity = velocity(CP_START, a_t);
  vec2 self_acceleration = acceleration(CP_START, a_t);

  // v_squish = 1.0 - clamp(length(self_velocity), 0.0, 1.0);


  v_velocity = self_velocity;
  // v_squish = squish;
  // v_acceleration = acceleration;

  vec2 curvature = vec2(
    self_acceleration.x / pow(1.0 + pow(self_velocity.x, 2.0), 1.5),
    self_acceleration.y / pow(1.0 + pow(self_velocity.y, 2.0), 1.5)
  );

  v_curvature = curvature;

  gl_Position = vec4(self_position, z, 1.0);
}
