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

var lookAtCamera;
var shaders, lights, materials;

// OBJECTS
var objects = [];
var obj_floor, obj_walls;

const MAX_LAMPS = 1;


function main() {

	var preloader = document.getElementById('preloader');
	var touchscreenWarn = document.getElementById('touchscreen-warn');

	if ('ontouchstart' in document.documentElement) {
		preloader.remove();
		touchscreenWarn.style.display = 'block';
	} else {
		touchscreenWarn.remove();
		Canvas.init();
		Scene.init();
		Input.init();
	}

}
