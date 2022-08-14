// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Neuro-Evolution Flappy Bird

class Pipe {

    constructor() {
        this.spacing = 100 + random(50);
        this.top = random(height / 6, 3 / 4 * height);
        this.bottom = height - (this.top + this.spacing);
        this.x = width;
        this.r = 26 + random(50);
        this.w = 70 + random(50);
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
        //fill(255);
        //rectMode(CORNER);
        if (this.type == 0) {
            rect(this.x, 0, this.w, this.top);
            rect(this.x, height - this.bottom, this.w, this.bottom);
        }

        if (this.type == 1) {
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
