#version 300 es

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


vec3 lambert(vec3 lightDir, vec3 lightCol, vec3 normalVec, vec3 diffColor) {
  vec3 lambert = lightCol * clamp(dot(lightDir, normalVec),0.0,1.0) * diffColor;
  return lambert;
}

vec4 phong(vec3 lightDir, vec3 lightCol, vec3 normalVec, vec4 specularColor, float specularShine) {
	vec3 reflection = - reflect(lightDir, normalVec);
	vec3 eyeDirection = normalize(-fs_position);
	vec4 phong = vec4(lightCol, 1.0) * clamp(pow(clamp(dot(reflection, eyeDirection), 0.0, 1.0), specularShine), 0.0, 1.0) * specularColor;
	return phong;
}

vec4 ambient(vec4 color) {
	vec4 ambient = vec4(color.rgb * ambientColor, 1.0) * ambientIntensity;
	return ambient;
}


void main() {

	vec3 normal = normalize(fs_normal);

	// Compute main direct light
	vec3 l_mainDirection = normalize(mainDirection);
	vec3 mainLambert = lambert(l_mainDirection, mainColor, normal, mDiffuseColor.rgb) * mainIntensity;
	// disable directional phong
	// vec4 mainPhong = phong(l_mainDirection, mainColor, normal, mSpecularColor, mSpecularShine);

	// Compute chandelier spot light
	vec3 l_chandelierDir = normalize(chandelierDirection);
	float l_chandelierConeIn = cos(radians(chandelierConeIn) / 2.0);
	float l_chandelierConeOut = cos(radians(chandelierConeOut) / 2.0);
	float cosAlpha = dot(normalize(chandelierPosition - fs_position), l_chandelierDir);
	vec3 l_chandelierCol = clamp(chandelierColor * pow(chandelierTarget / length(chandelierPosition - fs_position), chandelierDecay) * clamp((cosAlpha - l_chandelierConeOut) / (l_chandelierConeIn - l_chandelierConeOut), 0.0, 1.0), 0.0, 1.0);
	vec3 chandelierLambert = lambert(l_chandelierDir, l_chandelierCol, normal, mDiffuseColor.rgb) * chandelierIntensity;
	vec4 chandelierPhong = phong(l_chandelierDir, l_chandelierCol, normal, mSpecularColor, mSpecularShine);

	// Compute lamp point light
	vec3 l_lampDirection = normalize(lampPosition - fs_position);
	vec3 l_lampColor = clamp(lampColor * pow(lampTarget / length(lampPosition - fs_position), lampDecay) , 0.0, 1.0);
	vec3 lampLambert = lambert(l_lampDirection, l_lampColor, normal, mDiffuseColor.rgb) * lampIntensity;
	vec4 lampPhong = phong(l_lampDirection, l_lampColor, normal, mSpecularColor, mSpecularShine);

	// Compute diffuse color
	vec4 diffuse = vec4(mainLambert + chandelierLambert + lampLambert, mDiffuseColor.a);

	// Compute specular color
	vec4 specular = chandelierPhong + lampPhong;

	// Compute ambient light
	vec4 ambient = ambient(mDiffuseColor);

	// Compute emit color
	vec4 emit = mEmissionColor.a * mEmissionColor;

	vec4 out_color = clamp(diffuse + specular + ambient + emit, 0.0, 1.0);
	
	color = vec4(out_color.rgb, 1.0);
}