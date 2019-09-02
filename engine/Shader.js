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
			texcoord: gl.getAttribLocation(this.program, "in_texcoord"),
			matrix: {
				projection: gl.getUniformLocation(this.program, 'u_projectionMatrix'),
				viewModel: gl.getUniformLocation(this.program, 'u_viewModelMatrix'),
				normal: gl.getUniformLocation(this.program, 'u_normalMatrix')
			},
			light: {
				ambient: gl.getUniformLocation(this.program, 'ambientIntensity')
			}
		};
	    //enable and link shader attributes
	    gl.enableVertexAttribArray(this.location.position);
	    gl.enableVertexAttribArray(this.location.normal);
	    gl.enableVertexAttribArray(this.location.texcoord);

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

}

