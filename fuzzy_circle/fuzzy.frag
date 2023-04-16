#version 450 core

layout (location = 0) in vec2 texCoords;

// "binding" specify the default value for texture unit within the shader

layout (binding = 0) uniform BlobSettings {
	vec4 InnerColor; // the color inside of the circle
	vec4 OuterColor; // the color outside of the circle
	float RadiusInner; // radius that defines the part of the circle that is a solid color (inside the fuzzy edge)
	float RadiusOuter; // the outer edge of the fuzzy boundary of the circle
};

layout (location = 0) out vec4 fragmentColor;

void main()
{
	// calcula a distância entre a coordenada de textura (interporlada) e o centro (0.5 de [0,1])
	float dx = texCoords.x - 0.5;
	float dy = texCoords.y - 0.5;
	float dist = sqrt(dx * dx + dy * dy);

	// calcula um valor que varia "smoothly" entre 0.0 e 1.0 dependendo se
	// a distância calculada for menor que RadiusInner ou maior que RadiusOuter
	float smoothColor = smoothstep(RadiusInner, RadiusOuter, dist);

	// calcula a cor através da interpolação linear entre InnerColor e OuterColor baseada no valor de smoothColor
	fragmentColor = mix(InnerColor, OuterColor, smoothColor);
}
