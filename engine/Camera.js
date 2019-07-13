/// <reference path="../lib/utils.js" //>

class LookAtCamera
{
    constructor()
    {
        this.angle  = 0.0;
        this.elevation = 1.0;
        this.up = [0, 1, 0];

        this.radius = 4.0;

        this.cameraPosition = [0.0, 0.0, 0.0];

        this.xLook = 0.0;
        this.yLook = 0.0;
        this.zLook = 0.0;
    }

    cross(a, b) {
        return [a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0]];
    }

    subtractVectors(a, b) {
       return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    normalize(v) {
        var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
          return [v[0] / length, v[1] / length, v[2] / length];
        } else {
          return [0, 0, 0];
        }
    }


    //it returns the CameraMatrix
    lookAt(target) {
        var zAxis = this.normalize(this.subtractVectors(this.cameraPosition, target));
        var xAxis = this.normalize(this.cross(this.up, zAxis));
        var yAxis = this.normalize(this.cross(zAxis, xAxis));
    
        return [
        xAxis[0], xAxis[1], xAxis[2], this.cameraPosition[0],
        yAxis[0], yAxis[1], yAxis[2], this.cameraPosition[1],
        zAxis[0], zAxis[1], zAxis[2], this.cameraPosition[2],
        0,
        0,
        0,
        1,
        ];
    }

    setAngle(angle)
    {
        this.angle += angle;
        if(this.angle > 360){
            this.angle = 0;
        }
    }


    setElevation(elevation)
    {
        //this.radius += elevation;
    }
    setLookPoint(x, y, z)
    {
        this.xLook = x;
        this.yLook = y;
        this.zLook = z;     
    }

    look()
    {
        //camera position WV matrix
        // this.cameraPosition[2] = this.radius * Math.cos(utils.degToRad(-this.angle)) * Math.cos(utils.degToRad(this.elevation));
		// this.cameraPosition[1] = this.radius * Math.sin(utils.degToRad(-this.angle)) * Math.cos(utils.degToRad(this.elevation));
        // this.cameraPosition[0] = this.radius * Math.sin(utils.degToRad(this.elevation));

        var cameraMatrix = utils.MakeRotateYMatrix(utils.degToRad(this.angle));
        
        var cameraMatrix = this.lookAt([this.xLook, this.yLook, this.zLook]);

        viewMatrix = utils.invertMatrix(cameraMatrix)
        projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);


    }



}