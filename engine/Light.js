class Light {

	constructor(name, r, g, b) {
		this.name = name;
		this.color = {
			r: r / 255.0,
			g: g / 255.0,
			b: b / 255.0
		};
		this.intensity = 1.0;
	}
	
	setColor(r, g, b) {
		this.color = {
			r: r / 255.0,
			g: g / 255.0,
			b: b / 255.0
		};
		return this;
	}
	
	setIntensity(a) {
		this.intensity = Math.max(Math.min(parseFloat(a), 1.0), 0.0);
		return this;
	}
	
	turnOn() {
		this.intensity = 1.0;
	}
	
	turnOff() {
		this.intensity = 0.0;
	}

	bind(shader) {
		var colorLoc = shader.getUniformLocation(this.name + '.Color');
		var intensityLoc = shader.getUniformLocation(this.name + '.Intensity');
		gl.uniform3f(colorLoc, this.color.r, this.color.g, this.color.b);
		gl.uniform1f(intensityLoc, this.intensity);
	}

	static bindAllLights(shader) {
		Object.keys(lights).forEach(function(i) {
			lights[i].bind(shader);
		});
	}
}

class AmbientLight extends Light {

	constructor(name, r, g, b) {
		super(name, r, g, b);
	}

}

class DirectionalLight extends Light {

	constructor(name, r, g, b) {
		super(name, r, g, b);
	}

	setDirection(dirx, diry, dirz) {
		var length = Math.sqrt(dirx * dirx + diry * diry + dirz * dirz);
		this.direction = [dirx / length, diry / length, dirz / length];
		return this;
	}

	rotate(deg) {
		var rad = parseInt(deg)*Math.PI/180;
		this.setDirection(Math.cos(rad), 1.0, Math.sin(rad));
	}

	getXZAngleRad() {
		return Math.atan2(this.direction[2], this.direction[0]);
	}

	getXZAngleDegree() {
		return this.getXZAngleRad()*180/Math.PI;
	}

	bind(shader) {
		super.bind(shader);
		var directionLocation = shader.getUniformLocation(this.name + '.Direction');
		var tDirection = utils.multiplyMatrix3Vector3(utils.sub3x3from4x4((viewMatrix)), this.direction);
		gl.uniform3f(directionLocation, tDirection[0], tDirection[1], tDirection[2]);   
	}

}

class PointLight extends Light {
	
	constructor(name, r, g, b) {
		super(name, r, g, b);
	}
	
	setPosition(x, y, z) {
		this.position = [x, y, z, 1.0];
		return this;
	}

	setDecayFactor(beta) {
		this.decayFactor = beta;
		return this;
	}

	setTargetDistance(g) {
		this.targetDistance = g;
		return this;
	}

	move(x, y, z) {
		this.position[0] += x;
		this.position[1] += y;
		this.position[2] += z;
	}

	bind(shader) {
		super.bind(shader);
		var positionLoc = shader.getUniformLocation(this.name + '.Position');
		var decayFactorLocation = shader.getUniformLocation(this.name + '.Decay');
		var targetDistanceLocation = shader.getUniformLocation(this.name + '.Target');
		var tPosition = utils.multiplyMatrixVector(viewMatrix, this.position);
		gl.uniform3f(positionLoc, tPosition[0], tPosition[1], tPosition[2]);
		gl.uniform1f(decayFactorLocation, this.decayFactor);
		gl.uniform1f(targetDistanceLocation, this.targetDistance);
	}

}

class SpotLight extends PointLight {
	
	constructor(name, r, g, b) {
		super(name, r, g, b);
	}

	setDirection(dirx, diry, dirz) {
		var length = Math.sqrt(dirx * dirx + diry * diry + dirz * dirz);
		this.direction = [dirx / length, diry / length, dirz / length];
		return this;
	}

	setConeIn(alfa) {
		this.coneIn = alfa;
		return this;
	}

	setConeOut(alfa) {
		this.coneOut = alfa;
		return this;
	}

	bind(shader) {
		super.bind(shader);
		var directionLocation = shader.getUniformLocation(this.name + '.Direction');
		var coneInLocation = shader.getUniformLocation(this.name + '.ConeIn');
		var coneOutLocation = shader.getUniformLocation(this.name + '.ConeOut');
		var tDirection = utils.multiplyMatrix3Vector3(utils.sub3x3from4x4((viewMatrix)), this.direction);
		gl.uniform3f(directionLocation, tDirection[0], tDirection[1], tDirection[2]);
		gl.uniform1f(coneInLocation, this.coneIn);
		gl.uniform1f(coneOutLocation, this.coneOut);
	}

}