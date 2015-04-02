function MyGL() {

  var activeCamera;
  var gl;
  var shaderProgram;
  var mvMatrix = mat4.create();
  var mvMatrixStack = [];
  var pMatrix = mat4.create();
  var invtrMatrix = mat4.create();
  var cubeVertexPositionBuffer;
  var cubeVertexColorBuffer;
  var cubeVertexIndexBuffer;
  var cubeVertexNormalBuffer;

  var lambert;
  var cube;

  this.init = function(canvas) {
    this.canvas = canvas;
    try {
      gl = canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: true
      });
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch(e) {

    }
    if (!gl) {
      alert("Could not initialize WebGL, sorry :-(");
    }
    lambert = new ShaderProgram(gl, "shader-vs", "shader-fs");
    initBuffers();

    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);
  }

  this.setCamera = function(camera) {
    activeCamera = camera;
    lambert.setViewProj(activeCamera.getViewProj());
  }

  this.getCamera = function() {
    return activeCamera;
  }

  this.resize = function() {
    canvas.setAttribute('width', canvas.offsetWidth);
    canvas.setAttribute('height', canvas.offsetHeight);
    gl.viewportWidth = canvas.offsetWidth;
    gl.viewportHeight = canvas.offsetHeight;
    activeCamera.setSize(gl.viewportWidth, gl.viewportHeight);
  }

  var initBuffers = function() {
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    vertices = [
      // Front face
      -1.0, -1.0,  1.0, 1.0,
       1.0, -1.0,  1.0, 1.0,
       1.0,  1.0,  1.0, 1.0,
      -1.0,  1.0,  1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0, 1.0,
      -1.0,  1.0, -1.0, 1.0,
       1.0,  1.0, -1.0, 1.0,
       1.0, -1.0, -1.0, 1.0,

      // Top face
      -1.0,  1.0, -1.0, 1.0,
      -1.0,  1.0,  1.0, 1.0,
       1.0,  1.0,  1.0, 1.0,
       1.0,  1.0, -1.0, 1.0,

      // Bottom face
      -1.0, -1.0, -1.0, 1.0,
       1.0, -1.0, -1.0, 1.0,
       1.0, -1.0,  1.0, 1.0,
      -1.0, -1.0,  1.0, 1.0,

      // Right face
       1.0, -1.0, -1.0, 1.0,
       1.0,  1.0, -1.0, 1.0,
       1.0,  1.0,  1.0, 1.0,
       1.0, -1.0,  1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0, 1.0,
      -1.0, -1.0,  1.0, 1.0,
      -1.0,  1.0,  1.0, 1.0,
      -1.0,  1.0, -1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 4;
    cubeVertexPositionBuffer.numItems = 24;

    cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    normals = [
      // Front
       0.0,  0.0,  1.0, 0.0,
       0.0,  0.0,  1.0, 0.0,
       0.0,  0.0,  1.0, 0.0,
       0.0,  0.0,  1.0, 0.0,

      // Back
       0.0,  0.0, -1.0, 0.0,
       0.0,  0.0, -1.0, 0.0,
       0.0,  0.0, -1.0, 0.0,
       0.0,  0.0, -1.0, 0.0,

      // Top
       0.0,  1.0,  0.0, 0.0,
       0.0,  1.0,  0.0, 0.0,
       0.0,  1.0,  0.0, 0.0,
       0.0,  1.0,  0.0, 0.0,

      // Bottom
       0.0, -1.0,  0.0, 0.0,
       0.0, -1.0,  0.0, 0.0,
       0.0, -1.0,  0.0, 0.0,
       0.0, -1.0,  0.0, 0.0,

      // Right
       1.0,  0.0,  0.0, 0.0,
       1.0,  0.0,  0.0, 0.0,
       1.0,  0.0,  0.0, 0.0,
       1.0,  0.0,  0.0, 0.0,

      // Left
      -1.0,  0.0,  0.0, 0.0,
      -1.0,  0.0,  0.0, 0.0,
      -1.0,  0.0,  0.0, 0.0,
      -1.0,  0.0,  0.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    cubeVertexNormalBuffer.itemSize = 4;
    cubeVertexNormalBuffer.numItems = 24;

    cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    var colors = [];
    for (var i=0; i < 24; i++) {
      colors = colors.concat([0.8, 0.8, 0.8, 1.0]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    cubeVertexColorBuffer.itemSize = 4;
    cubeVertexColorBuffer.numItems = 24;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;

    cube = {
      positions: cubeVertexPositionBuffer,
      normals: cubeVertexNormalBuffer,
      colors: cubeVertexColorBuffer,
      indices: cubeVertexIndexBuffer,
      count: 36,
      drawMode: gl.TRIANGLES
    }
  }

  this.drawScene = function() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var model = mat4.create();
    lambert.setModelMat(model);
    lambert.setViewProj(activeCamera.getViewProj());
    lambert.draw(cube);
  }
}