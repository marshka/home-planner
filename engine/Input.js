var keys = [];

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
        const CAMERA_DEFAULT_ANGLE = lookAtCamera.angle;
        const CAMERA_DEFAULT_ELEVATION = lookAtCamera.elevation;
        const CAMERA_DEFAULT_RADIUS = lookAtCamera.radius;

        window.addEventListener("keyup", Input.keyUp, false);
        window.addEventListener("keydown", Input.keyDown, false);

        // MOUSE
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

        // CAMERA SLIDERS
        var cameraDefaultButton = document.getElementById("cameraDefaultButton");
        var cameraLeftRightSlider = document.getElementById("cameraLeftRightSlider");
        var cameraUpDownSlider = document.getElementById("cameraUpDownSlider");
        var cameraZoomSlider = document.getElementById("cameraZoomSlider");
        cameraLeftRightSlider.value = CAMERA_DEFAULT_ANGLE;
        cameraUpDownSlider.value = CAMERA_DEFAULT_ELEVATION;
        cameraZoomSlider.value = CAMERA_DEFAULT_RADIUS;
        cameraDefaultButton.addEventListener("click", event => {
            lookAtCamera.angle = CAMERA_DEFAULT_ANGLE;
            lookAtCamera.elevation = CAMERA_DEFAULT_ELEVATION;
            lookAtCamera.radius = CAMERA_DEFAULT_RADIUS;
            cameraLeftRightSlider.value = CAMERA_DEFAULT_ANGLE;
            cameraUpDownSlider.value = CAMERA_DEFAULT_ELEVATION;
            cameraZoomSlider.value = CAMERA_DEFAULT_RADIUS;
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

        // LIGHTS
        var ambientSlider = document.getElementById("ambientSlider");
        ambientSlider.value = lights.ambient.intensity;
        ambientSlider.oninput = function() {
            var value = parseFloat(ambientSlider.value);
            if (value >= 0.0 && value <= 1.0) {
                lights.ambient.setIntensity(value);
            }
        }
        var directionalSlider = document.getElementById("directionalSlider");
        directionalSlider.value = lights.main.getXZAngleDegree();
        directionalSlider.oninput = function() {
            var rad = parseInt(directionalSlider.value)*Math.PI/180;
            lights.main.setDirection(Math.cos(rad), 1.0, Math.sin(rad));
        }

        // OBJECTS
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
                if (objects.filter(function(e){return e instanceof Lamp;}).length < MAX_LAMPS)
                    obj = new Lamp();
                else
                    alert("Maximum number of lamps added");
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

        // TEXTURES
        document.getElementById("textures-grid").addEventListener('click', event => {
            switch(event.target.id) {
                case "parquet-txt":
                obj_floor.changeMaterial(mat_parquet);
                break;
                case "maiolica-txt":
                obj_floor.changeMaterial(mat_maiolica);
                break;
                case "fourtiles-txt":
                obj_floor.changeMaterial(mat_4tiles);
                break;
                case "sixteentiles-txt":
                obj_floor.changeMaterial(mat_16tiles);
                break;
                case "white-txt":
                obj_walls.changeMaterial(mat_white);
                break;
                case "grey-txt":
                obj_walls.changeMaterial(mat_grey);
                break;
                case "yellow-txt":
                obj_walls.changeMaterial(mat_yellow);
                break;
                case "brown-txt":
                obj_walls.changeMaterial(mat_brown);
                break;
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