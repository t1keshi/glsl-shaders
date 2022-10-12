#version 450 core

layout (location = 0) in vec2 texCoords;
layout (location = 1) in vec3 frontColor;
layout (location = 2) in vec3 backColor;

layout (location = 0) out vec4 fragmentColor;

void main()
{
	const float scale = 15.0;
	bvec2 toDiscard = greaterThan(fract(texCoords * scale), vec2(0.2, 0.2));

	if(all(toDiscard))
		discard;

	if(gl_FrontFacing)
		fragmentColor = vec4(frontColor, 1.0);
	else
		fragmentColor = vec4(backColor, 1.0);
}
