# Perforated Look

Shader para remover fragmentos de forma seletiva baseado em coordenas (u, v) de texutura. Esta técnica cria um padrão "lattice-like".

## Pré-Requisitos

- Phong Reflection Model (Gouraud)
- UV coordinates for each vertex
- Two-Sided shading

Para calcular a cor final do modelo geométrico estamos utilizando Phong Reflection Model (Gouraud), entretanto, pode ser utilizado qualquer outro modelo de reflexão e shading.

Como partes do modelo geométrico são removidas, devemos calcular a cor das faces traseiras para que elas fiquem visiveis também (Two-Sided Shading).

## O Algoritmo

O algoritmo de remoção de partes do modelo geométrico ocorre no Fragment Shader.

We first scale the texture coordinate by the arbitrary scaling factor ```scale```. This corresponds to the number of lattice rectangles per unit (scaled) texture coordinate.

```
// scaling factor to scale the texture coordinates
const float scale = 100.0;
```

We then compute the fractional part of each component of the scaled texture coordinate using the built-in function ```fract```.

```
vec2 fractionalPart = fract(texCoords * scale);
```

Each component is compared to 0.2 using the built-in the ```greaterThan``` function, and the result is stored in the Boolean vector ```toDiscard```. The ```greaterThan``` function compares the two vectors component-wise, and stores the Boolean
results in the corresponding components of the return value.

```
bvec2 toDiscard = greaterThan(fractionalPart, vec2(0.2, 0.2));
```

If both components of the vector toDiscard are true, then the fragment lies within the inside of each lattice frame, and therefore we wish to discard this fragment. We can use the built-in function ```all``` to help with this check. The function ```all``` will return true if all of the components of the parameter vector are true. If the function returns true, we execute the ```discard``` statement to reject the fragment.

```
if(all(toDiscard))
  discard;
```

In the else branch, we color the fragment based on the orientation of the polygon.

```
if(gl_FrontFacing)
  fragmentColor = vec4(frontColor, 1.0);
else
  fragmentColor = vec4(backColor, 1.0);
```
