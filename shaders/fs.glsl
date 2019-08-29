#version 300 es

precision highp float;

in vec3 fs_position;
in vec3 fs_normal;

out vec4 color;

void main() {
	// because v_normal is a varying it's interpolated
	// so it will not be a unit vector. Normalizing it
	// will make it a unit vector again
	vec3 normal = normalize(fs_normal);

	// Apply lighting effect
	highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
	highp vec3 directionalLightColor = vec3(1, 1, 1);
	highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

	// Lets multiply just the color portion (not the alpha)
	// by the light
	highp float directional = max(dot(normal, directionalVector), 0.0);
	color = vec4(ambientLight + (directionalLightColor * directional), 1.0);
}