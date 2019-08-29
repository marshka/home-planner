class Mesh
{
	//factory for creating mesh from .obj file
	static loadFromOBJFile(filename)
	{
		var modelObj;

		//load model
		utils.loadFile(models_dir + filename + '.obj', 0, 
			function (data) 
			{
				modelObj = new OBJ.Mesh(data);
				OBJ.initMeshBuffers(gl, modelObj);
			});		

		return new Mesh(modelObj.vertices, modelObj.vertexBuffer,
			modelObj.normalBuffer,
			modelObj.textureBuffer,
			modelObj.indexBuffer);
	}

	//creates a mesh  
	constructor(positions, positionBuffer, normalBuffer, textCoordBuffer, indexBuffer)
	{
		this.positions = positions;
		this.positionBuffer = positionBuffer;
		this.normalBuffer = normalBuffer;
		this.textCoordBuffer = textCoordBuffer;
		this.indexBuffer = indexBuffer;
	}

	//draws the mesh
	render(worldMatrix, shader)
	{
		shader.use();

		var matrix =  utils.multiplyMatrices(projectionMatrix, worldMatrix); // world matrix
		gl.uniformMatrix4fv(shader.location.matrix.projection, gl.FALSE, utils.transposeMatrix(matrix));

	    var WVMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix); // world view matrix 		
	    var nMatrix = utils.invertMatrix(utils.transposeMatrix(WVMatrix));
	    gl.uniformMatrix4fv(shader.location.matrix.worldView, gl.FALSE, utils.transposeMatrix(WVMatrix));
	    gl.uniformMatrix4fv(shader.location.matrix.normal, gl.FALSE, utils.transposeMatrix(nMatrix));

		//positions
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.vertexAttribPointer(shader.location.position, this.positionBuffer.itemSize, gl.FLOAT, false, 0, 0);	    

		//normals
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.vertexAttribPointer(shader.location.normal, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		//rendering
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	}
}
