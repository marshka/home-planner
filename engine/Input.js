var keys = [];
var picker, collapsibles;

var Input = 
{
    UP_KEY:         38,
    DOWN_KEY:       40,
    LEFT_KEY:       37,
    RIGHT_KEY:      39,
    ENTER_KEY:      13,
    ESC_KEY:        27,
    DEL_KEY:        46,
    CTRL_KEY:       17,
    ALT_KEY:        18,
    SPACE_KEY:      32,
    W_KEY:          87,
    A_KEY:          65,
    S_KEY:          83,
    D_KEY:          68,
    H_KEY:          72,

    init: function() {

        this.collapsiblePanels();

        window.addEventListener("keyup", Input.keyUp, false);
        window.addEventListener("keydown", Input.keyDown, false);

        this.initCameraCommands();
        this.initMouseCommands();
        this.initLightsCommands();
        this.initFurnitureCommands();
        this.initMaterialsCommands();
        this.lampsLimitHandler();

    },

    collapsiblePanels: function(){
        collapsibles = document.getElementsByClassName("collapsible");
        for(var i = 0; i < collapsibles.length; i++) {
            collapsibles[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight){
                  content.style.maxHeight = null;
              } else {
                  content.style.maxHeight = (parseInt(content.scrollHeight) + 20) + "px";
              }
          });
        }
    },

    initCameraCommands: function(){
        const CAMERA_DEFAULT = {
            angle: lookAtCamera.angle,
            elevation: lookAtCamera.elevation,
            radius: lookAtCamera.radius
        }
        var cameraDefaultButton = document.getElementById("cameraDefaultButton");
        var cameraLeftRightSlider = document.getElementById("cameraLeftRightSlider");
        var cameraUpDownSlider = document.getElementById("cameraUpDownSlider");
        var cameraZoomSlider = document.getElementById("cameraZoomSlider");

        cameraLeftRightSlider.value = CAMERA_DEFAULT.angle;
        cameraUpDownSlider.value = CAMERA_DEFAULT.elevation;
        cameraZoomSlider.value = CAMERA_DEFAULT.radius;

        cameraDefaultButton.addEventListener("click", event => {
            lookAtCamera.angle = CAMERA_DEFAULT.angle;
            lookAtCamera.elevation = CAMERA_DEFAULT.elevation;
            lookAtCamera.radius = CAMERA_DEFAULT.radius;
            cameraLeftRightSlider.value = CAMERA_DEFAULT.angle;
            cameraUpDownSlider.value = CAMERA_DEFAULT.elevation;
            cameraZoomSlider.value = CAMERA_DEFAULT.radius;
        });

        cameraLeftRightSlider.oninput = function() {
            lookAtCamera.angle = parseInt(cameraLeftRightSlider.value);
        }
        cameraUpDownSlider.oninput = function() {
            var value = parseInt(cameraUpDownSlider.value);
            if (value >= 5 && value <= 90)
                lookAtCamera.elevation = value;
        }
        cameraZoomSlider.oninput = function() {
            var value = parseInt(cameraZoomSlider.value);
            lookAtCamera.radius = value;
        }
    },

    initMouseCommands: function(){
        var mouseState = false;
        var lastMouseX = -100, lastMouseY = -100;
        canvas.addEventListener("mousedown", event => {
            lastMouseX = event.pageX;
            lastMouseY = event.pageY;
            mouseState = true;
        });
        canvas.addEventListener("mouseup", event => {
            lastMouseX = -100;
            lastMouseY = -100;
            mouseState = false;
        });
        canvas.addEventListener("mousemove", event => {
            if(mouseState) {
                var dx = event.pageX - lastMouseX;
                var dy = lastMouseY - event.pageY;
                lastMouseX = event.pageX;
                lastMouseY = event.pageY;

                if((dx != 0) || (dy != 0)) {
                    lookAtCamera.angle = lookAtCamera.angle + 0.5 * dx;
                    (dy<0)?lookAtCamera.rotateUp():lookAtCamera.rotateDown();
                }
            }
        });
        canvas.addEventListener("wheel", event => {
            lookAtCamera.zoom(event.deltaY);
        });
    },

    initLightsCommands: function(){
        var ambientSlider = document.getElementById("ambientSlider");
        ambientSlider.value = lights.ambient.intensity;
        ambientSlider.oninput = function() {
            lights.ambient.setIntensity(ambientSlider.value);
        }
        var directionalSlider = document.getElementById("directionalSlider");
        directionalSlider.value = lights.main.getXZAngleDegree();
        directionalSlider.oninput = function() {
            lights.main.rotate(directionalSlider.value);
        }
        var directionalIntensitySlider = document.getElementById("directionalIntensitySlider");
        directionalIntensitySlider.value = lights.main.intensity;
        directionalIntensitySlider.oninput = function() {
            lights.main.setIntensity(directionalIntensitySlider.value);
        }
        var chandelierSwitch = document.getElementById("chandelierSwitch");
        chandelierSwitch.oninput = function() {
            chandelierSwitch.checked ? lights.chandelier.setIntensity(0.6) : lights.chandelier.turnOff();
        }
    },

    initFurnitureCommands: function(){
        document.getElementById("objects-grid").addEventListener('click', event => {
            var obj;
            switch(event.target.id) {
                case "table-obj":
                obj = new Table();
                break;
                case "chair-obj":
                obj = new Chair();
                break;
                case "lamp-obj":
                obj = new Lamp();
                break;
                case "sofa-obj":
                obj = new Sofa();
                break;
                case "tvtable-obj":
                obj = new TvTable();
                break;
                case "plant-obj":
                obj = new Plant();
                break;
                case "carpet-obj":
                obj = new Carpet();
                break;
                case "globe-obj":
                obj = new Globe();
                break;
                default:
                return;
            }
            obj.select();
            objects.push(obj);
        });
    },

    initMaterialsCommands: function(){
        document.getElementById("textures-grid").addEventListener('click', event => {
            switch(event.target.id) {
                case "parquet-txt":
                room.floor.changeMaterial(materials.floor.parquet);
                break;
                case "maiolica-txt":
                room.floor.changeMaterial(materials.floor.maiolica);
                break;
                case "fourtiles-txt":
                room.floor.changeMaterial(materials.floor.fourTiles);
                break;
                case "sixteentiles-txt":
                room.floor.changeMaterial(materials.floor.sixteenTiles);
                break;
                case "white-txt":
                room.walls.changeMaterial(materials.walls.white);
                break;
                case "grey-txt":
                room.walls.changeMaterial(materials.walls.grey);
                break;
                case "brown-txt":
                room.walls.changeMaterial(materials.walls.brown);
                break;
                case "custom-txt":
                case "custom-txt-overlay":
                room.walls.changeMaterial(materials.walls.custom);
                break;
            }
        });

        // Color picker
        picker = new CP(document.getElementById('custom-txt'));
        picker.on("drag", function(color) {
            this.source.style.backgroundColor = '#' + color;
            var rgb = this.source.style.backgroundColor;
            rgb=rgb.substring(4,rgb.length-1).split(", ");
            room.walls.changeMaterial(materials.walls.custom);
            room.walls.material.setDiffuseColor(rgb[0], rgb[1], rgb[2], 1.0);
        });
    },

    lampsLimitHandler: function() {
        const lampElement = document.getElementById('lamp-obj');
        Object.defineProperty(objects, "push", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: function (...args)
            {
                if (args[0] instanceof Lamp) {
                    if (lampsIdx.length == 0) {
                        Input.disableElement(lampElement);
                    } else if (lampsIdx.length < 0) {
                        return;
                    }
                }
                return Array.prototype.push.apply(this, args);
            }
        });
        Object.defineProperty(objects, "splice", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: function (...args)
            {
                if (objects[args[0]] instanceof Lamp) {
                    lampsIdx.push(parseInt(objects[args[0]].lights[0].name.substr(-2,1)));
                    if (lampsIdx.length < MAX_LAMPS) {
                        Input.enableElement(lampElement);
                    }
                }
                return Array.prototype.splice.apply(this, args);
            }
        });
    },

    enableElement: function(e){
        e.style.removeProperty("pointer-events");
        e.style.opacity = 1.0;
    },

    disableElement: function(e){
        e.style.pointerEvents = "none";
        e.style.opacity = 0.3;
    },

    handle: function () {

        if(Input.isKeyClicked(Input.SPACE_KEY)) {
            Modal.trigger();
        }

    },

    keyUp: function(e){
        if(keys[e.keyCode]) {
            keys[e.keyCode] = false;
        }
    },

    keyDown: function(e) {
        // space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
        if(!keys[e.keyCode]) {
            keys[e.keyCode] = true;
        }
    },

    //used for buttons pressed long time
    isKeyDown: function(keyCode) {
        return keys[keyCode];
    },

    //used for buttons pressed one time
    isKeyClicked: function(keyCode) {
        var state = keys[keyCode];
        if(keys[keyCode]){
            keys[keyCode] = false;
        }
        return state;
    }

}