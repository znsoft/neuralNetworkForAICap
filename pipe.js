// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Neuro-Evolution Flappy Bird

if (typeof global !== 'undefined') {
    var height = global.height;
    var random = Math.random;
    var width = global.width;
}


class Pipe {

    constructor() {
        this.spacing = 100 + random(50);
        this.top = random(1, 7 / 8 * height);
        this.bottom = height - (this.top + this.spacing);
        this.x = width;
        this.r = 17 + random(157);
        this.w = 50 + random(80);
        this.speed = 6 + random(3);
        this.type = (random(10)>5)?0:1;
    }

    hits(bird) {

        if (this.type == 0)
        if (bird.y < this.top || bird.y > height - this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.w) {
                return true;
            }
            }
        if (this.type == 1) {
            let dx = this.x - bird.x;
            let dy = this.top - bird.y;
            let r = dx * dx + dy * dy;
            return r <= this.r * this.r;

        }


        return false;
    }

    show() {
        //return;
        
        //rectMode(CORNER);
        if (this.type == 0) {
            fill(100, 12, 15);
            rect(this.x, 0, this.w, this.top);
            rect(this.x, height - this.bottom, this.w, this.bottom);
        }

        if (this.type == 1) {
            fill(80, 12, 15);
            ellipse(this.x, this.top, this.r*2, this.r*2);
        }
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        if (this.x < -this.w) {
            return true;
        } else {
            return false;
        }
    }
}
if (typeof module !== 'undefined') {
    module.exports = Pipe;
}
