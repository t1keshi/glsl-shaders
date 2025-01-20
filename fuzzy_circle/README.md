# How to draw a Fuzzy Circle using fragment shader

The circle is a solid color in the center (**InnerColor**), but at its edge, it gradually fades to the background color (**OuterColor**).

## The vertex data

```
	float quad[] = {
		-1.0f, -1.0f, 0.0f,
		 1.0f, -1.0f, 0.0f,
		 1.0f,  1.0f, 0.0f,

		-1.0f, -1.0f, 0.0f,
		 1.0f,  1.0f, 0.0f,
		-1.0f,  1.0f, 0.0f
	};

	float texCoords[] = {
		0.0f, 0.0f,
		1.0f, 0.0f,
		1.0f, 1.0f,

		0.0f, 0.0f,
		1.0f, 1.0f,
		0.0f, 1.0f
	};
```

Setting up the uniform block in C++

```
	GLuint blockIndex = glGetUniformBlockIndex(m_shader.getProgramID(), "BlobSettings");

	GLint blockSize;
	glGetActiveUniformBlockiv(m_shader.getProgramID(), blockIndex, GL_UNIFORM_BLOCK_DATA_SIZE, &blockSize);
	
	GLubyte* blockBuffer = new GLubyte[blockSize];	
	const GLchar* names[] = { "InnerColor", "OuterColor", "RadiusInner", "RadiusOuter" };
	GLuint indices[4];

	glGetUniformIndices(m_shader.getProgramID(), 4, names, indices);
	
	GLint offset[4];
	glGetActiveUniformsiv(m_shader.getProgramID(), 4, indices, GL_UNIFORM_OFFSET, offset);

	// VALUES FOR OUR UNIFORM BLOCK
	GLfloat OuterColor[] = { 0.0f, 0.0f, 0.0f, 0.0f };
	GLfloat InnerColor[] = { 1.0f, 1.0f, 0.75f, 1.0f };
	GLfloat RadiusInner = 0.25f;
	GLfloat RadiusOuter = 0.45f;

	memcpy(blockBuffer + offset[0], innerColor, 4 * sizeof(GLfloat));
	memcpy(blockBuffer + offset[1], outerColor, 4 * sizeof(GLfloat));
	memcpy(blockBuffer + offset[2], &innerRadius, sizeof(GLfloat));
	memcpy(blockBuffer + offset[3], &outerRadius, sizeof(GLfloat));

	GLuint uboHandle;
	glGenBuffers(1, &uboHandle);
	glBindBuffer(GL_UNIFORM_BUFFER, uboHandle);
	glBufferData(GL_UNIFORM_BUFFER, blockSize, blockBuffer, GL_DYNAMIC_DRAW);

	glBindBufferBase(GL_UNIFORM_BUFFER, 0, uboHandle);
```

The OuterColor variable defines the color outside of the circle. InnerColor is the color inside of the circle. RadiusInner is the radius that defines the part of the circle that is a solid color (inside the fuzzy edge), and the distance from the center of the circle to the inner edge of the fuzzy boundary. RadiusOuter is the outer edge of the fuzzy boundary of the circle (when the color is equal to OuterColor).

## The fragment shader

```
	#version 420 core
	
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
		// calcula a distância entre a coordenada de textura (interporlada) e o centro
		float dx = texCoords.x - 0.5;
		float dy = texCoords.y - 0.5;
		float dist = sqrt(dx * dx + dy * dy);
	
		// calcula um valor que varia "smoothly" entre 0.0 e 1.0 se a distância calculada estiver entre os valores de RadiusInner e RadiusOuter
		// Caso contrário, retornará 0.0 ou 1.0 se a distância for menor que RadiusInner ou se for maior que RadiusOuter, respectivamente
		float smoothColor = smoothstep(RadiusInner, RadiusOuter, dist);
	
		// calcula a cor através da interpolação linear entre InnerColor e OuterColor baseada no valor de smoothColor
		fragmentColor = mix(InnerColor, OuterColor, smoothColor);
	}
```

## Reference
- Wolff, D. OpenGL 4 Shading Language Cookbook. 3rd ed. Birmingham: Packt Publishing, 2018.
