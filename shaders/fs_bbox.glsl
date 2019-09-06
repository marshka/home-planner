#version 300 es

precision mediump float;

uniform vec4 mColor;

out vec4 outColor;


void main() 
{
		outColor = clamp(mColor, 0.0, 1.0);
}
