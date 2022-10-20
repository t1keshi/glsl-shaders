#version 450 core

layout (location = 0) in vec4 color;
layout (location = 1) in vec2 texCoords;
layout (location = 2) in vec3 normal;
layout (location = 3) in vec3 frontLightColor;
layout (Location = 4) flat in vec3 flatLightColor;


uniform bool isFlatShading = false;


layout (location = 0) out vec4 fragmentColor;


void main()
{
	if(isFlatShading)
		fragmentColor = vec4(flatLightColor, 1.0);
	else
		fragmentColor = vec4(frontLightColor, 1.0);
}
