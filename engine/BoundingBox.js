/// <reference path="../lib/utils.js" //>

class BoundingBox 
{
    constructor(minX, minY, minZ, maxX, maxY, maxZ)
    {
        this.meshCenter = [(minX + maxX)/2, (minY+maxY)/2,(minZ+maxZ)/2];
        this.position = [0, 0, 0];

        this.rotY = 0.0;
        // Color box for collision

        this.COLLIDER_COLOR = {
            R: 1.0,
            G: 0.0,
            B: 0.0,
            A: 1.0
        }

        this.NON_COLLIDER_COLOR = {
            R: 0.0,
            G: 1.0,
            B: 0.0,
            A: 1.0
        }
        this.color = this.NON_COLLIDER_COLOR;

        //bounding coordinates
		this.minX = minX || 0.0;	
		this.minY = minY || 0.0;
		this.minZ = minZ || 0.0;
		this.maxX = maxX || 0.0;
		this.maxY = maxY || 0.0;
		this.maxZ = maxZ || 0.0;

        //original dimensions of the mash:
        this.dx = (maxX - minX);
        this.dy = (maxY - minY);
        this.dz = (maxZ - minZ);

        //dimension scaled
        this.sx = this.dx;
        this.sy = this.dy;
        this.sz = this.dz;

        this.enable = false;
                
        this.mesh = Mesh.loadFromOBJFile('boundingBox');
        this.shader = Shader.loadFromFiles('vs','fs_bbox');
                
    }

    setColor(red, green, blue, alpha)
    {
        this.color = [red/255.0, green/250.0, blue/255,0, alpha/255.0];
    }

    setColliderColor()
    {
        this.color = this.COLLIDER_COLOR;
    }

    setNonColliderColor()
    {
        this.color = this.NON_COLLIDER_COLOR;
    }

    update(x, y, z, scaleX, scaleY, scaleZ, rotY) 
    {
        this.position = [x + this.meshCenter[0]*scaleX, 
                    y + this.meshCenter[1]*scaleY, 
                    z + this.meshCenter[2]*scaleZ];

        this.sx = this.dx * scaleX;
        this.sy = this.dy * scaleY;
        this.sz = this.dz * scaleZ;

        this.rotY += rotY;
        
        this.minX = this.position[0] - this.sx/2.0;
		this.minY = this.position[1] - this.sy/2.0;
        this.minZ = this.position[2] - this.sz/2.0;
		this.maxX = this.position[0] + this.sx/2.0;
		this.maxY = this.position[1] + this.sy/2.0;
        this.maxZ = this.position[2] + this.sz/2.0;
        
        this.rotate_vertices(this.rotY);
    }


    rotate_vertices(rotY){
        var rotation_matrix = utils.MakeRotateYMatrix(rotY);

        var c1 = [this.minX, this.maxY, this.minZ, 1.0];
        var c2 = [this.maxX, this.maxY, this.minZ, 1.0];
        var c3 = [this.minX, this.maxY, this.maxZ, 1.0];
        var c4 = [this.maxX, this.maxY, this.maxZ, 1.0];

        c1 = utils.multiplyMatrixVector(rotation_matrix, c1);
        c2 = utils.multiplyMatrixVector(rotation_matrix, c2);
        c3 = utils.multiplyMatrixVector(rotation_matrix, c3);
        c4 = utils.multiplyMatrixVector(rotation_matrix, c4);

        var minX = Math.min(c1[0], c2[0], c3[0], c4[0]);
        var maxX = Math.max(c1[0], c2[0], c3[0], c4[0]);
        var minZ = Math.min(c1[2], c2[2], c3[2], c4[2]);
        var maxZ = Math.max(c1[2], c2[2], c3[2], c4[2]);

        var aDim_x = this.maxX - this.minX;
        var aDim_z = this.maxZ - this.minZ;

        var scaleX = (maxX - minX)/aDim_x;
        var scaleZ = (maxZ - minZ)/aDim_z;

        this.sx = this.dx * scaleX;
        this.sz = this.dz * scaleZ;

        this.minX = this.position[0] - this.sx/2.0;
        this.minZ = this.position[2] - this.sz/2.0;
		this.maxX = this.position[0] + this.sx/2.0;
        this.maxZ = this.position[2] + this.sz/2.0;
    }

    // Used only for the groupObject class
    update_(minX, minY, minZ, maxX, maxY, maxZ)
    {
        this.meshCenter = [(minX + maxX)/2, (minY+maxY)/2,(minZ+maxZ)/2];
        this.position = [this.meshCenter[0], this.meshCenter[1], this.meshCenter[2]];
        this.minX = minX;	
		this.minY = minY;
		this.minZ = minZ;
		this.maxX = maxX;
		this.maxY = maxY;
        this.maxZ = maxZ;
        
        this.dx = (maxX - minX);
        this.dy = (maxY - minY);
        this.dz = (maxZ - minZ);

        this.sx = this.dx;
        this.sy = this.dy;
        this.sz = this.dz;
    }


    render()
    {
        if(this.enable)
        {
        //Set color into shader
        var bBoxMatrix = utils.MakeWorld_(this.position[0], this.position[1], this.position[2],
            0.0, 0.0, 0.0, this.sx, this.sy, this.sz);
        
        //this.recomputeVertices(bBoxMatrix);

        this.mesh.renderLine(bBoxMatrix,this.shader);
        

        //Set color for the shader
        var colorLocation = this.shader.getUniformLocation("mColor");
        gl.uniform4f(colorLocation,this.color.R, this.color.G, this.color.B, this.color.A);

        }
    }

    // Return a boolean value if an object hits another object.
    checkCollision(bBox)
	{
        return 	(this.minX <= bBox.maxX && this.maxX >= bBox.minX) &&
         		(this.minY <= bBox.maxY && this.maxY >= bBox.minY) &&
         		(this.minZ <= bBox.maxZ && this.maxZ >= bBox.minZ);
    }
    
    // Return a boolean value if an object hits the walls
    checkRoomCollision(roombBox)
    {
        return (this.minX < roombBox.minX) ||
                (this.maxX > roombBox.maxX) ||
                (this.minY < roombBox.minY) ||
                (this.maxY > roombBox.maxY) ||
                (this.minZ < roombBox.minZ) ||
                (this.maxZ > roombBox.maxZ);
    }
    
}