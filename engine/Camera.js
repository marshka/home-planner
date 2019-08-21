/// <reference path="../lib/utils.js" //>

class LookAtCamera
{
    constructor()
    {
        this.angle  = 0.0;
        this.elevation = 20.0;
        this.radius = 10.0;

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

    handleInput()
    {
        if(Input.isKeyDown(Input.LEFT_KEY)){
            this.setAngle(-0.5);
        }

        if(Input.isKeyDown(Input.RIGHT_KEY)){
            this.setAngle(0.5);
        }

        if(Input.isKeyDown(Input.UP_KEY)){
            this.setElevation(0.5);
        }

        if(Input.isKeyDown(Input.DOWN_KEY)){
            this.setElevation(-0.5);
        }
    }

    look()
    {
        this.handleInput();

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



}