class ObjectBase {

  constructor(mesh, shader){
    this.mesh = mesh;
    this.shader = shader;

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
  }

  setPosition(x, y, z)
  {    
    this.x = x; this.y = y; this.z = z;
  }

  setRotation(x, y, z)
  {
    this.rotX = x;  this.rotY = y; this.rotZ = z;
  }

  setScale(x, y, z)
  {
    this.scaleX = x; this.scaleY = y; this.scaleZ = z;
  }


  move(x, y, z)
  {
      this.x += x; this.y += y; this.z += z;
  }

  rotate(x, y, z)
  {
      this.rotX += x; this.rotY += y; this.rotZ += z;
  }

  render()
  {
    var worldMatrix = utils.MakeWorld_(this.x, this.y, this.z, 
                                        this.rotX, this.rotY, this.rotZ, 
                                        this.scaleX, this.scaleY, this.scaleZ);
    if(this.mesh != null){
        this.mesh.render(worldMatrix, this.shader);
    }
    
  }















}