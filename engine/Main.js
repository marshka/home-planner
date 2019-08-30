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
    var roomMesh = Mesh.loadFromOBJFile('room');
    shader = Shader.loadFromFiles('vs', 'fs');

    var roomOBJ = new ObjectBase(roomMesh, shader);
    roomOBJ.setPosition(0,0,0);
    roomOBJ.setScale(5,5,5);
    objects.push(roomOBJ);
}

  //------FUNZIONE DI PROVA---------//
function handleInput(){

  if(Input.isKeyClicked(Input.W_KEY)){
    var tavoloMesh = Mesh.loadFromOBJFile('tavolo');

    var tavoloOBJ = new ObjectBase(tavoloMesh, shader);
    tavoloOBJ.setPosition(4,0,0);
    tavoloOBJ.setScale(5,5,5);
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