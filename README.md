# GLSL Shader Recipes

## List of shader programs

- Filled Circle
- Fuzzy Circle
- Perforated Look
- Phong Model Reflection (Gouraud shading, Phong Shadind, Blinn-Phong Shading, Two-Sided Shading, Non Local Viewer)
- Toon Shading
- Physically-Based Reflection (PBR)


## GLSL functions

min returns the minimum of the two parameters. It returns y if y is less than x, otherwise it returns x.
```
  genType min(genType x, genType y);
```

max returns the maximum of the two parameters. It returns y if y is greater than x, otherwise it returns x.
```
  genType max(genType x, genType y);
```

clamp returns the value of x constrained to the range minVal to maxVal.
```
  genType clamp(genType x, genType minVal, genType maxVal);
```

Perform Hermite interpolation between two values. This is useful in cases where a threshold function with a smooth transition is desired.

```
  genType smoothstep(genType edge0, genType edge1, genType x);
```

mix performs a linear interpolation between x and y using a to weight between them. The return value is computed as ```x * (1 − a) + y * a```.

```
  genType mix(	genType x, genType y, genType a);
```

??

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
genType reflect(genType I, genType N);
```
Calculate the reflection direction for an incident vector.

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

# References

- Wolff, D. OpenGL 4 Shading Language Cookbook. 3rd ed. Birmingham: Packt Publishing, 2018.
