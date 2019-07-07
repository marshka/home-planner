var RoomCanvas = 
{
    init: function()
    {
        canvas = document.getElementById("room-canvas");

        try
        {
            gl = canvas.getContext("webgl2");
        } 
        catch(e)
        {
            console.log(e);
        }

        if(gl)
        {
            window.onresize = RoomCanvas.onResize;
            RoomCanvas.onResize();

            gl.enable(gl.CULL_FACE);
  			gl.enable(gl.DEPTH_TEST);
  			gl.cullFace(gl.BACK);

  			gl.enable(gl.BLEND);
  			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
        else
            alert("Error: WebGL not supported by your browser!");
    },


    onResize: function() 
    {
        // get canvas dimensions
        var canvas = document.getElementById("room-canvas");
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;

        // set perspective matrix
        aspectRatio = w/h;        
        RoomCanvas.makePerspectiveMatrix();
        
        gl.viewport(0.0, 0.0, w, h);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   
    },

    makePerspectiveMatrix: function()
    {
        perspectiveMatrix = utils.MakePerspective(60, aspectRatio, 0.1, 2000.0);
    }
}

var FurnitureCanvas = 
{
    init: function()
    {
        canvas = document.getElementById("furniture-canvas");

        try
        {
            gl = canvas.getContext("webgl2");
        } 
        catch(e)
        {
            console.log(e);
        }

        if(gl)
        {
            window.onresize = FurnitureCanvas.onResize;
            FurnitureCanvas.onResize();

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.cullFace(gl.BACK);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
        else
            alert("Error: WebGL not supported by your browser!");
    },


    onResize: function() 
    {
        // get canvas dimensions
        var canvas = document.getElementById("furniture-canvas");
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;

        // set perspective matrix
        aspectRatio = w/h;        
        FurnitureCanvas.makePerspectiveMatrix();
        
        gl.viewport(0.0, 0.0, w, h);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   
    },

    makePerspectiveMatrix: function()
    {
        perspectiveMatrix = utils.MakePerspective(60, aspectRatio, 0.1, 2000.0);
    }
}