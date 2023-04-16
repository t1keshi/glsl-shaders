# Fuzzy Circle

We'll draw a quad (two triangles) with texture coordinates, and use our fragment shader to fill the quad with a fuzzy circle.

The circle is a solid color in the center (InnerColor), but at its edge, it gradually fades to the background color (OuterColor).

Pre-requisites

- Uniform Buffer Objects
- Uniform blocks

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

Estrutura de dados (uniform block) com as configurações do efeito fuzzy:

```
	GLfloat OuterColor[] = { 0.0f, 0.0f, 0.0f, 0.0f };
	GLfloat InnerColor[] = { 1.0f, 1.0f, 0.75f, 1.0f };
	GLfloat RadiusInner = 0.25f;
	GLfloat RadiusOuter = 0.45f;
```

The OuterColor variable defines the color outside of the circle. InnerColor is the color inside of the circle. RadiusInner is the radius that defines the part of the circle that is a solid color (inside the fuzzy edge), and the distance from the center of the circle to the inner edge of the fuzzy boundary. RadiusOuter is the outer edge of the fuzzy boundary of the circle (when the color is equal to OuterColor).


## O algoritmo Fuzzy Circle

```
#version 450 core

layout (location = 0) in vec2 texCoords;
layout (location = 0) out vec4 fragmentColor;

layout (binding = 0) uniform BlobSettings {
	vec4 InnerColor; // the color inside of the circle
	vec4 OuterColor; // the color outside of the circle
	float RadiusInner; // radius that defines the part of the circle that is a solid color (inside the fuzzy edge)
	float RadiusOuter; // the outer edge of the fuzzy boundary of the circle
};


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
	//fragmentColor = mix(InnerColor, OuterColor, smoothColor);
	fragmentColor = vec4(smoothColor, smoothColor, smoothColor, 1.0);
}
```

The code within the main function computes the distance of the texture coordinate to the center of the quad located at (0.5, 0.5). It then uses that distance to compute the color by using the smoothstep function. This function provides a value that smoothly varies between 0.0 and 1.0 when the value of the third argument is between the values of the first two arguments. Otherwise, it returns 0.0 or 1.0, depending on whether dist is less than the first or greater than the second, respectively. The mix function is then used to linearly interpolate between InnerColor and OuterColor based on the value returned by the smoothstep function.



## Reference