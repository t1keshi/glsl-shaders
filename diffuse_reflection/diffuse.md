#version 420 core

layout (location=0) in vec3 vPosition;
layout (location=1) in vec4 vColor;
layout (location=2) in vec2 vTexCoord;
layout (location=3) in vec3 vNormal;
layout (location=12) in mat4 vModelMatrix;

layout (location=0) out vec2 texCoord;
layout (location=1) out vec4 color;

uniform mat4 projection;
uniform mat4 view;

void main() {
	vec3 Kd = vec3(1.0, 1.0, 1.0);
	vec3 Ld = vec3(1.0, 1.0, 1.0);
	vec3 lightPosition = vec3(0.0, 5.0, 0.0);

	mat4 modelView = view * vModelMatrix;
	mat3 normalMatrix = transpose(inverse(mat3(modelView)));

	vec3 tnorm = normalize(normalMatrix * vNormal);
	vec4 eyeCoords = modelView * vec4(vPosition, 1.0);

	lightPosition = mat3(view) * lightPosition;

	vec3 s = normalize(lightPosition.xyz - eyeCoords.xyz);

	vec3 light = Ld * Kd * max(dot(s, tnorm), 0.0);

	gl_Position = projection * eyeCoords;
	texCoord = vTexCoord;
	color = vec4(light, 1.0) * vColor;
}
