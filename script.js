
// Site
// ================================================ ##

function mailtome() {
    window.open('mailto:batuhanyigit1705@gmail.com');
}

// ================================================ ##

// Game
// ================================================ ##

// Global Variables
// Graphics
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// Physics
const friction = 0.1;
// Input
const input = {
    keys : {
        LEFT : false,
        RIGHT : false,
        UP : false,
        DOWN : false,
    }
}


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
    let collisionResponse = distanceVec.normalized().multiply(collisionDepth / (b1.invMass + b2.invMass));
    b1.pos = b1.pos.add(collisionResponse.multiply(b1.invMass));
    b2.pos = b2.pos.add(collisionResponse.multiply(-b2.invMass));
}

function ballCollisionResolution(b1, b2) {

    let normal = b1.pos.subtract(b2.pos).normalized();
    let relVel = b1.vel.subtract(b2.vel);
    let sepVel = Vector2.dot(relVel, normal);
    let newSepVel = -sepVel * Math.min(b1.elasticity, b2.elasticity);

    let velSepDiff = newSepVel - sepVel;
    let impulse = velSepDiff / (b1.invMass + b2.invMass);
    let impulseVec = normal.multiply(impulse);

    b1.vel = b1.vel.add(impulseVec.multiply(b1.invMass));
    b2.vel = b2.vel.add(impulseVec.multiply(-b2.invMass));
}

function ballToWallClosestPoint(b, w) {
    const ballToWallStart = w.start.subtract(b.pos);
    if (Vector2.dot(w.wallUnit(), ballToWallStart) > 0)
        return w.start;
    
    const wallEndToBall = b.pos.subtract(w.end);
    if (Vector2.dot(w.wallUnit(), wallEndToBall) > 0)
        return w.end;

    let closestDist = Vector2.dot(w.wallUnit(), ballToWallStart);
    let closestVect = w.wallUnit().multiply(closestDist);
    return w.start.subtract(closestVect);
}

function ballToWallCollisionDetection(b, w) {

    const ballToClosest = ballToWallClosestPoint(b, w).subtract(b.pos);
    if (ballToClosest.mag() <= b.r)
        return true;

    return false;
}

function ballToWallCollisionResponse(b, w) {
    let collVec = b.pos.subtract(ballToWallClosestPoint(b, w));
    b.pos = b.pos.add(collVec.normalized().multiply(b.r - collVec.mag()));
}

function ballToWallCollisionResolution(b, w) {
    let normal = b.pos.subtract(ballToWallClosestPoint(b, w)).normalized();
    let sepVel = Vector2.dot(b.vel, normal);
    let newSepVel = -sepVel * b.elasticity;
    let vSepDiff = sepVel - newSepVel;
    b.vel = b.vel.add(normal.multiply(-vSepDiff));
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

class Wall {

    static walls = [];

    constructor(startX, startY, endX, endY) {
        this.start = new Vector2(startX, startY);
        this.end = new Vector2(endX, endY);
        Wall.walls.push(this);
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    wallUnit() {
        return this.end.subtract(this.start).normalized();
    }
}

class Ball {

    static balls = [];

    constructor(x, y, r, color, mass = -1) {

        this.r = r;
        this.color = color;
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.acc = new Vector2(0, 0);
        this.acceleration = 1.5;

        this.elasticity = 1;
        this.mass = (mass < 0) ? (r ** 2) / 10 : mass;
        this.invMass = (mass == 0) ? 0 : 1 / this.mass;

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

    reposition() {

        this.acc = this.acc.normalized().multiply(this.acceleration);
        this.vel = this.vel.add(this.acc);
        this.vel = this.vel.multiply(1-friction);
        this.pos = this.pos.add(this.vel);
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
}

function mainloop() {

    // Clear the Canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Move the ball controlled by player
    move();

    Ball.balls.forEach((element, index) => {

        // Collision Detection / Response between balls and walls
        Wall.walls.forEach(wall => {

            if (ballToWallCollisionDetection(element, wall)) {
                ballToWallCollisionResponse(element, wall);
                ballToWallCollisionResolution(element, wall);
            }
        })

        // Collision detection / Response / Resolution between balls
        for (let i = index + 1; i < Ball.balls.length; i++)
            if (ballCollision(element, Ball.balls[i])) {
                ballCollisionResponse(element, Ball.balls[i]);
                ballCollisionResolution(element, Ball.balls[i]);
            }

        // Apply physics to ball
        element.reposition();
    });
    
    // Draw the balls
    Ball.balls.forEach(element => {
        element.draw();
    })
    // Draw the walls
    Wall.walls.forEach(element => {
        element.draw();
    });

    // Draw the player movement indicator
    Ball.balls[0].displayMovement();

    requestAnimationFrame(mainloop);
}

// Player
const b = new Ball(100, 100, 30, "rgb(0, 0, 0)");

// Random generated balls
const bCount = 5;
const bSize = new Vector2(10, 50);
for (let i = 0; i < bCount; i++) {
    const tempR = Math.floor(bSize.x + Math.random() * (bSize.y - bSize.x + 1));
    const tempX = Math.floor(tempR + Math.random() * (canvas.clientWidth - tempR + 1));
    const tempY = Math.floor(tempR + Math.random() * (canvas.clientHeight - tempR + 1));
    new Ball(tempX, tempY, tempR, "rgb(123, 50, 255)");
}

// Walls
const w = new Wall(100, 100, 250, 300);

// Edges
const edgeLeft = new Wall(0, 0, 0, canvas.clientHeight);
const edgeRight = new Wall(canvas.clientWidth, 0, canvas.clientWidth, canvas.clientHeight);
const edgeTop = new Wall(0, 0, canvas.clientWidth, 0);
const edgeBottom = new Wall(0, canvas.clientHeight, canvas.clientWidth, canvas.clientHeight);

requestAnimationFrame(mainloop);

// ================================================ ##