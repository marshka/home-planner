var lookAtCamera;
var lights;
var shaders;
var objects = [];
var wallsOBJ;

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
			main: new DirectionalLight("main", -1.0, 1.0, 1.0, 100, 100, 100)
		};

		var floor = new ObjectBase(Mesh.loadFromOBJFile('floor'), new TextureMaterial("parquet.jpg"));
		objects.push(floor);

		wallsOBJ = new ObjectBase(Mesh.loadFromOBJFile('walls'), new TextureMaterial("stone.jpg"));
		objects.push(wallsOBJ);
	},

	draw: function(){
		handleInput();
		Canvas.onResize();

		for(var i=0; i<objects.length; i++)
			objects[i].render();
		lookAtCamera.look();

		window.requestAnimationFrame(Scene.draw);
	}
}