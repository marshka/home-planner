#version 300 es

in vec3 in_position;
in vec3 in_normal;
in vec2 in_texcoord;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewModelMatrix;
uniform mat4 u_normalMatrix;

out vec3 fs_position;
out vec3 fs_normal;
out vec2 fs_texcoord;

void main() 
{
	// Multiply the position by the matrix.
	gl_Position = u_projectionMatrix * vec4(in_position, 1.0);

	// Pass the vectors to the fragment shader
	fs_normal = (u_normalMatrix * vec4(in_normal, 1.0)).xyz;
	fs_position = in_position;
	fs_texcoord = in_texcoord;
}