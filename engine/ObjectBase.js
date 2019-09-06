class ObjectBase {

  constructor(mesh, material){
    this.mesh = mesh;
    this.material = material;

    this.parent = obj_walls;

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

      // Boolean Flags
      this.isSelected       = false;


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
        this.boundingBox.update(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ);
      }

  }

  setPosition(x, y, z)
  {    
    this.x = x; this.y = y; this.z = z;
    this.updatebBox(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ);
  }

  setRotation(x, y, z)
  {
    this.rotX = x;  this.rotY = y; this.rotZ = z;
  }

  setScale(x, y, z)
  {
    this.scaleX = x; this.scaleY = y; this.scaleZ = z;
    this.updatebBox(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ);
  }


  move(x, y, z)
  {
      this.x += x; this.y += y; this.z += z;
      this.updatebBox(this.x, this.y, this.z, this.scaleX, this.scaleY, this.scaleZ);
      
      if(this.boundingBox.checkRoomCollision(this.parent.boundingBox))
      {
        this.move(-x,-y,-z);
      }
    }

  rotate(x, y, z)
  {
      this.rotX += x; this.rotY += y; this.rotZ += z;
  }

  updatebBox(x, y, z, scaleX, scaleY, scaleZ)
  {
    this.boundingBox.update(x, y, z, scaleX, scaleY, scaleZ);
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

  changeMaterial(material) {
    this.material = material;
  }

  render()
  {
    this.handleInput();
    var worldMatrix = utils.MakeWorld_(this.x, this.y, this.z, 
                                        this.rotX, this.rotY, this.rotZ, 
                                        this.scaleX, this.scaleY, this.scaleZ);
    this.material.bindShader();
    if(this.mesh != null){
        this.mesh.render(worldMatrix, this.material.shader);
    }
    this.boundingBox.render();
    
  }

  // COLLISION

  handleInput()
  {
    if(this.isSelected)
    {
      if(Input.isKeyClicked(Input.UP_KEY))
      {
        this.move(0,0,-0.5);
      }

      if(Input.isKeyClicked(Input.DOWN_KEY))
      {
        this.move(0,0,0.5);
      }

      if(Input.isKeyClicked(Input.LEFT_KEY))
      {
        this.move(-0.5,0,0);
      }

      if(Input.isKeyClicked(Input.RIGHT_KEY))
      {
        this.move(0.5,0,0);
      }
  }
}


}