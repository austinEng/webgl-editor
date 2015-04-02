function ShaderProgram(mygl, vert, frag) {
  var modelMat = mat4.create();
  var invTrMat = mat4.create();
  var viewProjMat = mat4.create();
  var gl = mygl;
  var shaderProgram;

  this.init = function(vert, frag) {
    var vertexShader = getShader(vert);
    var fragmentShader = getShader(frag);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    shaderProgram.viewProjUniform = gl.getUniformLocation(shaderProgram, "uViewProjMatrix");
    shaderProgram.modelMatUniform = gl.getUniformLocation(shaderProgram, "uModelMatrix");
    shaderProgram.invTrMatUniform = gl.getUniformLocation(shaderProgram, "uInvTrMatrix");
  }

  var getShader = function(id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
      return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
      if (k.nodeType == 3) {
        str += k.textContent;
      }
      k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  this.draw = function(obj) {
    gl.useProgram(shaderProgram);

    if (shaderProgram.vertexPositionAttribute != -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.positions)
      gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);
    }
    if (shaderProgram.vertexNormalAttribute != -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.normals)
      gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
      gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 4, gl.FLOAT, false, 0, 0);
    }
    if (shaderProgram.vertexColorAttribute != -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.colors)
      gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
      gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);
    gl.drawElements(obj.drawMode, obj.count, gl.UNSIGNED_SHORT, 0);
  }

  this.setViewProj = function(matrix) {
    gl.useProgram(shaderProgram);
    viewProjMat = matrix;
    if (shaderProgram.viewProjUniform != -1) {
      gl.uniformMatrix4fv(shaderProgram.viewProjUniform, false, viewProjMat);
    }
  }

  this.setModelMat = function(matrix) {
    gl.useProgram(shaderProgram);
    modelMat = matrix;
    mat4.transpose(invTrMat, modelMat);
    mat4.invert(invTrMat, invTrMat);
    if (shaderProgram.modelMatUniform != -1) {
      gl.uniformMatrix4fv(shaderProgram.modelMatUniform, false, modelMat);
    }
    if (shaderProgram.invTrMatUniform != -1) {
      gl.uniformMatrix4fv(shaderProgram.invTrMatUniform, false, invTrMat);
    }
  }

  this.init(vert, frag);
}