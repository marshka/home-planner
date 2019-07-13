/// <reference path="../lib/utils.js" //>
/// <reference path="../lib/webgl-obj-loader.min.js" //>



function main() {

  //--------------------------INITIALIZATION
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    document.write("GL context not opened");
    return;
  }
  utils.resizeCanvasToDisplaySize(gl.canvas);

  var shaderDir = "/shaders/";
  var program = null;

  //directional light
  var dirLightAlpha = -utils.degToRad(60);
  var dirLightBeta  = -utils.degToRad(120);
  var directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
              Math.sin(dirLightAlpha), Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)];
  var directionalLightColor = [0.1, 1.0, 1.0];
  //material color
  var MaterialColor = [0.5, 0.5, 0.5];
  var lastUpdateTime = (new Date).getTime();
  var cubeRx = 0.0, cubeRy = 0.0, cubeRz = 0.0;

  var worldMatrix = utils.MakeWorld( 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
  var normalMatrix = utils.invertMatrix(utils.transposeMatrix(worldMatrix));

  //SET Global states (viewport size, viewport background color, Depth test)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

      program = utils.createProgram(gl, vertexShader, fragmentShader);
    });
  
  gl.useProgram(program);

  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");  
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");  
  var matrixLocation = gl.getUniformLocation(program, "matrix");
  // var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
  // var lightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
  // var lightColorHandle = gl.getUniformLocation(program, 'lightColor');
  //var normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');
  


  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(normalAttributeLocation);

  perspectiveMatrix = utils.MakePerspective(100, gl.canvas.width/gl.canvas.height, 0.1, 100.0);
  
  //----CAMERA MATRIX----// 
  var lookAtCamera = new LookAtCamera();
  lookAtCamera.setLookPoint(0,0,0);
  lookAtCamera.look();
  var vao = gl.createVertexArray();

  var modelObj;

  utils.loadFile('/objects/tavolo.obj', 0, 
  function (data) 
  {
        modelObj = new OBJ.Mesh(data);
        OBJ.initMeshBuffers(gl, modelObj);        
      });  
  

  worldMatrix = utils.multiplyMatrices(worldMatrix,utils.MakeScaleMatrix(2));
  normalMatrix = utils.invertMatrix(utils.transposeMatrix(worldMatrix));
  drawScene();
  

  function animate(){
    var currentTime = (new Date).getTime();
    var deltaC;
    if(lastUpdateTime){
      deltaC = (30 * (currentTime - lastUpdateTime)) / 1000.0;
    }

    lookAtCamera.setElevation(deltaC);
    lookAtCamera.look();

    // var curRotation = utils.MakeRotateXYZMatrix(deltaC, -deltaC, deltaC);

    // worldMatrix = utils.multiplyMatrices(worldMatrix,curRotation);
    // normalMatrix = utils.invertMatrix(utils.transposeMatrix(worldMatrix));
    lastUpdateTime = currentTime;               
  }

  function drawScene() {
    animate();
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
    matrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(matrix));
    
    // gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix));

    //gl.uniform3fv(materialDiffColorHandle, MaterialColor);
    //gl.uniform3fv(lightColorHandle,  directionalLightColor);
    //gl.uniform3fv(lightDirectionHandle,  directionalLight);

    gl.bindBuffer(gl.ARRAY_BUFFER, modelObj.vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, modelObj.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer(gl.ARRAY_BUFFER, modelObj.normalBuffer);    
    gl.vertexAttribPointer(normalAttributeLocation, modelObj.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelObj.indexBuffer);
    // gl.clearColor(0.85, 0.85, 0.85, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //   var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
    //   var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
    //   gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      
    //   gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix));

    //   gl.uniform3fv(materialDiffColorHandle, MaterialColor);
    //   gl.uniform3fv(lightColorHandle,  directionalLightColor);
    //   gl.uniform3fv(lightDirectionHandle,  directionalLight);

    //   gl.bindVertexArray(vao);
    //   gl.drawElements(gl.TRIANGLES, modelObj.indices.length, gl.UNSIGNED_SHORT, 0 );
    gl.drawElements(gl.TRIANGLES, modelObj.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    window.requestAnimationFrame(drawScene);
  }
    
    
  }


main();

