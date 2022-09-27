#version 450 core

layout (location = 0) in vec4 color;
layout (location = 1) in vec2 texCoords;
layout (location = 2) in vec3 normal;
layout (location = 3) in vec3 light;

layout (location = 4) in vec3 frontColor;
layout (location = 5) in vec3 backColor;

uniform sampler2D tex2D;

layout (location = 0) out vec4 fragmentColor;

void main()
{
	//vec4 inputColor = color;
	vec4 inputColor = texture(tex2D, texCoords);

	const float scale = 15.0;
	bvec2 toDiscard = greaterThan(fract(texCoords * scale), vec2(0.2, 0.2));

	if(all(toDiscard))
		discard;

	if(gl_FrontFacing)
		fragmentColor = vec4(frontColor, 1.0);
	else
		fragmentColor = vec4(backColor, 1.0);

	// calculation ambient light
//	vec3 ambient = vec3(0.3, 0.3, 0.3); // light ambient


	// calculation diffuse for directional light
//	vec3 directionalLight = vec3(1.0, 1.0, 1.0);
//	vec3 lightDirection = normalize(vec3(0.0, 1.0, 0.0));
//	float diffuse = max(0.0, dot(normal, lightDirection));

	//vec3 scatteredLight = ambient + directionalLight * diffuse;
//	vec3 scatteredLight = light;
//	vec3 rgb = min(inputColor.rgb * scatteredLight, vec3(1.0));
	vec3 rgb = min(inputColor.rgb * light, vec3(1.0));

//	fragmentColor = vec4(light, 1.0);
	fragmentColor = vec4(rgb, inputColor.a);
}
