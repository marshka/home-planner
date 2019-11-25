var lookAtCamera;
var lights;
var shaders;

// OBJECTS
var objects = [];
var obj_floor,
obj_walls;

// MATERIAL
var mat_parquet,
mat_maiolica,
mat_4tiles,
mat_16tiles;
var mat_white,
mat_grey,
mat_yellow,
mat_brown;
var mat_lightWood,
mat_blackPlastic,
mat_steel,
mat_whiteFabric;

var Scene = {

	init: function() {

		//init camera
		lookAtCamera = new LookAtCamera();
		lookAtCamera.setLookPoint(0,0.5,0);
		lookAtCamera.look();

		shaders = {
			lambert: Shader.loadFromFiles('vs', 'fs'),
			phong: Shader.loadFromFiles('vs', 'fs_phong'),
			texture: Shader.loadFromFiles('vs_tex', 'fs_tex'),
		};

		lights = {
			ambient: new AmbientLight("ambient", 50, 50, 50, 0.5),
			main: new DirectionalLight("main", 0.0, 1.0, 1.0, 200, 200, 200)
		};

		this.initMaterials();

		obj_floor = new ObjectBase(Mesh.loadFromOBJFile('floor'), mat_parquet);
		obj_walls = new ObjectBase(Mesh.loadFromOBJFile('walls'), mat_white);

		Modal.init();
		
	},

	initMaterials: function() {

		mat_parquet = new TextureMaterial("parquet.jpg");
		mat_maiolica = new TextureMaterial("maiolica.jpg");
		mat_4tiles = new TextureMaterial("4tiles.jpg");
		mat_16tiles = new TextureMaterial("16tiles.jpg");

		mat_white = new Material(250, 250, 250, 1);
		mat_grey = new Material(130, 130, 130, 1);
		mat_yellow = new Material(240, 250, 130, 1);
		mat_brown = new Material(100, 60, 60, 1);

		mat_lightWood = new TextureMaterial("light_wood.jpg");
		mat_whiteFabric = new TextureMaterial("white_fabric.jpg");
		mat_plant = new TextureMaterial("plant.jpg");
		mat_carpet = new TextureMaterial("carpet.jpg");
		mat_globe = new TextureMaterial("globe_main.png");
		mat_globe.setSpecularColor(230, 255, 200, 0.1).setSpecularShine(200);
		mat_blackLeather = new SpecularMaterial(30, 30, 30, 1);
		mat_lamp = new SpecularMaterial(250, 250, 250, 1);
		mat_lamp.setEmissionColor(220, 220, 220, 0.6);
		mat_steel = new SpecularMaterial(100, 100, 100, 1);
		
	},

	draw: function(){
		
		Canvas.onResize();
		Input.handle();

		obj_floor.render();
		obj_walls.render();

		for(var i=0; i<objects.length; i++)
		{
			objects[i].solveCollision();
			objects[i].render();
		}
		lookAtCamera.look();

		window.requestAnimationFrame(Scene.draw);
	}
}