var keys = [];

var Input = 
{
    UP_KEY:         38,
    DOWN_KEY:       40,
    LEFT_KEY:       37,
    RIGHT_KEY:      39,
    ENTER_KEY:      13,
    DEL_KEY:        46,

    init: function()
    {
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
        var cameraLeftRightSlider = document.getElementById("cameraLeftRightSlider");
        var cameraUpDownSlider = document.getElementById("cameraUpDownSlider");
        var cameraZoomSlider = document.getElementById("cameraZoomSlider");
        cameraLeftRightSlider.value = lookAtCamera.angle;
        cameraUpDownSlider.value = lookAtCamera.elevation;
        cameraZoomSlider.value = lookAtCamera.radius;
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
        directionalSlider.value = lights.main.direction[0];
        directionalSlider.oninput = function() {
            var value = parseFloat(directionalSlider.value);
            var direction = lights.main.direction;
            lights.main.setDirection(value, direction[1], direction[2]);
        }

        // OBJECTS
        document.getElementById("table-obj").addEventListener('click', event => {
            var tavoloOBJ = new ObjectBase(
                Mesh.loadFromOBJFile('tavolo'),
                mat_table
                );
            tavoloOBJ.select();
            objects.push(tavoloOBJ);
        });

        // TEXTURES
        document.getElementById("parquet-txt").addEventListener('click', event => {
            obj_floor.changeMaterial(mat_parquet);
        });
        document.getElementById("maiolica-txt").addEventListener('click', event => {
            obj_floor.changeMaterial(mat_maiolica);
        });
        document.getElementById("fourtiles-txt").addEventListener('click', event => {
            obj_floor.changeMaterial(mat_4tiles);
        });
        document.getElementById("sixteentiles-txt").addEventListener('click', event => {
            obj_floor.changeMaterial(mat_16tiles);
        });
        document.getElementById("white-txt").addEventListener('click', event => {
            obj_walls.changeMaterial(mat_white);
        });
        document.getElementById("grey-txt").addEventListener('click', event => {
            obj_walls.changeMaterial(mat_grey);
        });
        document.getElementById("yellow-txt").addEventListener('click', event => {
            obj_walls.changeMaterial(mat_yellow);
        });
        document.getElementById("brown-txt").addEventListener('click', event => {
            obj_walls.changeMaterial(mat_brown);
        });
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