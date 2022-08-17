// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Neuro-Evolution Flappy Bird

class Bird {
    constructor(brain) {
        this.y = height / 2;
        this.x = 64;
        //this.fov = 60;
        this.gravity = 0.8;
        this.lift = -12;
        this.velocity = 0;
        this.points = [];
        this.numOfInputs = 100;
        this.viewAngle = 0;
        this.score = 0;
        this.fitness = 0;
        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(this.numOfInputs, 50, 3);
        }

    }

    show() {
        stroke(255);
        fill(255, 100);
        ellipse(this.x, this.y, 32, 32);

    }

    showview() { for (point of this.points) line(this.x, this.y, point.x, point.y); }

    up() {
        this.velocity += this.lift;
    }

    mutate() {
        this.brain.mutate(0.1);
    }


    sdSphere(x, y, xs, ys, r) {
        let dx = x - xs;
        let dy = y - ys;
        let l = Math.sqrt(dx * dx + dy * dy);
        return l - r;
    }

    sdBox(x, y, box1x, box1y, w, h) {

        let ax = Math.abs(x - box1x);
        let ay = Math.abs(y - box1y);
        let dx = ax - w;
        let dy = ay - h;
        let m = Math.max(dx, dy);
        dx = Math.max(dx, 0)
        dy = Math.max(dy, 0);
        let l = Math.sqrt(dx * dx + dy * dy);
        return l + Math.min(m,0);
    }

    mapObj(x, y, pipes) {
        let res = Math.min(x, y);
        res = Math.min(res, height - y);
        res = Math.min(res, width - x);
        for (let pipe of pipes) {
            if (pipe.type == 0) {
                let pw2 = pipe.w / 2;
                let box1x = pipe.x + pw2 ;
                let box1y = pipe.top /2;
                res = Math.min(this.sdBox(x, y, box1x, box1y, pw2, box1y), res);
                let box2x = pipe.x + pw2;
                let pb2 = pipe.bottom / 2;
                let box2y = height - pb2;
                res = Math.min(this.sdBox(x, y, box2x, box2y, pw2, pb2), res);
            }
            if (pipe.type == 1) {
                res = Math.min(this.sdSphere(x, y, pipe.x, pipe.top, pipe.r), res);
            }
        }
        return res;

    }


    castRay(xd, yd, pipes) {
        let tmin = 1.0;
        let tmax = width;



        let t = tmin;
        for (let i = 0; i < 60; i++) {
            let precis = 0.005 * t;
            let res = this.mapObj(this.x + xd * t, this.y + yd * t, pipes);
            if (res < precis || t > tmax) break;
            t += res;
        }

        if (t > tmax) t = -1.0;
        return t;
    }


    raypath(pipes, ang) {
        //let s = ang;
        let cos = Math.cos(ang);
        let sin = Math.sin(ang);
        let res = this.castRay(cos, sin, pipes);
        //res = res *res/ (width * width + height * height);
        return { x: this.x + cos * res, y: this.y + sin * res, d: res * res / (width * width + height * height)  };
    }

    think(pipes) {


        this.points = [];

        let i = this.numOfInputs - 4;
        let pp = i / 2;
        let inputs = [];
        let oneDeg = 3.14 / 180;
        let a1 = oneDeg*60/2;
        let d = a1 / pp;

        //rays
        for (; i--;) {
            let r = this.raypath(pipes, this.viewAngle + (a1 -= d));

            inputs.push(r.d);
            this.points.push(r);
        }
        inputs.push(this.viewAngle / 3.14);
        inputs.push(this.velocity / 10);
        inputs.push(this.y / height);
        inputs.push(this.x / width);
        //inputs.push(fov);

        let output = this.brain.predict(inputs);

        if (output[0] > 0.5)
            this.up();
        
        this.x += (output[1] - 0.5) * 10;
        this.viewAngle += (output[2] - 0.5) * 0.1;
        if (this.viewAngle < -3.14) this.viewAngle = this.viewAngle + 6.28;
        if (this.viewAngle > 3.14) this.viewAngle = this.viewAngle - 6.28;

    }

    offScreen() {
        return (this.y > height || this.y < 0 || this.x < 0 || this.x > width);
    }

    update() {
        this.score++;

        this.velocity += this.gravity;
        //this.velocity *= 0.9;
        this.y += this.velocity;
    }

}
