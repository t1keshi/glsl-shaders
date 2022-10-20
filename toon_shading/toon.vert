#version 450 core

layout (location = 0) in vec3 position;
layout (location = 1) in vec4 baseColor;
layout (location = 2) in vec2 uv;
layout (location = 3) in vec3 normal;
layout (location = 4) in mat4 modelMatrix; // one modelview matrix per instance

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;


// out variables
layout (location = 2) out vec3 out_transfomedNormal; // interpolate the normal vector across the polygon
layout (location = 3) out vec3 out_eyePosition; // interpolate the position across the polygon

void main()
{	
	mat3 eyeMatrix = transpose(inverse(mat3(viewMatrix * modelMatrix)));
	vec3 transfomedNormal = normalize(eyeMatrix * normal);

	out_transfomedNormal = transfomedNormal;
	out_eyePosition = (viewMatrix * modelMatrix * vec4(position, 1.0)).xyz;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
