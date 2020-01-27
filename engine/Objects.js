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
    super(Mesh.loadFromOBJFile('walls_lightmap'), materials.walls.lightmap);
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
    this.setScale(1.5,1.0,2.0);
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
    let idx = lampsIdx.shift();
    lights["lamps"+ idx] = new PointLight("lamps[" + idx + "]", 200, 200, 200)
    .setPosition(this.x, this.y + 1.9, this.z)
    .setTargetDistance(1.5)
    .setDecayFactor(2)
    .setIntensity(0.8);
    this.addLight(lights["lamps" + idx]);
  }
}
class Chandelier extends GroupObject {
  constructor() {
    super();
    this.addObject3D(new ObjectBase(Mesh.loadFromOBJFile('chandelier/chandelierWhite'), materials.lamp));
    this.addObject3D(new ObjectBase(Mesh.loadFromOBJFile('chandelier/chandelierSteel'), materials.steel));
    this.addObject3D(new ObjectBase(Mesh.loadFromOBJFile('chandelier/chandelierWood'), materials.texture.wengeWood));
    lights.chandelier = new SpotLight("chandelier", 240, 240, 220)
    .setPosition(this.x + 0.055, this.y + 2.50, this.z)
    .setTargetDistance(1.5)
    .setDecayFactor(1)
    .setDirection(0.0, 1.0, 0.0)
    .setConeIn(0.6)
    .setConeOut(100)
    .setIntensity(0.6);
    this.addLight(lights.chandelier);
  }
}