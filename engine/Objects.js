/*************************************
 ********* COLLIDER OBJECTS **********
 *************************************/
class Table extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('table'), materials.texture.lightWood, "table.png");
  }
}
class Chair extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('chair'), materials.blackLeather, "chair.png");
  }
}
class Sofa extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('sofa'), materials.texture.whiteFabric, "sofa.png");
  }
}
class TvTable extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('tvtable'), materials.texture.lightWood, "tvtable.png");
  }
}
class Plant extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('plant'), materials.texture.plant, "plant.png");
  }
}
class Globe extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('globe'), materials.texture.globe, "globe.png");
  }
}

/*************************************
 ****** SELF COLLIDER OBJECTS ********
 *************************************/
class Carpet extends SelfColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('carpet'), materials.texture.carpet, "carpet.png");
  }
}

/*************************************
 ********** GROUP OBJECTS ************
 *************************************/
class Lamp extends GroupObject {
  constructor() {
    super("lamp.png");
    this.addObject3D(new ColliderObject(Mesh.loadFromOBJFile('lampSteel'), materials.steel));
    this.addObject3D(new ColliderObject(Mesh.loadFromOBJFile('lampWhite'), materials.lamp));
    lights.lamp = new PointLight("lamp", this.x, 1.9, this.z, 255, 255, 255, 1.5, 2);
    this.addLight(lights.lamp);
  }
}