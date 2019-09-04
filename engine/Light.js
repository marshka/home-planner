class Light {

	constructor(name, x, y, z) {
		this.name = name;
		this.position = [x, y, z, 1.0];
		this.rotation = utils.MakeRotateXMatrix(0);
		this.intensity = 1.0;
	}
	
	setPosition(x, y, z) {
		this.position = [x, y, z, 1.0];
	}
}