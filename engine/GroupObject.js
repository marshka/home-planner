class GroupObject extends ObjectBase{
    constructor(thumb)
	{
		super(null, new Material(0.0,0.0,0.0,0.0), thumb);

        this.objects = [];
        this.lights = [];
		this.objectsCount = 0;
	}

	addObject3D(object)
	{
		this.objects[this.objectsCount] = object;
        this.objects[this.objectsCount].setParent(this);
        this.objectsCount++;
        this.setBoundingBox();
	}

    addLight(light) {
        this.lights.push(light);
    }

    //Compute automatically the boundingbox of the entire group each time an object is added.
    setBoundingBox()
    {
        var min = {
            x: 0.0,
            y: 0.0,
            z: 0.0
        };

        var max = {
            x: 0.0,
            y: 0.0,
            z: 0.0
        };

        for(var i=0; i < this.objects.length; i++)
        {
            var ob = this.objects[i];
            if(ob.boundingBox.minX < min.x)
                min.x = ob.boundingBox.minX;
            if(ob.boundingBox.maxX > max.x)
                max.x = ob.boundingBox.maxX;

            if(ob.boundingBox.minY < min.y)
                min.y = ob.boundingBox.minY;
            if(ob.boundingBox.maxY > max.y)
                max.y = ob.boundingBox.maxY;

            if(ob.boundingBox.minZ < min.z)
                min.z = ob.boundingBox.minZ;
            if(ob.boundingBox.maxZ > max.z)
                max.z = ob.boundingBox.maxZ;

        }

        this.boundingBox.update_(min.x, min.y, min.z, max.x, max.y, max.z);
    }

    move(x, y, z)
    {
        for(var i=0; i < this.objectsCount; i++)
        {
            this.objects[i].move(x, y, z);
        }
        for(var i=0; i < this.lights.length; i++)
        {
            this.lights[i].move(x, y, z);
        }
        super.move();
    }

    rotate(x, y, z)
    {
        for(var i=0; i < this.objectsCount; i++)
        {
            this.objects[i].rotate(x, y, z);
        }
        super.rotate();
    }

    remove() {
        for(var i=0; i < this.lights.length; i++)
        {
            this.lights[i].turnOff();
            console.log(lights.lamp);
        }
        super.remove();
    }

    render()
    {
        for(var i=0; i < this.objectsCount; i++)
        {
            this.objects[i].render();
        }
        super.render();
    }
}