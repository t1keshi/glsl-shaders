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

	// verifica se a distância do pixel está dentro do raio definido pelo RadiusInner
	if(dist <= RadiusInner)
		fragmentColor = vec4(1.0, 0.0, 0.0, 1.0);
	else
		discard;
}
