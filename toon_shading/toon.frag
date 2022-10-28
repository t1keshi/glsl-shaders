#version 450 core

layout (location = 2) in vec3 transfomedNormal;
layout (location = 3) in vec3 eyePosition;


// total of lights
const int TOTAL_OF_LIGHTS = 1;


// source light info
uniform struct LightInfo {
	vec3 position;
	vec3 La;
	vec3 Ld;
	vec3 Ls;
	int source_type; // 0 - single point, 1 - directional, 2 - spot
	vec3 spot_direction;
	float spot_cutoff;
	float spot_exponent;
} lights[TOTAL_OF_LIGHTS];


// material info
uniform struct MaterialInfo {
	vec3 Ka;
	vec3 Kd;
	vec3 Ks;
	float shininess;
} material;


// toon shading info
uniform struct ToonShadingInfo {
	int levels;
	float scale_factor;
} toonShadingInfo;


uniform mat4 viewMatrix;


layout (location = 0) out vec4 fragmentColor;


// toon shading
vec3 toonShade(int index)
{
	vec3 ambient = lights[0].La * material.Ka;
	
	vec3 lightPosition = (viewMatrix * vec4(lights[index].position, 1.0)).xyz;

	vec3 n = normalize(transfomedNormal);
	vec3 s = normalize(lightPosition - eyePosition);
	float dotResult = max(dot(s, n), 0.0);

	vec3 diffuse = lights[index].Ld * material.Kd * floor(dotResult * toonShadingInfo.levels) * toonShadingInfo.scale_factor;

	return ambient + diffuse;
}


void main()
{
	vec3 light = vec3(0.0);

	for(int i = 0; i < TOTAL_OF_LIGHTS; i++)
	{
		light += toonShade(i);
	}

	fragmentColor = vec4(light, 1.0);
}
