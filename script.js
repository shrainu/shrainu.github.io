// Site
function mailtome() {
    window.open('mailto:batuhanyigit1705@gmail.com');
}

// Game
function round(number, precision) {
    let factor = 10**precision;
    return Math.round(number * factor) / factor;
}

function ballCollision(b1, b2) {
    if (b1.r + b2.r >= b2.pos.subtract(b1.pos).mag())
        return true;
    return false; 
}

function ballCollisionResponse(b1, b2) {
     
    let distanceVec = b1.pos.subtract(b2.pos);
    let collisionDepth = b1.r + b2.r - distanceVec.mag();
    let collisionResponse = distanceVec.normalized().multiply(collisionDepth / 2);
    b1.pos = b1.pos.add(collisionResponse);
    b2.pos = b2.pos.add(collisionResponse.multiply(-1));
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const input = {
    keys : {
        LEFT : false,
        RIGHT : false,
        UP : false,
        DOWN : false,
    }
}

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

        this.r = r;
        this.color = color;
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.acc = new Vector2(0, 0);
        this.acceleration = 2;

        Ball.balls.push(this);
    }

    draw() {

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    displayMovement() {

        const margin = 5;
        const displayRadius = 50
        const center = new Vector2(canvas.clientWidth - displayRadius - margin, 
                                   canvas.clientHeight - displayRadius - margin);

        this.vel.drawVector(center.x, center.y, 10, "green");
        this.acc.normalized().drawVector(center.x, center.y, displayRadius, "red");
        ctx.beginPath();
        ctx.arc(center.x, center.y, displayRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}

canvas.addEventListener("keydown", function(e){
    if (e.keyCode == 65) {
        input.keys.LEFT = true;
    }
    if (e.keyCode == 68) {
        input.keys.RIGHT = true;
    }
    if (e.keyCode == 87) {
        input.keys.UP = true;
    }
    if (e.keyCode == 83) {
        input.keys.DOWN = true;
    }
});

canvas.addEventListener("keyup", function(e){
    if (e.keyCode == 65) {
        input.keys.LEFT = false;
    }
    if (e.keyCode == 68) {
        input.keys.RIGHT = false;
    }
    if (e.keyCode == 87) {
        input.keys.UP = false;
    }
    if (e.keyCode == 83) {
        input.keys.DOWN = false;
    }
});

function move() {
    const friction = 0.1;

    if (input.keys.LEFT)
        b.acc.x = -b.acceleration;
    if (input.keys.RIGHT)
        b.acc.x = +b.acceleration;
    if (input.keys.UP)
        b.acc.y = -b.acceleration;
    if (input.keys.DOWN)
        b.acc.y = +b.acceleration;
    
    if (!input.keys.LEFT && !input.keys.RIGHT)
        b.acc.x = 0;
    if (!input.keys.DOWN && !input.keys.UP)
        b.acc.y = 0;

    b.acc = b.acc.normalized().multiply(b.acceleration);
    b.vel = b.vel.add(b.acc);
    b.vel = b.vel.multiply(1-friction);
    b.pos = b.pos.add(b.vel);
}

function mainloop() {

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    move();
    b.draw();

    Ball.balls.forEach(element => {
        element.draw();
        element.displayMovement();
    });

    if (ballCollision(b, b2))
        ballCollisionResponse(b, b2);

    requestAnimationFrame(mainloop);
}

const b = new Ball(100, 100, 30, "rgb(123, 50, 255)");
const b2 = new Ball(200, 150, 15, "rgb(123, 50, 255)");

requestAnimationFrame(mainloop);