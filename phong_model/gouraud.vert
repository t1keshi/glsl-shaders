#version 450 core

layout (location = 0) in vec3 position;
layout (location = 1) in vec4 baseColor;
layout (location = 2) in vec2 uv;
layout (location = 3) in vec3 normal;
layout (location = 4) in mat4 modelviewMatrix; // one modelview matrix per instance

// total of lights
const int TOTAL_OF_LIGHTS = 10;

uniform struct LightInfo {
	vec3 position;
	vec3 La;
	vec3 Ld;
	vec3 Ls;
	int type;
} lights[TOTAL_OF_LIGHTS];


uniform struct MaterialInfo {
	vec3 Ka;
	vec3 Kd;
	vec3 Ks;
	float shininess;
} material;


uniform struct LightingModelInfo {
	int _nonLocalViewer;
	int _isTwoSided;
	int _isBlinnPhong;
} lightingModel;


uniform mat4 projectionMatrix;
uniform bool isFlatShading = false;


layout (location = 0) out vec4 out_baseColor;
layout (location = 1) out vec2 out_texCoord;
layout (location = 2) out vec3 out_Normal;
layout (location = 3) out vec3 out_lightColor;
layout (Location = 4) flat out vec3 out_flatLightColor;


vec3 phongModel(int light, vec3 vertexPosition, vec3 tnormal)
{
	// compute ambient light
	vec3 ambient = lights[light].La * material.Ka;

	// compute diffuse light
	vec3 s;
	
	if(lights[light].type == 0)
		s = normalize( lights[light].position.xyz - vertexPosition );
	else
		s = normalize( lights[light].position.xyz);

	float dotResult = max(dot(s, tnormal), 0.0);

	vec3 diffuse = lights[light].Ld * material.Kd * dotResult;

	// compute specular highlight
	vec3 specular = vec3(0.0);

	if(dotResult > 0.0)
	{
		vec3 v;

		if(lightingModel._nonLocalViewer == 1)
			v = vec3(0.0, 0.0, 1.0);
		else
			v = normalize(-vertexPosition.xyz);

		if(lightingModel._isBlinnPhong == 1)
		{
			// blinn-phong shading
			vec3 h = normalize(v + s);
			specular = lights[light].Ls * material.Ks * pow( max( dot(h, tnormal), 0.0), material.shininess);
		}
		else
		{
			// phong shading
			vec3 r = reflect(-s, tnormal);
			specular = lights[light].Ls * material.Ks * pow( max( dot(r, v), 0.0), material.shininess);
		}
	}

	return ambient + diffuse + specular;
}


void main()
{
	// getting the normal matrix transformation from modelview matrix transformation
	mat3 normalMatrix = transpose(inverse(mat3(modelviewMatrix)));
	vec3 n = normalize(normalMatrix * normal);

	// getting only the eye space position
	vec4 camPosition = modelviewMatrix * vec4(position, 1.0);

	// compute gouraud shading model
	out_lightColor = vec3(0.0);

	for(int l = 0; l < TOTAL_OF_LIGHTS; l++)
	{
		vec3 light = phongModel(l, camPosition.xyz, n);
	
		if(lightingModel._isTwoSided == 1)
		{
			float dotResult = dot(normalize(-camPosition.xyz), n);
		
			if(dotResult < 0)
				light = phongModel(l, camPosition.xyz, -n);
		}

		out_lightColor += light;
	}

	if(isFlatShading)
	{
		out_flatLightColor = out_lightColor;
	}

	// column-major order -> proj * view * model * position
	gl_Position = projectionMatrix * camPosition;
}
