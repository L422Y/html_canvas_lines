// mess with these...
var line_width = 3 + (Math.floor(Math.random() * 17 * 3) / 3);
var real_width = 2056;
var real_height = 1600;
var fill_color = "#000";
var render_scale = 0.5;
var render_delay = 100;

var color_ranges = {
    R:{ low:0, high:0 },
    G:{ low:100, high:200 },
    B:{ low:0, high:0 }
};

// not these!
var colors = [], cvObj, cvCtx, radius = line_width;

// initialize the timer offset (only render post resize by 100ms)
var resize_buffer_timer = -1;

$(function () {
    if (!$('html').is('.canvas')) {
        alert('Sorry, your browser is stupid. It doesn\'t support canvases.');
        return;
    }
    $(window).resize(function () {
        clearTimeout(resize_buffer_timer);
        resize_buffer_timer = setTimeout(render, render_delay);
    });
    render();
});


function render() {

    // adapt
    real_width = $(window).width() * 2;
    real_height = $(window).height() * 2;

    // create the canvas
    if (cvObj != null) {

        $(cvObj).remove();
    }
    cvObj = document.createElement("canvas");

    cvObj.width = real_width;
    cvObj.height = real_height;
    $("body").append(cvObj);

    // scale the canvas element (psuedo anti-aliasing)
    $(cvObj).css({
        width:real_width * render_scale + "px",
        height:real_height * render_scale + "px"
    });
    cvCtx = cvObj.getContext("2d");

    // fill background
    cvCtx.fillStyle = fill_color;
    cvCtx.fillRect(0, 0, real_width, real_height);

    // set up the canvas for iteration
    cvCtx.translate(real_width / 2, real_height / 2);
    cvCtx.moveTo(0, 0);

    // set up the line parameters
    cvCtx.lineCap = "butt";
    cvCtx.strokeStyle = "#000";
    cvCtx.lineWidth = line_width;

    // rad
    radius = line_width;

    // start drawing.
    drawCircs();
}

function drawCircs() {
    var rgb = "rgba(" +
        Math.floor(color_ranges.R.low + Math.random() * color_ranges.R.high) + "," +
        Math.floor(color_ranges.G.low + Math.random() * color_ranges.G.high) + "," +
        Math.floor(color_ranges.B.low + Math.random() * color_ranges.B.high) + ",1)";

    // store the color
    colors.splice(0, 0, rgb);

    // draw circle

    cvCtx.strokeStyle = rgb;
    cvCtx.lineWidth = line_width;
    cvCtx.beginPath();
    cvCtx.moveTo(0, 0);
    cvCtx.beginPath();
    cvCtx.arc(0, 0, radius, 0, 360);
    cvCtx.stroke();
    cvCtx.closePath();

    radius += line_width * 2;
    if (radius < real_width || radius < real_height) {
        //repeat
        drawCircs();
    } else {
        cvCtx.moveTo(512, 256);
        radius = line_width;
        doCuts();
    }
}

var rot = 0;
var old_rn = 0;
function doCuts() {

    var rn;
    while (Math.abs((rn = (360 * Math.random())) - old_rn) < 40) {
    }
    ;
    old_rn = rn;
    cvCtx.save();
    cvCtx.rotate(rn * Math.PI / 180);

    // recall the color for this ring.
    var rgb = colors.pop();

    cvCtx.beginPath();
    cvCtx.moveTo(radius + (line_width ), 0);
    cvCtx.strokeStyle = fill_color;
    cvCtx.lineWidth = line_width * 2.3;
    cvCtx.lineTo(radius + (line_width * 3), 0);
    cvCtx.stroke();


    cvCtx.beginPath();
    cvCtx.moveTo(radius + line_width * 0.2, 0);
    cvCtx.strokeStyle = rgb;
    cvCtx.lineWidth = line_width;
    cvCtx.lineTo(radius + line_width * 3, 0);
    cvCtx.stroke();


    cvCtx.restore();
    radius += line_width * 2;
    if (radius < real_width || radius < real_height) {
        // repeat
        doCuts();
    }

}

