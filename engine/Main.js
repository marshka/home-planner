// Global variables
var gl;
var canvas;
var aspectRatio;

const root_dir = window.location.origin;
const shaders_dir = root_dir + "/shaders/";
const models_dir = root_dir + "/objects/";
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

function main()
{
  Canvas.init();
  Input.init();
	mesh = Mesh.loadFromOBJFile('tavolo');
	shader = Shader.loadFromFiles('vs', 'fs');
	
	lookAtCamera = new LookAtCamera();
	lookAtCamera.setLookPoint(0,0,0);
	lookAtCamera.look();
	
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

    // var curRotation = utils.MakeRotateXYZMatrix(deltaC, -deltaC, deltaC);

    // worldMatrix = utils.multiplyMatrices(worldMatrix,curRotation);
    // normalMatrix = utils.invertMatrix(utils.transposeMatrix(worldMatrix));
    lastUpdateTime = currentTime;               
  }

function drawScene(){
	//animate();
  mesh.render(worldMatrix,shader);
  lookAtCamera.look();
	window.requestAnimationFrame(drawScene);
}