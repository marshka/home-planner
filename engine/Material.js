var isTextureLoaded = [];

class Material {

	constructor(r, g, b, a) {
		this.diffuseColor = [r / 255.0, g / 255.0, b / 255.0, a];
		this.emissionColor = [0.0, 0.0, 0.0, 1.0];
		this.shader = shaders.lambert;
	}

	setDiffuseColor(r, g, b, a) {
		this.diffuseColor = [r / 255.0, g / 255.0, b / 255.0, a];
	}

	setEmissionColor(r, g, b, a) {
		this.emissionColor = [r / 255.0, g / 255.0, b / 255.0, a];
	}

	setShader(shader) {
		this.shader = shader;
	}

	isLoaded() {
		return true;
	}

	bindShader() {
		this.shader.use();
		Light.bindAllLights(this.shader);
		var diffuseColorLocation = this.shader.getUniformLocation("mDiffuseColor");
		var emissionColorLocation = this.shader.getUniformLocation("mEmissionColor");
		gl.uniform4f(diffuseColorLocation, this.diffuseColor[0], this.diffuseColor[1], this.diffuseColor[2], this.diffuseColor[3]);
		gl.uniform4f(emissionColorLocation, this.emissionColor[0], this.emissionColor[1], this.emissionColor[2], this.emissionColor[3]);
	}

}

class SpecularMaterial extends Material {

	constructor(r, g, b, a) {
		super(r, g, b, a);
		this.setSpecularColor(255, 255, 255, 1).setSpecularShine(100);
		this.shader = shaders.phong;
	}

	setSpecularColor(r, g, b, a) {
		this.specularColor = [r / 255.0, g / 255.0, b / 255.0, a];
		return this;
	}

	setSpecularShine(gamma) {
		this.gamma = gamma;
		return this;
	}

	bindShader() {
		super.bindShader();
		var specularColorLocation = this.shader.getUniformLocation("mSpecularColor");
		var specularShineLocation = this.shader.getUniformLocation("mSpecularShine");
		gl.uniform4f(specularColorLocation, this.specularColor[0], this.specularColor[1], this.specularColor[2], this.specularColor[3]);
		gl.uniform1f(specularShineLocation, this.gamma);
	}

}

class TextureMaterial extends SpecularMaterial {

	constructor(textureFile) {
		super(0, 0, 0, 1);
		this.setSpecularColor(0, 0, 0, 0);
		this.shader  = shaders.texture;

		this.image = new Image();
		this.image.txNum = isTextureLoaded.length;
		isTextureLoaded.push(false);
		this.powerOf2 = false;
		this.image.src = textures_dir + textureFile;
		this.image.onload = textureLoaderCallback;
	}

	isLoaded()
	{
		return isTextureLoaded[this.image.txNum];
	}

	setRepeat(boolean) {
		if(boolean) {
			this.wrap = gl.REPEAT;
		}
		else {
			this.wrap = gl.CLAMP_TO_EDGE;
		}
	}

	bindShader() {	
		super.bindShader();
		gl.uniform1i(this.shader.location.texsampler, this.image.txNum);
	}

}

function textureLoaderCallback () {
	this.txId = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + this.txNum);
	gl.bindTexture(gl.TEXTURE_2D, this.txId);		
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	isTextureLoaded[this.txNum] = true;
}