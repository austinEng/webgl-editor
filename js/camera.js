function Camera() {
  var near = 0.1;
  var far = 100;
  var zoom = 10;
  var width;
  var height;
  var fov = 45;
  var eye = vec3.fromValues(0, 0, zoom);
  var rotation = mat4.create();
  var forward = vec3.fromValues(0,0,1);
  var right = vec3.fromValues(1,0,0);
  var up = vec3.fromValues(0,1,0);
  var ref = vec4.create();

  this.setSize = function(w, h) {
    width = w;
    height = h;
  }

  this.getEye = function() {
    return eye;
  }

  var recomputeEye = function() {
    eye = vec3.fromValues(0, 0, zoom);
    vec3.transformMat4(eye, eye, rotation);
    vec3.add(eye, eye, ref);
    var diff = vec3.create();
    vec3.negate(diff, eye);
    vec3.add(diff, diff, ref);
    vec3.normalize(forward, diff);
    vec3.cross(right, forward, up);
    vec3.normalize(right, right);
    vec3.cross(up, right, forward);
    vec3.normalize(up, up);
  }

  var getPerspective = function() {
    var out = mat4.create();
    mat4.perspective(out, fov, width/height, near, far);
    return out
  }

  var getView = function() {
    var out = mat4.create();
    mat4.lookAt(out, eye, ref, up);
    return out;
  }

  this.getViewProj = function() {
    var out = mat4.create();
    mat4.multiply(out, getPerspective(), getView());
    return out;
  }

  this.rotate = function(mouseData) {
    var x = mouseData.mouseMoveRelDiff[0];
    var y = mouseData.mouseMoveRelDiff[1];
    var riComp = vec3.create();
    var upComp = vec3.create();
    var paraVec = vec3.create();
    var perpVec = vec3.create();
    vec3.scale(riComp, right, x);
    vec3.scale(upComp, up, -1*y);
    vec3.add(paraVec, riComp, upComp);
    vec3.cross(perpVec, forward, paraVec);
    vec3.normalize(perpVec, perpVec);
    var rotMat = mat4.create();
    rotateAbout(Math.sqrt(x*x+y*y) * 2 * Math.PI, perpVec);
    recomputeEye();
  }

  var rotateAbout = function(angle, axis) {
    var rotMat = mat4.create();
    mat4.rotate(rotMat, rotMat, angle, axis);
    mat4.multiply(rotation, rotMat, rotation);
    vec3.transformMat4(right, right, rotMat);
    vec3.transformMat4(up, up, rotMat);
    vec3.transformMat4(forward, forward, rotMat);
  }

  this.zoom = function(amount) {
    zoom -= amount / 200 * Math.min(1, zoom / 10);
    recomputeEye();
  }

  this.slide = function(mouseData) {
    var x = width / 2 - mouseData.mouseMoveDiff[0];
    var y = height / 2 - mouseData.mouseMoveDiff[1];
    ref = this.toWorld(x, y);
    recomputeEye();
  }

  this.toWorld = function(x, y) {
    var sx = 2*x / width - 1;
    var sy = 1 - 2*y / height;
    var alpha = fov / 2;
    var len = vec3.distance(ref, eye);

    var V = vec4.clone(up);
    var H = vec4.clone(right);
    vec4.scale(V, V, sy*len*Math.tan(alpha));
    vec4.scale(H, H, sx*len*width/height*Math.tan(alpha));

    var p = vec4.clone(ref);
    vec4.add(p, p, V);
    vec4.add(p, p, H);
    return p;
  }

  rotateAbout(-Math.PI/6, [1,0,0]);
  rotateAbout(Math.PI/6, [0,1,0]);
  recomputeEye();
}