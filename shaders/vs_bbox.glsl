#version 300 es

in vec3 in_position;

uniform mat4 u_projectionMatrix;

void main() 
{
	gl_Position = u_projectionMatrix * vec4(in_position, 1.0);
}