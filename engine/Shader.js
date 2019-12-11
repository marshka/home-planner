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
			texsampler: gl.getUniformLocation(this.program, "u_texture"),
			matrix: {
				projection: gl.getUniformLocation(this.program, 'u_projectionMatrix'),
				worldView: gl.getUniformLocation(this.program, 'u_worldViewMatrix'),
				normal: gl.getUniformLocation(this.program, 'u_normalMatrix')
			}
		};

	    //enable and link shader attributes
	    gl.enableVertexAttribArray(this.location.position);
	    if(this.location.normal >= 0)
	    	gl.enableVertexAttribArray(this.location.normal);
	    if(this.location.texcoord >= 0)
	    	gl.enableVertexAttribArray(this.location.texcoord);

	}

	//activates this shader
	use()
	{
		gl.useProgram(this.program);
	}

	//getters for attributes locations
	getAttribLocation(locationName) { return gl.getAttribLocation(this.program, locationName); }
	getUniformLocation(locationName){ return gl.getUniformLocation(this.program, locationName); }

}

