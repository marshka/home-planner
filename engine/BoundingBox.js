/// <reference path="../lib/utils.js" //>

class BoundingBox 
{
    constructor(minX, minY, minZ, maxX, maxY, maxZ)
    {
        this.meshCenter = [(minX + maxX)/2, (minY+maxY)/2,(minZ+maxZ)/2];
        this.position = [0, 0, 0];


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


    update(x, y, z, scaleX, scaleY, scaleZ) 
    {
        this.position = [x + this.meshCenter[0]*scaleX, 
                    y + this.meshCenter[1]*scaleY, 
                    z + this.meshCenter[2]*scaleZ];

        this.sx = this.dx * scaleX;
        this.sy = this.dy * scaleY;
        this.sz = this.dz * scaleZ;
    
        this.minX = this.position[0] - this.sx/2.0;
		this.minY = this.position[1] - this.sy/2.0;
		this.minZ = this.position[2] - this.sz/2.0;
		this.maxX = this.position[0] + this.sx/2.0;
		this.maxY = this.position[1] + this.sy/2.0;
		this.maxZ = this.position[2] + this.sz/2.0;
    }


    render()
    {
        if(this.enable)
        {
        var bBoxMatrix = utils.MakeWorld_(this.position[0], this.position[1], this.position[2],
            0, 0, 0, this.sx, this.sy, this.sz);

        this.mesh.renderLine(bBoxMatrix,this.shader);
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