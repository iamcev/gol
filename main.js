var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');
var board = new Map();
var pixelSize = 4;
var keys = {};
var md = false;
var mx = 0;
var my = 0;

function updateSize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
}

updateSize();
window.addEventListener('resize', updateSize);

function iterate() {
    var newboard = new Map();
    for (var dx = 0; dx < canvas.width / (pixelSize * devicePixelRatio); dx++) {
        for (var dy = 0; dy < canvas.height / (pixelSize * devicePixelRatio); dy++) {
            var x = dx;
            var y = dy;
            var key = x + ',' + y;
            var value = board.get(key) || 0;
            var sum = 0;
            var keys = [
                (x - 1) + ',' + (y - 1),
                (x) + ',' + (y - 1),
                (x + 1) + ',' + (y - 1),
                (x - 1) + ',' + (y),
                (x + 1) + ',' + (y),
                (x - 1) + ',' + (y + 1),
                (x) + ',' + (y + 1),
                (x + 1) + ',' + (y + 1)
            ];
            for (var i = 0; i < 8; i++) {
                if (board.get(keys[i]) != undefined)
                    sum += board.get(keys[i]);
            }
            if (value) {
                if (sum < 2 || sum > 3)
                    newboard.set(key, 0);
                else
                    newboard.set(key, 1);
            }
            else if (value == 0) {
                if (sum == 3) {
                    newboard.set(key, 1);
                }
            }
        }
    }
    board = newboard;

}

function draw() {
    requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const [key, value] of board.entries()) {
        if (value) {
            var xy = key.split(',');
            var x = xy[0];
            var y = xy[1];
            ctx.fillRect(x * pixelSize * devicePixelRatio,
                y * pixelSize * devicePixelRatio, pixelSize * devicePixelRatio,
                pixelSize * devicePixelRatio);
        }
    }

    if (md) {
        var x = Math.floor(mx / (pixelSize));
        var y = Math.floor(my / (pixelSize));
        board.set(x+','+y, 1);
    }
}

window.addEventListener('mousedown', function (e) {
    md = true;
});

window.addEventListener('mouseup', function (e) {
    md = false;
});

window.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
});

function keydown(e) {
    keys[e.key.toLowerCase()] = true;
    if (keys[' '])
        iterate();
}

function keyup(e) {
    keys[e.key.toLowerCase()] = false;
}

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

draw();
