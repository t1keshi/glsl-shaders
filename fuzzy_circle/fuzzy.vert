#version 450 core

layout (location = 0) in vec3 position;
layout (location = 2) in vec2 uv;

layout (location = 1) out vec2 out_texCoord;

void main()
{
	gl_Position = vec4(position, 1.0);
	out_texCoord = uv;
}
