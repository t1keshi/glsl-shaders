# Circle

Drawing a filled circle with a quad (two triangles) with texture coordinate.


## The vertex data

A sua aplicação deve enviar os seguintes dados de vértice para o vertex shader:

Um quad formado por dois triângulos:

```
	float quad[] = {
		-1.0f, -1.0f, 0.0f,
		 1.0f, -1.0f, 0.0f,
		 1.0f,  1.0f, 0.0f,

		-1.0f, -1.0f, 0.0f,
		 1.0f,  1.0f, 0.0f,
		-1.0f,  1.0f, 0.0f
	};
```

Coordenadas de textura que preenche o quad inteiro:

```
	float texCoords[] = {
		0.0f, 0.0f,
		1.0f, 0.0f,
		1.0f, 1.0f,

		0.0f, 0.0f,
		1.0f, 1.0f,
		0.0f, 1.0f
	};
```

## O algoritmo

```
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
```

1. Calcule a distância entre a coordenada de textura (interporlada) e o centro (0.5 de [0,1])
2. Verifique se a distância do pixel está dentro do raio definido pelo RadiusInner


## Reference

- Wolff, D. OpenGL 4 Shading Language Cookbook. 3rd ed. Birmingham: Packt Publishing, 2018.
