#version 300 es

in vec3 in_position;
in vec3 in_normal;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewModelMatrix;
uniform mat4 u_normalMatrix;

out vec3 fs_position;
out vec3 fs_normal;

void main() 
{
	// Multiply the position by the matrix.
	gl_Position = u_projectionMatrix * vec4(in_position, 1.0);

	// Pass the vectors to the fragment shader
	fs_normal = (u_normalMatrix * vec4(in_normal, 1.0)).xyz;
	fs_position = in_position;
}