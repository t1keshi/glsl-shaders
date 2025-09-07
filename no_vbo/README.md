# Drawing in Vertex Shader with no VBO

C++/OpenGL application side:

```
  // create a vertex array object
  GLuint vao;
  glGenVertexArrays(1, &vao);
  glBindVertexArray(vao);

  // no need to create any vertex buffer object (vbo)

  // call a draw command
  glClear(GL_COLOR_BUFFER_BIT);
  glDrawArrays(GL_POINTS, 0, 1);
  swapBuffers();
```

GLSL Vertex Shader:

```
  #version 430
  
  void main(void)
  {
  	gl_Position = vec4(0.0, 0.0, 0.0, 1.0); // draw a point at center (0.0, 0.0, 0.0)
  }
```

GLSL Fragment Shader:

```
  #version 430
  
  out vec4 color;
  
  void main(void)
  {
  	color = vec4(0.0, 0.0, 1.0,1.0); // assign blue color to the fragment
  }
```
