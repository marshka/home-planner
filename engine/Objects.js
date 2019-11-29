/*************************************
 ********* COLLIDER OBJECTS **********
 *************************************/
class Table extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('table'), mat_lightWood, "table.png");
  }
}
class Chair extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('chair'), mat_blackLeather, "chair.png");
  }
}
class Sofa extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('sofa'), mat_whiteFabric, "sofa.png");
  }
}
class TvTable extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('tvtable'), mat_lightWood, "tvtable.png");
  }
}
class Plant extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('plant'), mat_plant, "plant.png");
  }
}
class Globe extends ColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('globe'), mat_globe, "globe.png");
  }
}

/*************************************
 ****** SELF COLLIDER OBJECTS ********
 *************************************/
class Carpet extends SelfColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('carpet'), mat_carpet, "carpet.png");
  }
}

/*************************************
 ********** GROUP OBJECTS ************
 *************************************/
class Lamp extends GroupObject {
  constructor() {
    super("lamp.png");
    this.addObject3D(new ColliderObject(Mesh.loadFromOBJFile('lampSteel'), mat_steel));
    this.addObject3D(new ColliderObject(Mesh.loadFromOBJFile('lampWhite'), mat_lamp));
    lights.lamp = new PointLight("lamp", 0.0, 1.0, 0.0, 255, 255, 255, 1.0, 1.0);
    this.addLight(lights.lamp);
  }
}