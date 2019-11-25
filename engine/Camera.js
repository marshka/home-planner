/// <reference path="../lib/utils.js" //>
const ROTATION_FACTOR = 2;

class LookAtCamera
{    
    constructor()
    {
        this.angle  = 0.0;
        this.elevation = 10.0;
        this.radius = 3.0;

        this.xLook = 0.0;
        this.yLook = 0.0;
        this.zLook = 0.0;
    }

    setAngle(angle)
    {
        if(angle > 0) {
            this.angle += angle;
            if(this.angle > 360){
                this.angle = 0;
            }
        }
        else
        {
            this.angle += angle;
            if(this.angle < 0) {
                this.angle = 360;
            }
        }
    }

    setElevation(elevation)
    {
        this.elevation += elevation;
    }

    setLookPoint(x, y, z)
    {
        this.xLook = x;
        this.yLook = y;
        this.zLook = z;     
    }

    look()
    {

       //camera position
       this.z = this.radius * Math.cos(utils.degToRad(-this.angle)) * Math.cos(utils.degToRad(this.elevation));
       this.x = this.radius * Math.sin(utils.degToRad(-this.angle)) * Math.cos(utils.degToRad(this.elevation));
       this.y = this.radius * Math.sin(utils.degToRad(this.elevation));

		//move camera towards the looking point
		this.x += this.xLook;
		this.y += this.yLook;
		this.z += this.zLook;

		viewMatrix = utils.MakeView(this.x, this.y, this.z, -this.elevation, this.angle);
		projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);
    }

    zoom(verse)
    {
        var nRadius = this.radius + Math.sign(verse) * 0.2 * this.radius;
        if((nRadius >= 1.0) && (nRadius <= 12.0)) {
            lookAtCamera.radius = nRadius;
        }
    }

    rotateUp()
    {
        this.elevation = Math.min(90.0, this.elevation + ROTATION_FACTOR);
    }

    rotateDown()
    {
        this.elevation = Math.max(5.0, this.elevation - ROTATION_FACTOR);
    }

}