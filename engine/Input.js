var keys = [];

var Input = 
{
    UP_KEY:         38,
    DOWN_KEY:       40,
    LEFT_KEY:       37,
    RIGHT_KEY:      39,
    W_KEY:          87,
    A_KEY:          65,

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

        // SLIDER
        var cameraLeftRightSlider = document.getElementById("cameraLeftRightSlider");
        var cameraUpDownSlider = document.getElementById("cameraUpDownSlider");
        var cameraZoomSlider = document.getElementById("cameraZoomSlider");
        cameraLeftRightSlider.oninput = function() {
            lookAtCamera.angle = parseInt(cameraLeftRightSlider.value);
        }
        cameraUpDownSlider.oninput = function() {
            var value = parseInt(cameraUpDownSlider.value);
            if (value >= 5 && value <= 90)
                lookAtCamera.elevation = parseInt(cameraUpDownSlider.value);
        }
        cameraZoomSlider.oninput = function() {
            var value = parseInt(cameraZoomSlider.value);
            if (value >= 2 && value <= 60)
                lookAtCamera.radius = parseInt(cameraZoomSlider.value);
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