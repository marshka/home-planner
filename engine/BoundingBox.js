/// <reference path="../lib/utils.js" //>

class BoundingBox 
{
    constructor(minX, minY, minZ, maxX, maxY, maxZ)
    {
        this.meshCenter = [(minX + maxX)/2, (minY+maxY)/2,(minZ+maxZ)/2];
        this.position = [0, 0, 0];

        //original dimensions of the mash:
        this.dx = (maxX - minX);
        this.dy = (maxY - minY);
        this.dz = (maxZ - minZ);

        //dimension scaled
        this.sx = this.dx;
        this.sy = this.dy;
        this.sz = this.dz;
                
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
    
    }


    render()
    {
        var bBoxMatrix = utils.MakeWorld_(this.position[0], this.position[1], this.position[2],
            0, 0, 0, this.sx, this.sy, this.sz);

        this.mesh.renderLine(bBoxMatrix,this.shader);

    }



}