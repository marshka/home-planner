class Light {

	constructor(name, x, y, z, r, g, b) {
		this.name = name;
		this.position = [x, y, z, 1.0];
		this.color = [r / 255.0, g / 255.0, b / 255.0];
		this.intensity = 1.0;
	}
	
	setPosition(x, y, z) {
		this.position = [x, y, z, 1.0];
	}
	
	setColor(r, g, b) {
		this.color = [r / 255.0, g / 255.0, b / 255.0];
	}
	
	setIntensity(a) {
		this.intensity = Math.max(Math.min(a, 1.0), 0.0);
	}
	
	turnOn() {
		this.intensity = 1.0;
	}
	
	turnOff() {
		this.intensity = 0.0;
	}

	bind(shader) {
		var positionLoc = shader.getUniformLocation(this.name + 'Position');
		var colorLoc = shader.getUniformLocation(this.name + 'Color');
		var intensityLoc = shader.getUniformLocation(this.name + 'Intensity');
		gl.uniform3f(positionLoc, this.position[0], this.position[1], this.position[2]);
		gl.uniform3f(colorLoc, this.color[0], this.color[1], this.color[2]);
		gl.uniform1f(intensityLoc, this.intensity);
	}

	static bindAllLights(shader) {
		Object.keys(lights).forEach(function(i) {
			lights[i].bind(shader);
		});
	}
}

class AmbientLight extends Light {

	constructor(name, r, g, b, a) {
		super(name, 0.0 ,0.0 ,0.0, r, g, b);
		this.setIntensity(a);
	}

}

class DirectionalLight extends Light {

	constructor(name, dirx, diry, dirz, r, g, b) {
		super(name, 0.0 ,0.0 ,0.0, r, g, b);
		this.setDirection(dirx, diry, dirz);
	}

	setDirection(dirx, diry, dirz) {
		var length = Math.sqrt(dirx * dirx + diry * diry + dirz * dirz);
		this.direction = [dirx / length, diry / length, dirz / length];
	}

	bind(shader) {
		super.bind(shader);
		var directionLocation = shader.getUniformLocation(this.name + 'Direction');
		gl.uniform3f(directionLocation, this.direction[0], this.direction[1], this.direction[2]);   
	}

}

class PointLight extends Light {
	
	constructor(name, x, y, z, r, g, b, target, decay) {
		super(name, x, y, z, r, g, b);
		this.targetDistance = target;
		this.decayFactor = decay;
	}

	setDecayFactor(beta) {
		this.decayFactor = beta;
	}

	setTargetDistance(g) {
		this.targetDistance = g;
	}

	bind(shader) {
		super.bind(shader);
		var decayFactorLocation = shader.getUniformLocation(this.name + 'Decay');
		var targetDistanceLocation = shader.getUniformLocation(this.name + 'Target');
		gl.uniform1f(decayFactorLocation, this.decayFactor);
		gl.uniform1f(targetDistanceLocation, this.targetDistance);
	}

}