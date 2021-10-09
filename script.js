const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ball = {

    x : 120,
    y : 120,

    keys : {
        LEFT : false,
        RIGHT : false,
        UP : false,
        DOWN : false,
    }
};

const drawBall = (x, y, r, color) => {

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
};

function mailtome() {
    window.open('mailto:batuhanyigit1705@gmail.com');
}

canvas.addEventListener("keydown", function(e){
    if (e.keyCode == 65) {
        ball.keys.LEFT = true;
    }
    if (e.keyCode == 68) {
        ball.keys.RIGHT = true;
    }
    if (e.keyCode == 87) {
        ball.keys.UP = true;
    }
    if (e.keyCode == 83) {
        ball.keys.DOWN = true;
    }
});

canvas.addEventListener("keyup", function(e){
    if (e.keyCode == 65) {
        ball.keys.LEFT = false;
    }
    if (e.keyCode == 68) {
        ball.keys.RIGHT = false;
    }
    if (e.keyCode == 87) {
        ball.keys.UP = false;
    }
    if (e.keyCode == 83) {
        ball.keys.DOWN = false;
    }
});

function move() {
    if (ball.keys.LEFT)
        ball.x -= 2;
    if (ball.keys.RIGHT)
        ball.x += 2;
    if (ball.keys.UP)
        ball.y -= 2;
    if (ball.keys.DOWN)
        ball.y += 2;
}

function mainloop() {

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    move();
    drawBall(ball.x, ball.y, 30, "pink");

    requestAnimationFrame(mainloop);
}
requestAnimationFrame(mainloop);