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

	    //enable and link shader attributes
	    gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "inPosition"));

	    gl.enableVertexAttribArray(gl.getAttribLocation(this.program, "inNormal"));

	    var uvsLoc = gl.getAttribLocation(this.program, "inUV");
	    if (uvsLoc != -1) {
	    	gl.enableVertexAttribArray(uvsLoc);
	    	this.textureLoc = gl.getUniformLocation(this.program, "uTexture");
	    }		

	}

	//activates this shader
	use()
	{
		gl.useProgram(this.program);
	}

	//getters for attributes locations
	getPositionsLocation()		{ return gl.getAttribLocation(this.program, "inPosition"); }
	getNormalsLocation()		{ return gl.getAttribLocation(this.program, "inNormal"); }
	getUVsLocation()			{ return gl.getAttribLocation(this.program, "inUV"); }
	getMatrixLocation()			{ return gl.getUniformLocation(this.program, "worldProjectionMatrix"); }
	getWorldViewMatrixLocation(){ return gl.getUniformLocation(this.program, "worldViewMatrix"); }
	getNormalMatrixLocation()	{ return gl.getUniformLocation(this.program, "nMatrix"); }
	getTextureLocation()		{ return gl.getUniformLocation(this.program, "uTexture"); }
	getUniformLocation(locationName) { return gl.getUniformLocation(this.program, locationName); }

}

