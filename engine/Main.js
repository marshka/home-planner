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

function main()
{
	Canvas.init();
	var mesh = Mesh.loadFromOBJFile('room');
	var shader = Shader.loadFromFiles('vs', 'fs');
	gl.useProgram(shader.program);
	mesh.render(worldMatrix, shader);
}