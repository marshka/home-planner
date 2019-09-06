#version 300 es

precision highp float;

in vec3 fs_position;
in vec3 fs_normal;
in vec2 fs_texcoord;

out vec4 color;

uniform vec3 ambientColor;
uniform float ambientIntensity;

uniform vec3 mainPosition;
uniform vec3 mainColor;
uniform vec3 mainDirection;
uniform float mainIntensity;

uniform vec4 mDiffuseColor;
uniform vec4 mEmissionColor;


void main() {

	vec3 normal = normalize(fs_normal);

	// Apply lighting effect
	vec3 diffuseLambert = mainColor * clamp(dot(mainDirection, normal),0.0,1.0) * mDiffuseColor.rgb * mainIntensity;
	color = clamp(vec4(diffuseLambert + ambientColor * ambientIntensity, mDiffuseColor.a), 0.0, 1.0);
}