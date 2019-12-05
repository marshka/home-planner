// Global variables
var gl;
var canvas;
var aspectRatio;

const root_dir = window.location.href;
const shaders_dir = root_dir + "/shaders/";
const models_dir = root_dir + "/objects/models/";
const textures_dir = root_dir + "/objects/textures/";
const thumbs_dir = root_dir + "/objects/tmb/";

//global matrices
var perspectiveMatrix = utils.identityMatrix();
var viewMatrix = utils.identityMatrix();
var projectionMatrix = utils.identityMatrix();


function main() {

  Canvas.init();
  Scene.init();
  Input.init();
  
}
