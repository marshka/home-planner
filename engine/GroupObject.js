class GroupObject extends ObjectBase{
    constructor(mesh, material)
	{
        //with no mesh
		super(mesh, material);

		this.objects = [];
		this.objectsCount = 0;
	}

	addObject3D(object)
	{
		this.objects[this.objectsCount] = object;
        this.objects[this.objectsCount].setParent(this);
        this.objectsCount++;
        this.setBoundingBox();
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

    render()
    {
        for(var i=0; i < this.objectsCount; i++)
        {
            this.objects[i].render();
        }
        super.render();
    }
}