#version 300 es

precision mediump float;

// Output for the Fragment Shader
out vec4 outColor;

void main() {
	// Set the output to a constant
	outColor = vec4(0.9, 0.9, 0.9, 0.3);
}