/*************************************
************ ROOM OBJECTS ************
**************************************/
class Floor extends ObjectBase {
  constructor() {
    super(Mesh.loadFromOBJFile('floor'), materials.floor.parquet);
  }
}
class Walls extends ObjectBase {
  constructor() {
    super(Mesh.loadFromOBJFile('walls'), materials.walls.white);
  }
}
/*************************************
********** COLLIDER OBJECTS **********
**************************************/
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
******* SELF COLLIDER OBJECTS ********
**************************************/
class Carpet extends SelfColliderObject {
  constructor() {
    super(Mesh.loadFromOBJFile('carpet'), materials.texture.carpet, "carpet.png");
  }
}

/*************************************
*********** GROUP OBJECTS ************
**************************************/
class Lamp extends GroupObject {
  constructor() {
    super("lamp.png");
    this.addObject3D(new ColliderObject(Mesh.loadFromOBJFile('lamp/lampSteel'), materials.steel));
    this.addObject3D(new ColliderObject(Mesh.loadFromOBJFile('lamp/lampWhite'), materials.lamp));
    lights.lamp = new PointLight("lamp", 255, 255, 255)
    .setPosition(this.x, this.y + 1.9, this.z)
    .setTargetDistance(1.5)
    .setDecayFactor(2);
    this.addLight(lights.lamp);
  }
}
class Chandelier extends GroupObject {
  constructor() {
    super();
    this.addObject3D(new ObjectBase(Mesh.loadFromOBJFile('chandelier/chandelierWhite'), materials.lamp));
    this.addObject3D(new ObjectBase(Mesh.loadFromOBJFile('chandelier/chandelierSteel'), materials.steel));
    this.addObject3D(new ObjectBase(Mesh.loadFromOBJFile('chandelier/chandelierWood'), materials.texture.wengeWood));
    lights.chandelier = new SpotLight("chandelier", 255, 255, 255)
    .setPosition(this.x + 0.055, this.y + 2.55, this.z)
    .setTargetDistance(1.5)
    .setDecayFactor(1)
    .setDirection(0.0, 1.0, 0.0)
    .setConeIn(40)
    .setConeOut(90);
    this.addLight(lights.chandelier);
  }
}