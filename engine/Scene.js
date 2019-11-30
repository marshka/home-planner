const MAX_LAMPS = 1;

var lookAtCamera;
var shaders, lights, materials;

// OBJECTS
var objects = [];
var obj_floor,
obj_walls;

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
			boundingBox: Shader.loadFromFiles('vs_bbox','fs_bbox')
		};

		lights = {
			ambient: new AmbientLight("ambient", 50, 50, 50, 0.5),
			main: new DirectionalLight("main", 0.0, 1.0, 1.0, 250, 250, 250)
		};

		materials = {
			void: new Material(0.0,0.0,0.0,0.0),
			floor: {
				parquet: new TextureMaterial("parquet.jpg"),
				maiolica: new TextureMaterial("maiolica.jpg"),
				fourTiles: new TextureMaterial("4tiles.jpg"),
				sixteenTiles: new TextureMaterial("16tiles.jpg")
			},
			walls: {
				white: new Material(250, 250, 250, 1),
				grey: new Material(130, 130, 130, 1),
				brown: new Material(100, 60, 60, 1),
				custom: new Material(240, 250, 130, 1)
			},
			texture: {
				lightWood: new TextureMaterial("light_wood.jpg"),
				whiteFabric: new TextureMaterial("white_fabric.jpg"),
				plant: new TextureMaterial("plant.jpg"),
				carpet: new TextureMaterial("carpet.jpg"),
				globe: new TextureMaterial("globe_main.png").setSpecularColor(230, 255, 200, 0.1).setSpecularShine(200)
			},
			blackLeather: new SpecularMaterial(30, 30, 30, 1),
			lamp: new SpecularMaterial(250, 250, 250, 1).setEmissionColor(220, 220, 220, 0.6),
			steel: new SpecularMaterial(100, 100, 100, 1)
		};

		obj_floor = new ObjectBase(Mesh.loadFromOBJFile('floor'), materials.floor.parquet);
		obj_walls = new ObjectBase(Mesh.loadFromOBJFile('walls'), materials.walls.white);

		Modal.init();
		
	},

	draw: function(){
		
		Canvas.onResize();
		Input.handle();
		lookAtCamera.look();

		obj_floor.render();
		obj_walls.render();

		for(var i=0; i<objects.length; i++)
		{
			objects[i].solveCollision();
			objects[i].render();
		}

		window.requestAnimationFrame(Scene.draw);
	}
}