# GLSL Shader Recipes

## List of shader programs

- Fuzzy Circle
- Perforated Look
- Phong Model Reflection (Gouraud shading, Phong Shadind, Blinn-Phong Shading, Two-Sided Shading, Non Local Viewer)
- Toon Shading
- Physically-Based Reflection (PBR)


## GLSL functions

```
genType normalize(genType v);
```
Calculates the unit vector in the same direction as the original vector.

```
float dot(genType x, genType y);
double dot(genType x, genType y);
```
Calculate the dot product of two vectors.

```
genType max(genType x, genType y);
```
Return the greater of two values.

```
genType reflect(genType I, genType N);
```
Calculate the reflection direction for an incident vector.

```
genType mix(genType x, genType y, gentType a);
```
Linearly interpolate between two values.
mix performs a linear interpolation between x and y using a to weight between them. The return value is computed as x(1−a) + ya.

```
genType fract(genType x);
```
Compute the fractional part of the argument.

```
bvec greaterThan(vec x, vec y);
```
Perform a component-wise greater-than comparison of two vectors.

```
bool all(bvec x);
```
Check whether all elements of a boolean vector are true.

```
genType floor(genType x);
```
Find the nearest integer less than or equal to the parameter.

```
genType ceil(genType x);
```
Find the nearest integer that is greater than or equal to the parameter.

```
genType clamp(genType x, genType minVal, genType maxVal);
```
Constrain a value to lie between two further values.

# References

- Wolff, D. OpenGL 4 Shading Language Cookbook. 3rd ed. Birmingham: Packt Publishing, 2018.
