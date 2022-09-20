#version 450 core

layout (location = 1) in vec2 texCoords;

uniform sampler2D tex2D;

layout (location = 0) out vec4 fragmentColor;

// The variables within this block define the parameters of our fuzzy circle.
// The OuterColor variable defines the color outside of the circle.
// InnerColor is the color inside of the circle.
// RadiusInner is the radius that defines the part of the circle that is a
// solid color (inside the fuzzy edge), and the distance from the center of the
// circle to the inner edge of the fuzzy boundary.
// RadiusOuter is the outer edge of the fuzzy boundary of the circle (when the
// color is equal to OuterColor).

layout (binding = 0) uniform BlobSettings
{
	 vec4 InnerColor;
	 vec4 OuterColor;
	 float RadiusInner;
	 float RadiusOuter;
};

void main()
{
	// The code within the main function computes the distance of the texture
	// coordinate to the center of the quad located at (0.5, 0.5). It then uses
	// that distance to compute the color by using the smoothstep function.
	// This function provides a value that smoothly varies between 0.0 and 1.0
	// when the value of the third argument is between the values of the first
	// two arguments. Otherwise, it returns 0.0 or 1.0, depending on whether
	// dist is less than the first or greater than the second, respectively.
	// The mix function is then used to linearly interpolate between InnerColor
	// and OuterColor based on the value returned by the smoothstep function.

	float dx = texCoords.x - 0.5;
	float dy = texCoords.y - 0.5;
	float distance = sqrt(dx * dx + dy * dy);

	fragmentColor = mix(
		InnerColor,
		OuterColor,
		smoothstep(RadiusInner, RadiusOuter, distance));
}
