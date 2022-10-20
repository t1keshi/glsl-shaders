#version 450 core

// total of lights
const int TOTAL_OF_LIGHTS = 1;

layout (location = 2) in vec3 transfomedNormal;
layout (location = 3) in vec3 eyePosition;


uniform mat4 viewMatrix;


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


uniform struct LightingModelInfo {
	int _nonLocalViewer;
	int _isTwoSided;
	int _isBlinnPhong;
} lightingModel;


layout (location = 0) out vec4 fragmentColor;


vec3 phongModel(int light, vec3 v, vec3 n)
{
	// compute ambient light
	vec3 ambient = lights[light].La * material.Ka;

	// compute diffuse light
	vec3 diffuse = vec3(0.0);

	vec3 lightPosition = (viewMatrix * vec4(lights[light].position, 1.0)).xyz;

	vec3 s;

	if(lights[light].type == 1)
	{
		s = normalize(lights[light].position);
	}
	else
	{
		s = normalize(lightPosition - v);
	}

	float dotResult = max(dot(s, n), 0.0);

	diffuse = lights[light].Ld * material.Kd * dotResult;

	float spotScale = 1.0;

	// if light type is spot
	if(lights[light].type == 2)
	{
		vec3 spotDirection = (viewMatrix * vec4(-lights[light].spot_direction, 1.0)).xyz;
		float cosAngle = dot(-s, normalize(spotDirection));
		float angle = acos(cosAngle);

		if(angle < lights[light].spot_cutoff)
			spotScale = pow(cosAngle, lights[light].spot_exponent);
		else
			spotScale = 0.0;
	}

	// compute specular light
	vec3 specular = vec3(0.0);

	if(dotResult > 0.0)
	{
		vec3 vec;

		if(lightingModel._nonLocalViewer == 1)
			vec = vec3(0.0, 0.0, 1.0);
		else
			vec = normalize(-v);

		if(lightingModel._isBlinnPhong == 1)
		{
			// blinn-phong shading
			vec3 h = normalize(v + s);
			specular = lights[light].Ls * material.Ks * pow( max( dot(h, n), 0.0), material.shininess);
		}
		else
		{
			// phong shading
			vec3 r = reflect(-s, n);
			specular = lights[light].Ls * material.Ks * pow( max( dot(r, vec), 0.0), material.shininess);
		}
	}

	return ambient + ((diffuse + specular) * spotScale);
}


void main()
{
	vec3 light = vec3(0.0);

	for(int i = 0; i < TOTAL_OF_LIGHTS; i++)
	{
		vec3 l;
		
		if(lightingModel._isTwoSided == 1 && !gl_FrontFacing)
			l = phongModel(i, eyePosition, -transfomedNormal);
		else
			l = phongModel(i, eyePosition, transfomedNormal);
		
		light += l;
	}

	fragmentColor = vec4(light, 1.0);
}

