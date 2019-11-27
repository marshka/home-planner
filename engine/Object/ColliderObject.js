class ColliderObject extends ObjectBase{
    
    constructor(mesh, material)
    {
        super(mesh, material);
    }


    setCollisionWith(objects)
    {
        // Set collision only with the objects of the same type

        for(var i=0; i < objects.length; i++)
        {
            if (objects[i] instanceof ColliderObject)
            {
                this.collidableObjects.push(objects[i]);
            }
        }
        console.log(this.collidableObjects);
    }

}