#version 300 es

precision highp float;

in vec3 fs_position;
in vec3 fs_normal;

in vec2 fs_texcoord;
uniform sampler2D u_texture;

out vec4 color;

uniform vec3 ambientColor;
uniform float ambientIntensity;

uniform vec3 mainPosition;
uniform vec3 mainColor;
uniform vec3 mainDirection;
uniform float mainIntensity;

uniform vec3 lampPosition;
uniform vec3 lampColor;
uniform float lampIntensity;
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
	vec3 reflection = reflect(-lightDir, normalVec);
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
	vec4 texColor = texture(u_texture, fs_texcoord);

	// Compute main direct light
	vec3 l_mainDirection = normalize(mainDirection);
	vec3 mainLambert = lambert(l_mainDirection, mainColor, normal, texColor.rgb) * mainIntensity;
	vec4 mainPhong = phong(l_mainDirection, mainColor, normal, mSpecularColor, mSpecularShine);

	// Compute lamp point light
	vec3 l_lampDirection = (lampPosition - fs_position) / length(lampPosition - fs_position);
	vec3 l_lampColor = clamp(lampColor * pow(lampTarget / length(lampPosition - fs_position), lampDecay) , 0.0, 1.0);
	vec3 lampLambert = lambert(l_lampDirection, l_lampColor, normal, texColor.rgb) * lampIntensity;
	vec4 lampPhong = phong(l_lampDirection, l_lampColor, normal, mSpecularColor, mSpecularShine);

	// Compute ambient light
	vec4 ambient = ambient(texColor);

	//color = clamp(vec4(diffuseLambert + ambientColor * ambientIntensity, texColor.a), 0.0, 1.0);
	color = clamp(vec4(mainLambert + lampLambert, mDiffuseColor.a) + mainPhong + ambient + mEmissionColor, 0.0, 1.0);
}