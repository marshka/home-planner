//Utils ver. 0.4
//Includes minimal mat3 support
//Includes texture operations
//Includes initInteraction() function

var utils={

createAndCompileShaders:function(gl, shaderText) {
  
  var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
  var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

  var program = utils.createProgram(gl, vertexShader, fragmentShader);

  return program;
},

createShader:function(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {    
    return shader;
  }else{
    console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
    if(type == gl.VERTEX_SHADER){
    	alert("ERROR IN VERTEX SHADER : " + gl.getShaderInfoLog(vertexShader));
    }
    if(type == gl.FRAGMENT_SHADER){
    	alert("ERROR IN FRAGMENT SHADER : " + gl.getShaderInfoLog(vertexShader));
    }
    gl.deleteShader(shader);
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

},

createProgram:function(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }else{
     throw ("program filed to link:" + gl.getProgramInfoLog (program));
    console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
    gl.deleteProgram(program);
    return undefined;
  }
},

 resizeCanvasToDisplaySize:function(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width  = canvas.clientWidth  * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width ||  canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;
    return true;
  }
  return false;
},
//**** MODEL UTILS
	// Function to load a 3D model in JSON format
	get_json: function(url, func) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, false); // if true == asynchronous...
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status==200) {
				//the file is loaded. Parse it as JSON and launch function
				func(JSON.parse(xmlHttp.responseText));
			}
		};
		//send the request
		xmlHttp.send();
	},
	
	//function to convert decimal value of colors 
	decimalToHex: function(d, padding) {
		var hex = Number(d).toString(16);
		padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

		while (hex.length < padding) {
			hex = "0" + hex;
		}

		return hex;
	},
	
	
	
	
	
	
//*** SHADERS UTILS	
	/*Function to load a shader's code, compile it and return the handle to it
	Requires:
		path to the shader's text (url)

	*/

	loadFile: function (url, data, callback, errorCallback) {
		// Set up an synchronous request! Important!
		var request = new XMLHttpRequest();
		request.open('GET', url, false);

		// Hook the event that gets called as the request progresses
		request.onreadystatechange = function () {
			// If the request is "DONE" (completed or failed) and if we got HTTP status 200 (OK)
			
				
			if (request.readyState == 4 && request.status == 200) {
					callback(request.responseText, data)
				//} else { // Failed
				//	errorCallback(url);
			}
			
		};

		request.send(null);    
	},

	loadFiles: function (urls, callback, errorCallback) {
    var numUrls = urls.length;
    var numComplete = 0;
    var result = [];

		// Callback for a single file
		function partialCallback(text, urlIndex) {
			result[urlIndex] = text;
			numComplete++;

			// When all files have downloaded
			if (numComplete == numUrls) {
				callback(result);
			}
		}

		for (var i = 0; i < numUrls; i++) {
			this.loadFile(urls[i], i, partialCallback, errorCallback);
		}
	},

	// loadFiles: function (urls, gl, callback, errorCallback) {
 //    var numUrls = urls.length;
 //    var numComplete = 0;
 //    var result = [];

	// 	// Callback for a single file
	// 	function partialCallback(text, urlIndex) {
	// 		result[urlIndex] = text;
	// 		numComplete++;

	// 		// When all files have downloaded
	// 		if (numComplete == numUrls) {
	// 			callback(gl,result);
	// 		}
	// 	}

	// 	for (var i = 0; i < numUrls; i++) {
	// 		this.loadFile(urls[i], i, partialCallback, errorCallback);
	// 	}
	// },
	
// *** TEXTURE UTILS (to solve problems with non power of 2 textures in webGL

	getTexture: function(context, image_URL){

		var image=new Image();
		image.webglTexture=false;
		image.isLoaded=false;

		image.onload=function(e) {

			var texture=context.createTexture();
			
			context.bindTexture(context.TEXTURE_2D, texture);
			
			context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
			//context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 1);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE); 
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST_MIPMAP_LINEAR);
			context.generateMipmap(context.TEXTURE_2D);
			
			context.bindTexture(context.TEXTURE_2D, null);
			image.webglTexture=texture;
			image.isLoaded=true;
		};
		
		image.src=image_URL;

	return image;
	},



	isPowerOfTwo: function(x) {
		return (x & (x - 1)) == 0;
	},

	nextHighestPowerOfTwo:function(x) {
		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	},
		
	
//*** Interaction UTILS	
	initInteraction: function(){
		var keyFunction =function(e) {
			
			if (e.keyCode == 37) {	// Left arrow
				cx-=delta;
			}
			if (e.keyCode == 39) {	// Right arrow
				cx+=delta;
			}	
			if (e.keyCode == 38) {	// Up arrow
				cz-=delta;
			}
			if (e.keyCode == 40) {	// Down arrow
				cz+=delta;
			}
			if (e.keyCode == 107) {	// Add
				cy+=delta;
			}
			if (e.keyCode == 109) {	// Subtract
				cy-=delta;
			}
			
			if (e.keyCode == 65) {	// a
				angle-=delta*10.0;
			}
			if (e.keyCode == 68) {	// d
				angle+=delta*10.0;
			}	
			if (e.keyCode == 87) {	// w
				elevation+=delta*10.0;
			}
			if (e.keyCode == 83) {	// s
				elevation-=delta*10.0;
			}
			
		}
		//'window' is a JavaScript object (if "canvas", it will not work)
		window.addEventListener("keyup", keyFunction, false);		
	},
	
	
	
	
	
//*** MATH LIBRARY

	degToRad: function(angle){
		return(angle*Math.PI/180);
	},

	radToDeg: function(angle){
		return(angle*180/Math.PI);
	},

	identityMatrix: function() {
		return [1,0,0,0,
				0,1,0,0,
				0,0,1,0,
				0,0,0,1];
	},

	identityMatrix3: function() {
		return [1,0,0,
				0,1,0,
				0,0,1];
	},

	// returns the 3x3 submatrix from a Matrix4x4
	sub3x3from4x4: function(m){
		out = [];
		out[0] = m[0]; out[1] = m[1]; out[2] = m[2];
		out[3] = m[4]; out[4] = m[5]; out[5] = m[6];
		out[6] = m[8]; out[7] = m[9]; out[8] = m[10];
		return out;
	},

	// Multiply the mat3 with a vec3.
	multiplyMatrix3Vector3: function(m, a) {
	
		out = [];
		var x = a[0], y = a[1], z = a[2];
		out[0] = x * m[0] + y * m[1] + z * m[2];
		out[1] = x * m[3] + y * m[4] + z * m[5];
		out[2] = x * m[6] + y * m[7] + z * m[8];
		return out;
	},
	
//Transpose the values of a mat3

	transposeMatrix3 : function(a) {

		out = [];
		
		out[0] = a[0];
		out[1] = a[3];
		out[2] = a[6];
		out[3] = a[1];
		out[4] = a[4];
		out[5] = a[7];
		out[6] = a[2];
		out[7] = a[5];
		out[8] = a[8];
	 
		
		return out;
	},
	
	invertMatrix3: function(m){
		out = [];
		
		var a00 = m[0], a01 = m[1], a02 = m[2],
			a10 = m[3], a11 = m[4], a12 = m[5],
			a20 = m[6], a21 = m[7], a22 = m[8],

			b01 = a22 * a11 - a12 * a21,
			b11 = -a22 * a10 + a12 * a20,
			b21 = a21 * a10 - a11 * a20,

			// Calculate the determinant
			det = a00 * b01 + a01 * b11 + a02 * b21;

		if (!det) { 
			return null; 
		}
		det = 1.0 / det;

		out[0] = b01 * det;
		out[1] = (-a22 * a01 + a02 * a21) * det;
		out[2] = (a12 * a01 - a02 * a11) * det;
		out[3] = b11 * det;
		out[4] = (a22 * a00 - a02 * a20) * det;
		out[5] = (-a12 * a00 + a02 * a10) * det;
		out[6] = b21 * det;
		out[7] = (-a21 * a00 + a01 * a20) * det;
		out[8] = (a11 * a00 - a01 * a10) * det;		
		
		return out;
	},
	
	//requires as a parameter a 4x4 matrix (array of 16 values)
	invertMatrix: function(m){ 
       
		var out = [];
		var inv = [];
		var det, i;

		inv[0] = m[5]  * m[10] * m[15] - m[5]  * m[11] * m[14] - m[9]  * m[6]  * m[15] + 
				 m[9]  * m[7]  * m[14] + m[13] * m[6]  * m[11] - m[13] * m[7]  * m[10];

		inv[4] = -m[4]  * m[10] * m[15] + m[4]  * m[11] * m[14] + m[8]  * m[6]  * m[15] - 
				  m[8]  * m[7]  * m[14] - m[12] * m[6]  * m[11] + m[12] * m[7]  * m[10];

		inv[8] = m[4]  * m[9] * m[15] - m[4]  * m[11] * m[13] - m[8]  * m[5] * m[15] + 
				 m[8]  * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];

		inv[12] = -m[4]  * m[9] * m[14] + m[4]  * m[10] * m[13] + m[8]  * m[5] * m[14] - 
				   m[8]  * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];

		inv[1] = -m[1]  * m[10] * m[15] + m[1]  * m[11] * m[14] + m[9]  * m[2] * m[15] - 
				  m[9]  * m[3] * m[14] - m[13] * m[2] * m[11] +  m[13] * m[3] * m[10];

		inv[5] = m[0]  * m[10] * m[15] - m[0]  * m[11] * m[14] - m[8]  * m[2] * m[15] + 
				 m[8]  * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];

		inv[9] = -m[0]  * m[9] * m[15] + m[0]  * m[11] * m[13] + m[8]  * m[1] * m[15] - 
				  m[8]  * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];

		inv[13] = m[0]  * m[9] * m[14] - m[0]  * m[10] * m[13] - m[8]  * m[1] * m[14] + 
				  m[8]  * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];

		inv[2] = m[1]  * m[6] * m[15] - m[1]  * m[7] * m[14] - m[5]  * m[2] * m[15] + 
				 m[5]  * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];

		inv[6] = -m[0]  * m[6] * m[15] + m[0]  * m[7] * m[14] + m[4]  * m[2] * m[15] - 
				  m[4]  * m[3] * m[14] - m[12] * m[2] * m[7] +  m[12] * m[3] * m[6];

		inv[10] = m[0]  * m[5] * m[15] - m[0]  * m[7] * m[13] - m[4]  * m[1] * m[15] + 
				  m[4]  * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];

		inv[14] = -m[0]  * m[5] * m[14] + m[0]  * m[6] * m[13] + m[4]  * m[1] * m[14] - 
				   m[4]  * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];

		inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - 
				  m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];

		inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + 
				 m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];

		inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - 
				   m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];

		inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + 
				  m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

		det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

		if (det == 0)
			return out = this.identityMatrix();

		det = 1.0 / det;

		for (i = 0; i < 16; i++){
			out[i] = inv[i] * det;
		}
		
		return out;
	},
	
	transposeMatrix: function(m){
		var out = []; 
		
		var row, column, row_offset;
		
		row_offset=0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;
			for (column = 0; column < 4; ++column){
				out[row_offset + column] = m[row + column * 4];
			  }    
		}
		return out;        
	},
	
	multiplyMatrices: function(m1, m2){
	// Perform matrix product  { out = m1 * m2;}
		var out = [];  
		
		var row, column, row_offset;
		
		row_offset=0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;
			for (column = 0; column < 4; ++column){
				out[row_offset + column] =
					(m1[row_offset + 0] * m2[column + 0]) +
					(m1[row_offset + 1] * m2[column + 4]) +
					(m1[row_offset + 2] * m2[column + 8]) +
					(m1[row_offset + 3] * m2[column + 12]);
			  }    
		}
		return out; 
	},	

	multiplyMatrixVector: function(m, v){
       /* Mutiplies a matrix [m] by a vector [v] */
       
		var out = [];  
		
		var row, row_offset;
		
		row_offset=0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;

			out[row] =
				(m[row_offset + 0] * v[0]) +
				(m[row_offset + 1] * v[1]) +
				(m[row_offset + 2] * v[2]) +
				(m[row_offset + 3] * v[3]);
				 
		}
		return out;        
	},
	
	
	
	
	
	
	
	
//*** MODEL MATRIX OPERATIONS


	MakeTranslateMatrix: function(dx, dy, dz) {
	// Create a transform matrix for a translation of ({dx}, {dy}, {dz}).

		var out = this.identityMatrix();

		out[3]  = dx;
		out[7]  = dy;
		out[11] = dz;
		return out; 
	},

	
	MakeRotateXMatrix: function(a) {
	// Create a transform matrix for a rotation of {a} along the X axis.

		var out = this.identityMatrix();

		var adeg = this.degToRad(a);
		var c = Math.cos(adeg);
		var s = Math.sin(adeg);

		out[5] = out[10] = c;
		out[6] = -s;
		out[9] = s;

		return out; 
	},

	MakeRotateYMatrix: function(a) {
	// Create a transform matrix for a rotation of {a} along the Y axis.

		var out = this.identityMatrix();

		var adeg = this.degToRad(a);
		
		var c = Math.cos(adeg);
		var s = Math.sin(adeg);

		out[0] = out[10] = c;
		out[2] = -s;
		out[8] = s;

		return out; 
	},

	MakeRotateZMatrix: function(a) {                                            
	// Create a transform matrix for a rotation of {a} along the Z axis.

		var out = this.identityMatrix();

		var adeg = this.degToRad(a);
		var c = Math.cos(adeg);
		var s = Math.sin(adeg);

		out[0] = out[5] = c;
		out[4] = -s;
		out[1] = s;

		return out; 
	},

	MakeRotateXYZMatrix: function(rx, ry, rz, s){
		//Creates a world matrix for an object.
	
			var Rx = this.MakeRotateXMatrix(ry);                
			var Ry = this.MakeRotateYMatrix(rx);
			var Rz = this.MakeRotateZMatrix(rz);
			
			out = this.multiplyMatrices(Ry, Rz);
			out = this.multiplyMatrices(Rx, out);
	
			return out;
		},

	MakeScaleMatrix: function(s) {
	// Create a transform matrix for proportional scale

		var out = this.identityMatrix();                                               

		out[0] = out[5] = out[10] = s;

		return out; 
	},

	//added func for non-proportional scaling
	MakeScaleMatrix_: function(sx, sy, sz) {
	// Create a transform matrix for proportional scale

		var out = this.identityMatrix();                                               

		out[0] = sx;
		out[5] = sy;
		out[10] = sz;

		return out; 
	},


//***Projection Matrix operations
	MakeWorld: function(tx, ty, tz, rx, ry, rz, s){
	//Creates a world matrix for an object.

		var Rx = this.MakeRotateXMatrix(rx);                
		var Ry = this.MakeRotateYMatrix(ry);
		var Rz = this.MakeRotateZMatrix(rz);  
		var S  = this.MakeScaleMatrix(s);
		var T =  this.MakeTranslateMatrix(tx, ty, tz);         
		   
		out = this.multiplyMatrices(Rz, S);
		out = this.multiplyMatrices(Ry, out);
		out = this.multiplyMatrices(Rx, out);  
		out = this.multiplyMatrices(T, out);

		return out;
	},

	//added func with non-proportional scaling
	MakeWorld_: function(tx, ty, tz, rx, ry, rz, sx, sy, sz){
	//Creates a world matrix for an object.

		var Rx = this.MakeRotateXMatrix(rx);                
		var Ry = this.MakeRotateYMatrix(ry);
		var Rz = this.MakeRotateZMatrix(rz);  
		var S  = this.MakeScaleMatrix_(sx, sy, sz);
		var T =  this.MakeTranslateMatrix(tx, ty, tz);         
		   
		out = this.multiplyMatrices(Rz, S);
		out = this.multiplyMatrices(Rx, out);  
		out = this.multiplyMatrices(Ry, out);
		out = this.multiplyMatrices(T, out);

		return out;
	},

	MakeView: function(cx, cy, cz, elev, ang) {
	// Creates in {out} a view matrix. The camera is centerd in ({cx}, {cy}, {cz}).
	// It looks {ang} degrees on y axis, and {elev} degrees on the x axis.
		
		var T = [];
		var Rx = [];
		var Ry = [];
		var tmp = [];
		var out = [];

		T =  this.MakeTranslateMatrix(-cx, -cy, -cz);
		Rx = this.MakeRotateXMatrix(-elev);
		Ry = this.MakeRotateYMatrix(-ang);

		tmp = this.multiplyMatrices(Ry, T);
		out = this.multiplyMatrices(Rx, tmp);

		return out;
	},

	MakePerspective:function(fovy, a, n, f) {
	// Creates the perspective projection matrix. The matrix is returned.
	// {fovy} contains the vertical field-of-view in degrees. {a} is the aspect ratio.
	// {n} is the distance of the near plane, and {f} is the far plane.

		var perspective = this.identityMatrix();

		var halfFovyRad = this.degToRad(fovy/2);	// stores {fovy/2} in radiants
		var ct = 1.0 / Math.tan(halfFovyRad);			// cotangent of {fov/2}

		perspective[0] = ct / a;
		perspective[5] = ct;
		perspective[10] = (f + n) / (n - f);
		perspective[11] = 2.0 * f * n / (n - f);
		perspective[14] = -1.0;
		perspective[15] = 0.0;	

		return perspective;
	},

    // normalize a given vector of 3 elements
    normalize:function (v) {
      var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      // make sure we don't divide by 0.
      if (length > 0.00001) {
        return [v[0] / length, v[1] / length, v[2] / length];
      } else {
        return [0, 0, 0];
      }
    },

    eulerFromQuaternion:function(q) {
    	var components = q.toVector();
    	var a = components[0];
    	var b = components[1];
    	var c = components[2];
    	var d = components[2];
    	var rotx, roty, rotz;
    	var rotationMatrix = [
    		1 - 2 * c * c - 2 * d * d, 2  * b * c + 2 * a * d, 2 * b * d - 2 * a *c,
    		2 * b * c - 2* a * d, 1  -2 * b * b - 2 * d * d, 2 * c + d + 2 * a * b,
    		2 * b* d + 2* a * c, 2* c *d  - 2 * a * b, 1 - 2 * b * b - 2 * c * c
    	];
    	if (rotationMatrix[6] == 1) {
    		rotz = 0;
    		roty = -Math.PI / 2;
    		rotx = Math.atan( -rotationMatrix[1], -rotationMatrix[2] );
    	} else if (rotationMatrix[6] != -1) {
    		rotz = 0;
    		roty = Math.PI / 2;
    		rotx = Math.atan( rotationMatrix[1], rotationMatrix[2] );
    	} else {
    		roty = Math.asin(rotationMatrix[6]);
    		rotx = Math.atan2(rotationMatrix[7]/Math.cos(roty), rotationMatrix[8]/Math.cos(roty));
    		rotz = Math.atan2(rotationMatrix[3]/Math.cos(roty), rotationMatrix[0]/Math.cos(roty));
    	}
    	return [rotx, roty, rotz];
    }


}
