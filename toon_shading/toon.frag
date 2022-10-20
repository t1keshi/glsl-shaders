#version 450 core

layout (location = 2) in vec3 transfomedNormal;
layout (location = 3) in vec3 eyePosition;


// total of lights
const int TOTAL_OF_LIGHTS = 1;

uniform struct LightInfo {
	int type;
	vec3 position;
	vec3 La;
	vec3 Ld;
	vec3 Ls;
	vec3 spot_direction;
	float spot_cutoff;
	float spot_exponent;
} lights[TOTAL_OF_LIGHTS];


uniform struct MaterialInfo {
	vec3 Ka;
	vec3 Kd;
	vec3 Ks;
	float shininess;
} material;


uniform struct ToonShadingInfo {
	int levels;
	float scaleFactor;
} toonShadingInfo;


layout (location = 0) out vec4 fragmentColor;


vec3 toonShade()
{
	vec3 ambient = lights[0].La * material.Ka;

	vec3 n = normalize(transfomedNormal);
	vec3 s = normalize(lights[0].position.xyz - eyePosition);
	float dotResult = max(dot(s, n), 0.0);

	vec3 diffuse = lights[0].Ld * material.Kd * floor(dotResult * toonShadingInfo.levels) * toonShadingInfo.scaleFactor;

	return ambient + diffuse;
}

void main()
{
	vec3 light = vec3(0.0);

	for(int i = 0; i < TOTAL_OF_LIGHTS; i++)
	{
		light += toonShade();
	}

	fragmentColor = vec4(light, 1.0);
}
