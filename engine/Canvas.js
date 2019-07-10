var Canvas = 
{
    init: function()
    {
        canvas = document.getElementById("canvas");

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
            window.onresize = Canvas.onResize;
            Canvas.onResize();

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
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;

        // set perspective matrix
        aspectRatio = w/h;
        Canvas.makePerspectiveMatrix();
        
        gl.viewport(0.0, 0.0, w, h);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   
    },

    makePerspectiveMatrix: function()
    {
        perspectiveMatrix = utils.MakePerspective(60, aspectRatio, 0.1, 2000.0);
    }
}