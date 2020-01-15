#version 300 es
#define MAX_LIGHTS 4

precision highp float;

in vec3 fs_position;
in vec3 fs_normal;

in vec2 fs_texcoord;
uniform sampler2D u_texture;

out vec4 color;

struct AmientLight {
	vec3 Color;
	float Intensity;
};
uniform AmientLight ambientLight;

struct DirectionalLight {
	vec3 Color;
	float Intensity;
	vec3 Direction;
};
uniform DirectionalLight mainLight;

struct SpotLight {
	vec3 Color;
	float Intensity;
	vec3 Position;
	vec3 Direction;
	float Decay;
	float Target;
	float ConeIn;
	float ConeOut;
};
uniform SpotLight chandelier;

struct PointLight {
	vec3 Color;
	float Intensity;
	vec3 Position;
	float Decay;
	float Target;
};
uniform PointLight lamps[MAX_LIGHTS];

uniform vec4 mDiffuseColor;
uniform vec4 mSpecularColor;
uniform float mSpecularShine;
uniform vec4 mEmissionColor;

vec4 lambert(vec3 lightDir, vec3 normalVec, vec4 diffColor) {
	return clamp(dot(lightDir, normalVec), 0.0, 1.0) * diffColor;
}

vec4 phong(vec3 lightDir, vec3 normalVec, vec4 specularColor, float specularShine) {
	vec3 reflection = -reflect(lightDir, normalVec);
	vec3 eyeDirection = normalize(-fs_position);
	return pow(max(dot(reflection, eyeDirection), 0.0), specularShine) * specularColor;
}

vec4 ambient(vec4 color) {
	return vec4(ambientLight.Color, 1.0) * color * ambientLight.Intensity;
}

vec4 lightComponent(vec4 brdf, vec3 lightCol, float lightIntensity) {
	return clamp(brdf * vec4(lightCol, 1.0) * lightIntensity, 0.0, 1.0);
}


void main() {

	vec3 normal = normalize(fs_normal);
	vec4 texColor = texture(u_texture, fs_texcoord);

	vec4 lightSum = vec4(0.0);

	// Compute main direct light
	if (mainLight.Intensity > 0.0) {
		vec3 l_mainDirection = normalize(mainLight.Direction);
		vec4 mainLambert = lambert(l_mainDirection, normal, texColor);
		lightSum = lightSum + lightComponent(mainLambert, mainLight.Color, mainLight.Intensity);
	}

	// Compute chandelier spot light
	if (chandelier.Intensity > 0.0) {
		vec3 l_chandelierDir = normalize(chandelier.Position - fs_position);
		float l_chandelierConeIn = cos(radians(chandelier.ConeIn * chandelier.ConeOut) / 2.0);
		float l_chandelierConeOut = cos(radians(chandelier.ConeOut) / 2.0);
		float cosAlpha = dot(chandelier.Direction, l_chandelierDir);

		vec3 l_bulbCol = chandelier.Color * pow(chandelier.Target / length(chandelier.Position - fs_position), chandelier.Decay);
		vec4 bulbLambert = lambert(l_chandelierDir, normal, texColor);
		lightSum = lightSum + lightComponent(bulbLambert, l_bulbCol, chandelier.Intensity);

		vec3 l_chandelierCol = l_bulbCol * clamp((cosAlpha - l_chandelierConeOut) / (l_chandelierConeIn - l_chandelierConeOut), 0.0, 1.0);
		vec4 chandelierLambert = lambert(l_chandelierDir, normal, texColor);
		vec4 chandelierPhong = phong(l_chandelierDir, normal, mSpecularColor, mSpecularShine);
		lightSum = lightSum + lightComponent(chandelierLambert + chandelierPhong, l_chandelierCol, chandelier.Intensity);
	}

	// Compute lamp point light
	for(int i = 0; i < MAX_LIGHTS; i++) {
		PointLight lamp = lamps[i];
		if (lamp.Intensity > 0.0) {
			vec3 l_lampDirection = normalize(lamp.Position - fs_position);
			vec3 l_lampColor = lamp.Color * pow(lamp.Target / length(lamp.Position - fs_position), lamp.Decay);
			vec4 lampLambert = lambert(l_lampDirection, normal, texColor);
			vec4 lampPhong = phong(l_lampDirection, normal, mSpecularColor, mSpecularShine);
			lightSum = lightSum + lightComponent(lampLambert + lampPhong, l_lampColor, lamp.Intensity);
		}
    }

	// Compute ambient color
	vec4 ambientSum = ambient(texColor);

	// Compute emit color
	vec4 emit = mEmissionColor.a * mEmissionColor;

	vec4 out_color = clamp(lightSum + ambientSum + emit, 0.0, 1.0);
	
	color = vec4(out_color.rgb, 1.0);

}