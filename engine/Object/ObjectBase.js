class ObjectBase {

  constructor(mesh, material, thumb){
    this.mesh = mesh;
    this.material = material;
    if (thumb) {
      this.thumb = thumbs_dir + thumb;
    }

    this.walls = obj_walls;
    this.parent = null;

      //Position
      this.x = 0;
      this.y = 0;
      this.z = 0;

      //Rotation;
      this.rotX = 0;
      this.rotY = 0;
      this.rotZ = 0;

      //Scale
      this.scaleX = 1.0;
      this.scaleY = 1.0;
      this.scaleZ = 1.0;

      this.boundingBox;


      //objects that can be tested for collision against this
      this.collidableObjects = [];

      // Boolean Flags
      this.isSelected       = false;
      this.isColliding      = false;


      //computes the bounding box 
      if(this.mesh != null) 
      {
        var minX = mesh.positions[0];
        var maxX = mesh.positions[0];
        var minY = mesh.positions[1];
        var maxY = mesh.positions[1];
        var minZ = mesh.positions[2];
        var maxZ = mesh.positions[2];

        for(var i = 0; i < mesh.positions.length; i+=3)
        {
          if(mesh.positions[i] < minX)
            minX = mesh.positions[i];
          if(mesh.positions[i] > maxX)
            maxX = mesh.positions[i];

          if(mesh.positions[i+1] < minY)
            minY = mesh.positions[i+1];
          if(mesh.positions[i+1] > maxY)
            maxY = mesh.positions[i+1];

          if(mesh.positions[i+2] < minZ)
            minZ = mesh.positions[i+2];
          if(mesh.positions[i+2] > maxZ)
            maxZ = mesh.positions[i+2];
        }

        this.boundingBox = new BoundingBox(minX, minY, minZ, maxX, maxY, maxZ);
        this.boundingBox.update(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ, this.rotY);
      }
      else
      {
        this.boundingBox = new BoundingBox(0, 0, 0, 0, 0, 0);
      }

    }

    setPosition(x, y, z)
    {    
      this.x = x; this.y = y; this.z = z;
      this.updatebBox(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ, 0);
    }

    setRotation(x, y, z)
    {
      this.rotX = x;  this.rotY = y; this.rotZ = z;
      this.updatebBox(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ, this.rotY);
    }

    setScale(x, y, z)
    {
      this.scaleX = x; this.scaleY = y; this.scaleZ = z;
      this.updatebBox(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ, 0);
    }


    move(x, y, z)
    {
      this.x += x; this.y += y; this.z += z;
      this.updatebBox(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ, 0);
      
      if(this.boundingBox.checkRoomCollision(this.walls.boundingBox))
      {
        this.move(-x,-y,-z);
      }
    }

    rotate(x, y, z)
    {
      this.rotX += x; this.rotY += y; this.rotZ += z;
      this.updatebBox(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ, y);
      if(this.boundingBox.checkRoomCollision(this.walls.boundingBox))
      {
        this.rotate(-x,-y,-z);
      }
    }

    updatebBox(x, y, z, scaleX, scaleY, scaleZ, rotY)
    {
      this.boundingBox.update(x, y, z, scaleX, scaleY, scaleZ, rotY);
    }

    setbBox(state)
    {
      if(state)
        this.boundingBox.enable = true;
      else
        this.boundingBox.enable = false;
    }

    setParent(parent)
    {
      this.parent = parent;
    }

    hierarchyPosition(position)
    {
      if(this.parent != null)
      {
        var parentWorldMat = utils.MakeWorld_(this.parent.x, this.parent.y, this.parent.z, 
          this.parent.rotX, this.parent.rotY, this.parent.rotZ, 
          this.parent.scaleX, this.parent.scaleY, this.parent.scaleZ);

        var transformedPosition = utils.multiplyMatrixVector(parentWorldMat, position);

        return this.parent.hierarchyPosition(transformedPosition);
      }
      else
      {
        return position;
      }
    }

    hierarchyRotation(rotation)
    {
      if(this.parent != null)
      {
        return this.parent.hierarchyRotation(
          [rotation[0] + this.parent.rotX,
          rotation[1] + this.parent.rotY,
          rotation[2] + this.parent.rotZ]
        );
      } else
      {
        return rotation;
      }
    }

    hierarchyScale(scale)
    {
      if(this.parent != null)
			return this.parent.hierarchyScale(
														[scale[0] * this.parent.scaleX,
														scale[1] * this.parent.scaleY,
														scale[2] * this.parent.scaleZ]
													);
		else
			return scale;
    }

    changeMaterial(material) {
      this.material = material;
    }

    render()
    {
      this.handleInput();

      //At each frame recompute the position, rotation, scale depending on the parent
      var transformedPosition = this.hierarchyPosition([this.x, this.y, this.z, 1.0]);
      var transformedRot = this.hierarchyRotation([this.rotX, this.rotY, this.rotZ]);
      var transformedScale = this.hierarchyScale([this.scaleX, this.scaleY, this.scaleZ]);

      var worldMatrix = utils.MakeWorld_(transformedPosition[0], transformedPosition[1], transformedPosition[2],
                                      transformedRot[0], transformedRot[1], transformedRot[2],
                                      transformedScale[0], transformedScale[1], transformedScale[2]);

      this.material.bindShader();

      if(this.mesh != null){
        this.mesh.render(worldMatrix, this.material.shader);
      }
      
      this.boundingBox.render();
    }

    remove() {
      objects.splice(objects.indexOf(this), 1);
    }

  // COLLISION

  select() {
    this.setbBox(true);
    this.isSelected = true;
    this.setCollisionWith(objects);
  }

  clear() {
    if(this.isColliding) {
      this.remove();
    }
    else {
      this.setbBox(false);
      this.isSelected = false;
      this.collidableObjects = [];
    }
  }

  setCollisionWith(objects)
  {
    this.collidableObjects = objects;
  }

  // This function solve the collisions with other object (has to run at each frame)
  solveCollision()
  {
    for(var i=0; i < this.collidableObjects.length; i++)
    {

      if(this.collidableObjects[i] != this)
      {
        if(this.boundingBox.checkCollision(this.collidableObjects[i].boundingBox))
        {
          this.boundingBox.setColliderColor();
          this.isColliding = true;
          return;
        }
      }
    }

    // If there aren't any objects against this
    this.boundingBox.setNonColliderColor();
    this.isColliding = false;
  }

  handleInput()
  {
    if(this.isSelected)
    {
      // Rotation with CTRL_KEY pressed
      if (Input.isKeyDown(Input.CTRL_KEY)) {
        if(Input.isKeyClicked(Input.LEFT_KEY))
          this.rotate(0,5,0);
        else if (Input.isKeyClicked(Input.RIGHT_KEY))
          this.rotate(0,-5,0);
        return;
      }

      if(Input.isKeyClicked(Input.UP_KEY))
      {
        this.move(0,0,-0.05);
      }

      if(Input.isKeyClicked(Input.DOWN_KEY))
      {
        this.move(0,0,0.05);
      }

      if(Input.isKeyClicked(Input.LEFT_KEY))
      {
        this.move(-0.05,0,0);
      }

      if(Input.isKeyClicked(Input.RIGHT_KEY))
      {
        this.move(0.05,0,0);
      }

      if(Input.isKeyClicked(Input.ENTER_KEY))
      {
        this.clear();
      }

      if(Input.isKeyClicked(Input.DEL_KEY) || Input.isKeyClicked(Input.ESC_KEY))
      {
        this.remove();
      }
    }
  }


}