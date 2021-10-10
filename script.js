// Site
function mailtome() {
    window.open('mailto:batuhanyigit1705@gmail.com');
}

// Game
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

class Vector2 {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }
    subtract(vec) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }
    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    multiply(n) {
        return new Vector2(this.x * n, this.y * n);
    }
    normalized() {
        if (this.mag() == 0) 
            return new Vector2(0, 0);

        return new Vector2(this.x / this.mag(), this.y / this.mag());
    }
    normal() {
        return new Vector2(-this.y, this.x).normalized();
    }

    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }

    drawVector(startX, startY, n, color) {

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + this.x * n, startY + this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

class Ball {

    static balls = [];

    constructor(x, y, r, color) {

        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.vel = new Vector2(0, 0);
        this.acc = new Vector2(0, 0);
        this.acceleration = 2;

        Ball.balls.push(this);
    }

    draw() {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    displayMovement() {

        this.vel.drawVector(450, 400, 10, "green");
        this.acc.normalized().drawVector(450, 400, 50, "red");
        ctx.beginPath();
        ctx.arc(450, 400, 50, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
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
    const friction = 0.1;

    if (ball.keys.LEFT)
        b.acc.x = -b.acceleration;
    if (ball.keys.RIGHT)
        b.acc.x = +b.acceleration;
    if (ball.keys.UP)
        b.acc.y = -b.acceleration;
    if (ball.keys.DOWN)
        b.acc.y = +b.acceleration;
    
    if (!ball.keys.LEFT && !ball.keys.RIGHT)
        b.acc.x = 0;
    if (!ball.keys.DOWN && !ball.keys.UP)
        b.acc.y = 0;

    b.acc = b.acc.normalized().multiply(b.acceleration);
    b.vel = b.vel.add(b.acc);
    b.vel = b.vel.multiply(1-friction);

    b.x += b.vel.x;
    b.y += b.vel.y;
}

function mainloop() {

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    move();
    b.draw();

    Ball.balls.forEach(element => {
        element.draw();
        element.displayMovement();
    });

    requestAnimationFrame(mainloop);
}

const b = new Ball(100, 100, 30, "rgb(123, 50, 255)");
const b2 = new Ball(200, 150, 15, "rgb(123, 50, 255)");

requestAnimationFrame(mainloop);