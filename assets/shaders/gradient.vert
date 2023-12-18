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

void main() {
  int CP_START = int(a_cp_start);

  vec4 bern_pos_x = vec4(1.0, a_t.x, pow(a_t.x, 2.0), pow(a_t.x, 3.0)) * IDEN_MAT;
  vec4 bern_pos_y = vec4(1.0, a_t.y, pow(a_t.y, 2.0), pow(a_t.y, 3.0)) * IDEN_MAT;

  vec4 bern_vel_x = vec4(0.0, 1.0, 2.0 * a_t.x, 3.0 * pow(a_t.x, 2.0)) * IDEN_MAT;
  vec4 bern_vel_y = vec4(0.0, 1.0, 2.0 * a_t.y, 3.0 * pow(a_t.y, 2.0)) * IDEN_MAT;

  mat4 cp_initial_positions_x = mat4(
    u_cp_positions[CP_START].x, u_cp_positions[CP_START + CP_GRID_X].x, u_cp_positions[CP_START + CP_GRID_X * 2].x, u_cp_positions[CP_START + CP_GRID_X * 3].x,
    u_cp_positions[CP_START + 1].x, u_cp_positions[CP_START + 1 + CP_GRID_X].x, u_cp_positions[CP_START + 1 + CP_GRID_X * 2].x, u_cp_positions[CP_START + 1 + CP_GRID_X * 3].x,
    u_cp_positions[CP_START + 2].x, u_cp_positions[CP_START + 2 + CP_GRID_X].x, u_cp_positions[CP_START + 2 + CP_GRID_X * 2].x, u_cp_positions[CP_START + 2 + CP_GRID_X * 3].x,
    u_cp_positions[CP_START + 3].x, u_cp_positions[CP_START + 3 + CP_GRID_X].x, u_cp_positions[CP_START + 3 + CP_GRID_X * 2].x, u_cp_positions[CP_START + 3 + CP_GRID_X * 3].x
  );
  mat4 cp_initial_positions_y = mat4(
    u_cp_positions[CP_START].y, u_cp_positions[CP_START + 1].y, u_cp_positions[CP_START + 2].y, u_cp_positions[CP_START + 3].y,
    u_cp_positions[CP_START + CP_GRID_X].y, u_cp_positions[CP_START + 1 + CP_GRID_X].y, u_cp_positions[CP_START + 2 + CP_GRID_X].y, u_cp_positions[CP_START + 3 + CP_GRID_X].y,
    u_cp_positions[CP_START + CP_GRID_X * 2].y, u_cp_positions[CP_START + 1 + CP_GRID_X * 2].y, u_cp_positions[CP_START + 2 + CP_GRID_X * 2].y, u_cp_positions[CP_START + 3 + CP_GRID_X * 2].y,
    u_cp_positions[CP_START + CP_GRID_X * 3].y, u_cp_positions[CP_START + 1 + CP_GRID_X * 3].y, u_cp_positions[CP_START + 2 + CP_GRID_X * 3].y, u_cp_positions[CP_START + 3 + CP_GRID_X * 3].y
  );

  mat4 cp_amplitudes_x = mat4(
    u_cp_amplitudes[CP_START].x, u_cp_amplitudes[CP_START + CP_GRID_X].x, u_cp_amplitudes[CP_START + CP_GRID_X * 2].x, u_cp_amplitudes[CP_START + CP_GRID_X * 3].x,
    u_cp_amplitudes[CP_START + 1].x, u_cp_amplitudes[CP_START + 1 + CP_GRID_X].x, u_cp_amplitudes[CP_START + 1 + CP_GRID_X * 2].x, u_cp_amplitudes[CP_START + 1 + CP_GRID_X * 3].x,
    u_cp_amplitudes[CP_START + 2].x, u_cp_amplitudes[CP_START + 2 + CP_GRID_X].x, u_cp_amplitudes[CP_START + 2 + CP_GRID_X * 2].x, u_cp_amplitudes[CP_START + 2 + CP_GRID_X * 3].x,
    u_cp_amplitudes[CP_START + 3].x, u_cp_amplitudes[CP_START + 3 + CP_GRID_X].x, u_cp_amplitudes[CP_START + 3 + CP_GRID_X * 2].x, u_cp_amplitudes[CP_START + 3 + CP_GRID_X * 3].x
  );
  mat4 cp_amplitudes_y = mat4(
    u_cp_amplitudes[CP_START].y, u_cp_amplitudes[CP_START + 1].y, u_cp_amplitudes[CP_START + 2].y, u_cp_amplitudes[CP_START + 3].y,
    u_cp_amplitudes[CP_START + CP_GRID_X].y, u_cp_amplitudes[CP_START + 1 + CP_GRID_X].y, u_cp_amplitudes[CP_START + 2 + CP_GRID_X].y, u_cp_amplitudes[CP_START + 3 + CP_GRID_X].y,
    u_cp_amplitudes[CP_START + CP_GRID_X * 2].y, u_cp_amplitudes[CP_START + 1 + CP_GRID_X * 2].y, u_cp_amplitudes[CP_START + 2 + CP_GRID_X * 2].y, u_cp_amplitudes[CP_START + 3 + CP_GRID_X * 2].y,
    u_cp_amplitudes[CP_START + CP_GRID_X * 3].y, u_cp_amplitudes[CP_START + 1 + CP_GRID_X * 3].y, u_cp_amplitudes[CP_START + 2 + CP_GRID_X * 3].y, u_cp_amplitudes[CP_START + 3 + CP_GRID_X * 3].y
  );
  mat4 cp_frequencies_x = mat4(
    u_cp_frequencies[CP_START].x, u_cp_frequencies[CP_START + CP_GRID_X].x, u_cp_frequencies[CP_START + CP_GRID_X * 2].x, u_cp_frequencies[CP_START + CP_GRID_X * 3].x,
    u_cp_frequencies[CP_START + 1].x, u_cp_frequencies[CP_START + 1 + CP_GRID_X].x, u_cp_frequencies[CP_START + 1 + CP_GRID_X * 2].x, u_cp_frequencies[CP_START + 1 + CP_GRID_X * 3].x,
    u_cp_frequencies[CP_START + 2].x, u_cp_frequencies[CP_START + 2 + CP_GRID_X].x, u_cp_frequencies[CP_START + 2 + CP_GRID_X * 2].x, u_cp_frequencies[CP_START + 2 + CP_GRID_X * 3].x,
    u_cp_frequencies[CP_START + 3].x, u_cp_frequencies[CP_START + 3 + CP_GRID_X].x, u_cp_frequencies[CP_START + 3 + CP_GRID_X * 2].x, u_cp_frequencies[CP_START + 3 + CP_GRID_X * 3].x
  );
  mat4 cp_frequencies_y = mat4(
    u_cp_frequencies[CP_START].y, u_cp_frequencies[CP_START + 1].y, u_cp_frequencies[CP_START + 2].y, u_cp_frequencies[CP_START + 3].y,
    u_cp_frequencies[CP_START + CP_GRID_X].y, u_cp_frequencies[CP_START + 1 + CP_GRID_X].y, u_cp_frequencies[CP_START + 2 + CP_GRID_X].y, u_cp_frequencies[CP_START + 3 + CP_GRID_X].y,
    u_cp_frequencies[CP_START + CP_GRID_X * 2].y, u_cp_frequencies[CP_START + 1 + CP_GRID_X * 2].y, u_cp_frequencies[CP_START + 2 + CP_GRID_X * 2].y, u_cp_frequencies[CP_START + 3 + CP_GRID_X * 2].y,
    u_cp_frequencies[CP_START + CP_GRID_X * 3].y, u_cp_frequencies[CP_START + 1 + CP_GRID_X * 3].y, u_cp_frequencies[CP_START + 2 + CP_GRID_X * 3].y, u_cp_frequencies[CP_START + 3 + CP_GRID_X * 3].y
  );

  mat4 motion_inputs_x = cp_frequencies_x * u_time;
  mat4 motion_inputs_y = cp_frequencies_y * u_time;

  mat4 motion_x = matrixCompMult(mat4(sin(motion_inputs_x[0]), sin(motion_inputs_x[1]), sin(motion_inputs_x[2]), sin(motion_inputs_x[3])), cp_amplitudes_x);
  mat4 motion_y = matrixCompMult(mat4(sin(motion_inputs_y[0]), sin(motion_inputs_y[1]), sin(motion_inputs_y[2]), sin(motion_inputs_y[3])), cp_amplitudes_y);

  mat4 cp_positions_x = cp_initial_positions_x + motion_x;
  mat4 cp_positions_y = cp_initial_positions_y + motion_y;

  vec4 inter_pos_x = vec4(dot(bern_pos_y, cp_positions_x[0]), dot(bern_pos_y, cp_positions_x[1]), dot(bern_pos_y, cp_positions_x[2]), dot(bern_pos_y, cp_positions_x[3]));
  vec4 inter_pos_y = vec4(dot(bern_pos_x, cp_positions_y[0]), dot(bern_pos_x, cp_positions_y[1]), dot(bern_pos_x, cp_positions_y[2]), dot(bern_pos_x, cp_positions_y[3]));

  float z = (0.5 * (a_uv.x + a_uv.y) * (1.0 + a_uv.x + a_uv.y) + a_uv.y) * 0.25;

  vec3 pos = vec3(
    dot(bern_pos_x, inter_pos_x),
    dot(bern_pos_y, inter_pos_y),
    z
  );

  v_uv = a_uv;

  // vec4 initial_inter_p_x = vec4(dot(bern_pos_y, cp_initial_positions_x[0]), dot(bern_pos_y, cp_initial_positions_x[1]), dot(bern_pos_y, cp_initial_positions_x[2]), dot(bern_pos_y, cp_initial_positions_x[3]));
  // vec4 initial_inter_p_y = vec4(dot(bern_pos_x, cp_initial_positions_y[0]), dot(bern_pos_x, cp_initial_positions_y[1]), dot(bern_pos_x, cp_initial_positions_y[2]), dot(bern_pos_x, cp_initial_positions_y[3]));

  // vec2 initial_pos = vec2(
  //   dot(bern_pos_x, initial_inter_p_x),
  //   dot(bern_pos_y, initial_inter_p_y)
  // );

  // v_displacement = pos.xy - initial_pos;

  vec2 velocity = vec2(
    dot(bern_vel_x, inter_pos_x),
    dot(bern_vel_y, inter_pos_y)
  );

  v_velocity = velocity;

  vec2 acceleration = vec2(
    dot(vec4(0.0, 0.0, 2.0, 6.0 * a_t.x), IDEN_MAT * inter_pos_x),
    dot(vec4(0.0, 0.0, 2.0, 6.0 * a_t.y), IDEN_MAT * inter_pos_y)
  );

  // v_acceleration = acceleration;

  vec2 curvature = vec2(
    acceleration.x / pow(1.0 + pow(velocity.x, 2.0), 1.5),
    acceleration.y / pow(1.0 + pow(velocity.y, 2.0), 1.5)
  );

  v_curvature = curvature;

  gl_Position = vec4(pos, 1.0);
}
