#version 300 es

precision highp float;

in vec3 fs_position;
in vec3 fs_normal;
in vec2 fs_texcoord;

uniform float ambientIntensity;

uniform sampler2D u_texture;

out vec4 color;

void main() {
	// because v_normal is a varying it's interpolated
	// so it will not be a unit vector. Normalizing it
	// will make it a unit vector again
	vec3 normal = normalize(fs_normal);

	// Apply lighting effect
	highp vec3 ambientLight = vec3(0.3) * ambientIntensity;
	highp vec3 directionalLightColor = vec3(0.8, 0.8, 0.8);
	highp vec3 directionalVector = normalize(vec3(1.0,1.0,1.0));

	// Lets multiply just the color portion (not the alpha)
	// by the light
	highp float directional = max(dot(normal, directionalVector), 0.0);
	color = vec4(ambientLight + (directionalLightColor * directional), 1.0);
	color = texture2D(u_texture, fs_texcoord);
}