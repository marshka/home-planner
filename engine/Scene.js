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
			walls: Shader.loadFromFiles('vs_tex', 'fs_walls'),
			boundingBox: Shader.loadFromFiles('vs_bbox','fs_bbox')
		};

		lights = {
			ambient: new AmbientLight("ambientLight", 250, 250, 250).setIntensity(0.7),
			main: new DirectionalLight("mainLight", 250, 250, 250).setDirection(0.0, 1.0, 1.0).setIntensity(0.2)
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
				lightmap: new WallsMaterial("walls_lightmap.png").setDiffuseColor(250, 250, 250, 1)
			},
			texture: {
				lightWood: new TextureMaterial("light_wood.jpg"),
				wengeWood: new TextureMaterial("wenge_wood_b.jpg"),
				whiteFabric: new TextureMaterial("white_fabric.jpg"),
				plant: new TextureMaterial("plant.jpg"),
				carpet: new TextureMaterial("carpet.jpg"),
				globe: new TextureMaterial("globe_main.png").setSpecularColor(255, 255, 150, 1).setSpecularShine(50)
			},
			blackLeather: new SpecularMaterial(30, 30, 30, 1),
			lamp: new Material(250, 250, 250, 1).setEmissionColor(220, 220, 220, 0.9),
			steel: new SpecularMaterial(100, 100, 100, 1).setSpecularShine(300)
		};

		// Synchronously get room objs
		// Asynchronously prefetch objs for improving performances
		this.preload();

		Modal.init();
		
	},

	preload: function() {
		const roomObjs = ['floor', 'walls_lightmap', 'chandelier/chandelierWhite', 'chandelier/chandelierSteel', 'chandelier/chandelierWood'];
		const objs = ['table', 'chair', 'sofa', 'tvtable', 'plant', 'globe', 'carpet', 'lamp/lampSteel', 'lamp/lampWhite'];
		var roomPromise = this.prefetchOBJs(roomObjs);
		// On floor and walls loaded:
		Promise.all(roomPromise).then(results => {
			room.walls = new Walls();
			room.floor = new Floor();
			room.chandelier = new Chandelier();
			Scene.draw();
			var objsPromise = this.prefetchOBJs(objs);
			Promise.all(objsPromise).then(results => {
				// hide spinner
				document.getElementById('spinner-container').style.display = 'none';
			});
			// hide preloader
			var hidePreloader = new Promise(resolve => {(
				function waitForFoo(){
					if (isTextureLoaded.every(function(e){return e})) return resolve();
					setTimeout(waitForFoo, 30);
				})();
			}).then(result => {
				document.getElementById('preloader-bg').style.display = 'none';
			});
		});
	}, 

	prefetchOBJs: function(objs){
		const urls = objs.map(obj => models_dir + obj + '.obj');
		return promises = urls.map(url => new Promise(resolve => {
			req = new XMLHttpRequest();
			req.onload = () => resolve();
			req.open("GET", url, true);
			req.send(null);
		}));
	},

	draw: function(){
		
		Canvas.onResize();
		Input.handle();
		lookAtCamera.look();

		Object.keys(room).forEach(function(i) {
			room[i].render();
		});

		for(var i=0; i<objects.length; i++)
		{
			objects[i].solveCollision();
			objects[i].render();
		}

		window.requestAnimationFrame(Scene.draw);
	}
}