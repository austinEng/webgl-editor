function init() {
    var canvas = document.getElementById('canvas');
    var gl = new MyGL();
    gl.init(canvas);
    var cam = new Camera();
    gl.setCamera(cam);
    gl.resize();
    gl.drawScene();
    function tick() {
        requestAnimationFrame(tick);
        gl.drawScene();
    }

    //tick();

    window.onresize = function(event) {
        gl.resize();
        gl.drawScene();
    };

    var mouseData = {};
    canvas.onmousedown = function(e){
        canvas.onmousemove = mouseMove;
        mouseData.mouseDownStart = [e.x, e.y];
        mouseData.mouseAt = [e.x, e.y];
        mouseData.mouseBtn = e.which;
    }
    canvas.onmouseup = function(e){
        canvas.onmousemove = null;
    }
    canvas.onmousewheel = function(e) {
        gl.getCamera().zoom(e.wheelDeltaY);
        gl.drawScene();
    }
    function mouseMove(e) {
        mouseData.mouseDiff = [e.x - mouseData.mouseDownStart[0], e.y - mouseData.mouseDownStart[1]];
        mouseData.mouseRelDiff = [mouseData.mouseDiff[0] / canvas.offsetWidth, mouseData.mouseDiff[1] / canvas.offsetHeight];
        mouseData.mouseMoveDiff = [e.movementX, e.movementY];
        mouseData.mouseMoveRelDiff = [e.movementX / canvas.offsetWidth, e.movementY / canvas.offsetHeight];
        mouseData.mouseAt = [e.x, e.y];
        if (mouseData.mouseBtn == 2) {
            gl.getCamera().rotate(mouseData);
            gl.drawScene();
        }
    }
}

$(document).ready(function() {
    $('.split-bar').mousedown(function(e1) {
        e1.preventDefault();
        $(document).mousemove(function(e2) {
            e2.preventDefault();
            if ($(e1.target).hasClass('left')) {
                var x = $(e1.target).parent().offset().left - e2.pageX + $(e1.target).parent().width();
                $(e1.target).parent().css('width', x);
            }
            window.dispatchEvent(new Event('resize'));
        })
    })
});
$(document).mouseup(function (e) {
    $(document).unbind('mousemove');
});