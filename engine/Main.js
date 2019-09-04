// Global variables
var gl;
var canvas;
var aspectRatio;

const root_dir = window.location.origin;
const shaders_dir = root_dir + "/shaders/";
const models_dir = root_dir + "/objects/models/";
const textures_dir = root_dir + "/objects/textures/";

//global matrices
var perspectiveMatrix = utils.identityMatrix();
var viewMatrix = utils.identityMatrix();
var projectionMatrix = utils.identityMatrix();
var worldMatrix = utils.identityMatrix();
var lastUpdateTime = (new Date).getTime();

var mesh;
var shader;
var lookAtCamera;
var objects = [];
var wallsOBJ;

function main()
{
  Canvas.init();
  Input.init();

	lookAtCamera = new LookAtCamera();
	lookAtCamera.setLookPoint(0,0,0);
	lookAtCamera.look();
	
  initScene();
	drawScene();
}

function animate(){
    var currentTime = (new Date).getTime();
    var deltaC;
    if(lastUpdateTime){
      deltaC = (30 * (currentTime - lastUpdateTime)) / 1000.0;
    }

    lookAtCamera.setAngle(deltaC);
    lookAtCamera.look();

    lastUpdateTime = currentTime;               
  }

function initScene(){
    var floorMesh = Mesh.loadFromOBJFile('floor');
    shader = Shader.loadFromFiles('vs', 'fs_tex');
    var floorOBJ = new ObjectBase(floorMesh, shader);
    floorOBJ.setPosition(0,0,0);
    floorOBJ.setScale(5,5,5);
    objects.push(floorOBJ);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
     
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));
     
    // Asynchronously load an image
    var image = new Image();
    image.src = textures_dir + "parquet.jpg";
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    });

    var wallsMesh = Mesh.loadFromOBJFile('walls');
    shader = Shader.loadFromFiles('vs', 'fs');
    var wallsOBJ = new ObjectBase(wallsMesh, shader);
    wallsOBJ.setPosition(0,0,0);
    wallsOBJ.setScale(5,5,5);
    objects.push(wallsOBJ);
}

  //------FUNZIONE DI PROVA---------//
function handleInput(){

  if(Input.isKeyClicked(Input.W_KEY)){
    var tavoloMesh = Mesh.loadFromOBJFile('tavolo');

    var tavoloOBJ = new ObjectBase(tavoloMesh, shader);
    tavoloOBJ.setPosition(4,0,0);
    tavoloOBJ.setScale(5,5,5);
    tavoloOBJ.setbBox(true);
    tavoloOBJ.isSelected = true;
    
    objects.push(tavoloOBJ);

  }
  if(Input.isKeyClicked(Input.A_KEY)){
    var tavolo2Mesh = Mesh.loadFromOBJFile('tavolo');

    var tavolo2OBJ = new ObjectBase(tavolo2Mesh, shader);
    tavolo2OBJ.setPosition(-4,0,0);
    tavolo2OBJ.setScale(5,5,5);
    objects.push(tavolo2OBJ);

  }
}

function drawScene(){
  handleInput();
  Canvas.onResize();

  for(var i=0; i<objects.length; i++)
  objects[i].render();
  lookAtCamera.look();

	window.requestAnimationFrame(drawScene);
}