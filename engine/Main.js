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


function main() {

  Canvas.init();
  Scene.init();
  Input.init();

  Scene.draw();

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