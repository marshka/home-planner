class Shader
{
	static loadFromFiles(vsFilename, fsFilename) {

		var shaderText;

		utils.loadFiles([shaders_dir + vsFilename + '.glsl', shaders_dir + fsFilename + '.glsl'], 
			function (data) 
			{
				shaderText = data;
			});

		return new Shader(shaderText);

	}

	//creates a shader from .vs and .fs files
	constructor(data)
	{
		this.program = utils.createAndCompileShaders(gl, data);
		this.location = {
			position: gl.getAttribLocation(this.program, 'in_position'),
			normal: gl.getAttribLocation(this.program, "in_normal"),
			matrix: {
				projection: gl.getUniformLocation(this.program, 'u_projectionMatrix'),
				worldView: gl.getUniformLocation(this.program, 'u_worldViewMatrix'),
				normal: gl.getUniformLocation(this.program, 'u_normalMatrix')
			},
		};
	    //enable and link shader attributes
	    gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "in_position"));

	}

	//activates this shader
	use()
	{
		gl.useProgram(this.program);
	}

	//getters for attributes locations
	getPositionsLocation()			{ return gl.getAttribLocation(this.program, "in_position"); }
	getNormalsLocation()			{ return gl.getAttribLocation(this.program, "in_normal"); }
	getAttribLocation(locationName) { return gl.getAttribLocation(this.program, locationName); }

	getMatrixLocation()				{ return gl.getUniformLocation(this.program, "u_matrix"); }
	getWorldViewMatrixLocation()	{ return gl.getUniformLocation(this.program, "worldViewMatrix"); }
	getNormalMatrixLocation()		{ return gl.getUniformLocation(this.program, "nMatrix"); }
	getTextureLocation()			{ return gl.getUniformLocation(this.program, "uTexture"); }
	getUniformLocation(locationName){ return gl.getUniformLocation(this.program, locationName); }

	getColorLocation()				{ return gl.getUniformLocation(this.program, "color"); }
	getMainLightDirectionLocation()	{ return gl.getUniformLocation(this.program, "mainLightDirection"); }

}

