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

var Scene = {

	init: function() {

		//init camera
		lookAtCamera = new LookAtCamera();
		lookAtCamera.setLookPoint(0,0,0);
		lookAtCamera.look();

		shaders = {
			lambert: Shader.loadFromFiles('vs', 'fs'),
			phong: Shader.loadFromFiles('vs', 'fs'),
			texture: Shader.loadFromFiles('vs', 'fs_tex'),
		};

		lights = {
			ambient: new AmbientLight("ambient", 50, 50, 50, 0.5),
			main: new DirectionalLight("main", -1.0, 1.0, 1.0, 200, 200, 200)
		};


		mat_parquet = new TextureMaterial("parquet.jpg");
		mat_maiolica = new TextureMaterial("maiolica.jpg");
		mat_4tiles = new TextureMaterial("4tiles.jpg");
		mat_16tiles = new TextureMaterial("16tiles.jpg");

		mat_white = new Material(250, 250, 250, 1);
		mat_grey = new Material(130, 130, 130, 1);
		mat_yellow = new Material(240, 250, 130, 1);
		mat_brown = new Material(100, 60, 60, 1);

		obj_floor = new ObjectBase(Mesh.loadFromOBJFile('floor'), mat_parquet);
		

		obj_walls = new ObjectBase(Mesh.loadFromOBJFile('walls'), mat_white);
		
	},

	draw: function(){
		handleInput();
		Canvas.onResize();

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