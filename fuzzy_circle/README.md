# How to draw a fuzzy circle using fragment shader

The circle is a solid color in the center (```InnerColor```), but at its edge, it gradually fades to the background color (```OuterColor```).

# The vertex data

- Quad (two triangles)
- Texture coordinates (0 to 1 in each direction)

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

# Vertex Shader

```
	#version 460
	
	layout (location=0) in vec3 vertexPosition;
	layout (location=1) in vec2 textureCoordinate;
	
	layout (location=0) out vec2 outTextCoord;
	
	void main(void) {
		gl_Position = vec4(vertexPosition, 1.0);
		outTextCoord = textureCoordinate;
	}
```

# Fragment Shader

```
	#version 460
	
	layout (location=0) in vec2 texCoord;
	layout (location=0) out vec4 fragColor;
	
	layout (binding=0) uniform BlogSettings {
		vec4 InnerColor; // the color inside of the circle
		vec4 OuterColor; // the color outside of the circle
		vec4 RadiusInner; // radius that defines the part of the circle that is a solid color (inside the fuzzy edge)
		vec4 RadiusOuter; // the outer edge of the fuzzy boundary of the circle
	};
	
	void main(void) {
		// the distance of the texture coordinate (interpoled) to the center of the quad located at (0.5, 0.5)
		float dx = texCoord.x - 0.5;
		float dy = texCoord.y - 0.5;
		float dist = sqrt(dx * dx + dy * dy);

		// calcula um valor que varia "smoothly" entre 0.0 e 1.0 se a distância calculada estiver entre os valores de RadiusInner e RadiusOuter
		// Caso contrário, retornará 0.0 ou 1.0 se a distância for menor que RadiusInner ou se for maior que RadiusOuter, respectivamente
		float s = smoothstep(RadiusInner, RadiusOuter, dist);
		// calcula a cor através da interpolação linear entre InnerColor e OuterColor baseada no valor de smoothColor
		fragColor = mix(InnerColor, OuterColor, s);
	}
```

The OuterColor variable defines the color outside of the circle. InnerColor is the color inside of the circle. RadiusInner is the radius that defines the part of the circle that is a solid color (inside the fuzzy edge), and the distance from the center of the circle to the inner edge of the fuzzy boundary. RadiusOuter is the outer edge of the fuzzy boundary of the circle (when the color is equal to OuterColor).

# Setting up the uniform block in C++

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

# Reference
- Wolff, D. OpenGL 4 Shading Language Cookbook. 3rd ed. Birmingham: Packt Publishing, 2018.
