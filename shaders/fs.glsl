#version 300 es
#define MAX_LIGHTS 4

precision highp float;

in vec3 fs_position;
in vec3 fs_normal;

out vec4 color;

uniform vec3 ambientColor;
uniform float ambientIntensity;

uniform vec3 mainColor;
uniform float mainIntensity;
uniform vec3 mainDirection;

uniform vec3 chandelierColor;
uniform float chandelierIntensity;
uniform vec3 chandelierPosition;
uniform vec3 chandelierDirection;
uniform float chandelierDecay;
uniform float chandelierTarget;
uniform float chandelierConeIn;
uniform float chandelierConeOut;

uniform vec3 lampColor;
uniform float lampIntensity;
uniform vec3 lampPosition;
uniform float lampDecay;
uniform float lampTarget;

uniform vec4 mDiffuseColor;
uniform vec4 mSpecularColor;
uniform float mSpecularShine;
uniform vec4 mEmissionColor;

vec4 lambert(vec3 lightDir, vec3 normalVec, vec4 diffColor) {
	return clamp(dot(lightDir, normalVec), 0.0, 1.0) * diffColor;
}

vec4 ambient(vec4 color) {
	vec4 ambient = vec4(ambientColor, 1.0) * color * ambientIntensity;
	return ambient;
}

vec4 lightComponent(vec4 brdf, vec3 lightCol, float lightIntensity) {
	return clamp(brdf * vec4(lightCol, 1.0) * lightIntensity, 0.0, 1.0);
}


void main() {

	vec3 normal = normalize(fs_normal);

	vec4 lightSum = vec4(0.0);

	// Compute main direct light
	if (mainIntensity > 0.0) {
		vec3 l_mainDirection = normalize(mainDirection);
		vec4 mainLambert = lambert(l_mainDirection, normal, mDiffuseColor);
		lightSum = lightSum + lightComponent(mainLambert, mainColor, mainIntensity);
	}

	// Compute chandelier spot light
	if (chandelierIntensity > 0.0) {
		vec3 l_chandelierDir = normalize(chandelierDirection);
		float l_chandelierConeIn = cos(radians(chandelierConeIn) / 2.0);
		float l_chandelierConeOut = cos(radians(chandelierConeOut) / 2.0);
		float cosAlpha = dot(normalize(chandelierPosition - fs_position), l_chandelierDir);
		vec3 l_chandelierCol = chandelierColor * pow(chandelierTarget / length(chandelierPosition - fs_position), chandelierDecay) * clamp((cosAlpha - l_chandelierConeOut) / (l_chandelierConeIn - l_chandelierConeOut), 0.0, 1.0);
		vec4 chandelierLambert = lambert(l_chandelierDir, normal, mDiffuseColor);
		lightSum = lightSum + lightComponent(chandelierLambert, l_chandelierCol, chandelierIntensity);
	}

	// Compute lamp point light
	if (lampIntensity > 0.0) {
		vec3 l_lampDirection = normalize(lampPosition - fs_position);
		vec3 l_lampColor = lampColor * pow(lampTarget / length(lampPosition - fs_position), lampDecay);
		vec4 lampLambert = lambert(l_lampDirection, normal, mDiffuseColor);
		lightSum = lightSum + lightComponent(lampLambert, l_lampColor, lampIntensity);
	}

	// Compute ambient color
	vec4 ambient = ambient(mDiffuseColor);

	// Compute emit color
	vec4 emit = mEmissionColor.a * mEmissionColor;

	vec4 out_color = clamp(lightSum + ambient + emit, 0.0, 1.0);
	
	color = vec4(out_color.rgb, 1.0);

}