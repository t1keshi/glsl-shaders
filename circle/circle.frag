#version 450 core

layout (location = 0) in vec2 texCoords;

uniform float radius = 0.5;

layout (location = 0) out vec4 fragmentColor;

void main()
{
	// calcula a distância entre a coordenada de textura (interporlada) e o centro (0.5 de [0,1])
	float dx = texCoords.x - 0.5;
	float dy = texCoords.y - 0.5;
	float dist = sqrt(dx * dx + dy * dy);

	// calcula um valor que varia "smoothly" entre 0.0 e 1.0 dependendo se
	// a distância calculada for menor que RadiusInner ou maior que RadiusOuter
	//float smoothColor = smoothstep(RadiusInner, RadiusOuter, dist);

	// calcula a cor através da interpolação linear entre InnerColor e OuterColor baseada no valor de smoothColor
	//fragmentColor = mix(InnerColor, OuterColor, smoothColor);
	//fragmentColor = vec4(smoothColor, smoothColor, smoothColor, 1.0);

	// draw circle with inner colored
	if(dist <= RadiusInner)
		fragmentColor = vec4(1.0, 1.0, 0.0, 1.0);
	else
		discard;
}
