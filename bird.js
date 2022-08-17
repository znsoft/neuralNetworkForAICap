// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Neuro-Evolution Flappy Bird

class Bird {
    constructor(brain) {
        this.y = height / 2;
        this.x = 64;

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
            this.brain = new NeuralNetwork(this.numOfInputs, 50, 2);
        }

    }

    show() {
        stroke(255);
        fill(255, 100);
        ellipse(this.x, this.y, 32, 32);

    }

    showview() { for (point of this.points) line(this.x, this.y, point.x, point.y);}

    up() {
        this.velocity += this.lift;
    }

    mutate() {
        this.brain.mutate(0.1);
    }

    ray(s, pipes, ang) {
        //let s = ang;
        let cos = Math.cos(ang);
        let sin = Math.sin(ang);
        let y2 = this.y ;
        let x2 = width;
        let pipe = pipes[0];
        if (pipe !== undefined) 
        for (pipe of pipes) {
            let wallDist = pipe.x - this.x;
            if (wallDist < 0) continue;
            let ny = wallDist * s;
            let nx = wallDist * 1;

            y2 = this.y + ny;
            x2 = this.x + nx;
            let dy = y2 - pipe.top;
            if (pipe.type == 1) {

                if (dy * dy < pipe.r * pipe.r) {
                //draw radius of
                    /*
                let dx = pipe.x - this.x;
                dy = pipe.top - this.y;
                let a = Math.atan2(s, 1);
                wallDist = Math.sqrt(dx * dx + dy * dy) - pipe.r;

                nx = wallDist * Math.cos(a);
                ny = wallDist * Math.sin(a);

                y2 = this.y + ny;
                x2 = this.x + nx;
                */
                break;
            }
                x2 = width; y2 = (width - this.x) * s + this.y; continue;
                
            }

            let bottom = height - pipe.bottom;

            if (y2 > pipe.top && y2 < bottom ) {
                wallDist += pipe.w;

                 ny = wallDist * s;
                 nx = wallDist * 1;

                y2 = this.y + ny;
                x2 = this.x + nx;

                if (y2 > pipe.top && y2 < bottom ) { x2 = width; y2 = (width - this.x) * s + this.y; continue; }
                let wallDisty = 0;
                if (y2 < pipe.top) wallDisty = pipe.top - this.y ;
                if (y2 > bottom) wallDisty = bottom - this.y;
                nx = wallDisty /s;

                ny = wallDisty * 1;

                y2 = this.y + ny;
                x2 = this.x + nx;

                
            }

            

            break;
            }


        if (x2 > width) { x2 = width; y2 = (width - this.x) * s + this.y;}
        if (y2 > height) { x2 = this.x+(height-this.y)/s; y2 = height; }
        if (y2 < 0) { x2 = this.x - (this.y) / s; y2 = 0; }
        let dx = x2 - this.x;
        let dy = y2 - this.y;
        let dist = (dx * dx + dy * dy) / (width * width + height * height);
        return{ x: x2, y: y2, d: dist };
    }

    sdSphere(x, y, xs,ys, r) {
        let dx = x - xs;
        let dy = y - ys;
        let l = Math.sqrt(dx * dx + dy * dy);
        return l - r;
    }  

 sdBox(x, y, box1x, box1y, w, h) {
        let ax = Math.abs(x - box1x);
        let ay = Math.abs(y - box1y);
        let dx = ax-w;
        let dy = ay - h;
        let l = Math.sqrt(dx * dx + dy * dy);
        return Math.min(Math.max(dx, dy), 0) + l;
    }

 mapObj( x,y , pipes)
{
     let res = Math.min(x, y);
     res = Math.min(res, height - y);
     res = Math.min(res, width - x);
     for (let pipe of pipes) {
         if (pipe.type == 0) {
             let box1x = pipe.x + pipe.w / 2;
             let box1y = pipe.top / 2;
             res = Math.min(this.sdBox(x, y, box1x, box1y, pipe.w, pipe.top), res);
             let box2x = pipe.x + pipe.w / 2;
             let box2y = height - (pipe.bottom / 2);
             res = Math.min(this.sdBox(x, y, box2x, box2y, pipe.w, pipe.bottom), res);
         }
         if (pipe.type == 1) {
             res = Math.min(this.sdSphere(x, y, pipe.x, pipe.top, pipe.r), res);
         }
     }
     return res;

}


castRay( xd,yd,pipes )
{
    let tmin = 1.0;
    let tmax = width;



    let t = tmin;
    for (let i = 0; i < 60; i++ )
    {
        let precis = 0.005 * t;
        let res = this.mapObj(this.x + xd * t,this.y+yd*t,pipes);
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

        return { x: this.x+cos*res, y: this.y+sin*res, d: res };
    }

    think(pipes) {

        // Find the closest pipe
        //let closest = null;
        this.points = [];
        //let xs = this.x
        pipes.sort((a, b) => {
            if (a === undefined || b === undefined) return 0;
            //let x = a.x-this.x;
            if ((a.x + a.w) - this.x < (b.x + b.w) - this.x) {
                return -1;
            }
            return 1;
        });

        let i = this.numOfInputs-3;//two inputs for y velosity and y pos
        let pp = i / 2;
        let inputs = [];
        let d = 1 / pp;
        let a1 = -1;
        //rays
        for (; i--;) {
            let r = this.raypath(pipes, a1 += d)
            //let r = this.ray(a1+=d, pipes,0);
            inputs.push( r.d);
            this.points.push(r);
        }

        inputs.push(this.velocity / 10);
        inputs.push(this.y / height);
        inputs.push(this.x / width);
        //inputs.push(width);

        let output = this.brain.predict(inputs);
        //if (output[0] > output[1] && this.velocity >= 0) {
        if (output[0] > 0.5)//output[1]) {
            this.up();
        //if (output[1] > 0.5)
            this.x += (output[1]-0.5)*10;
        

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
