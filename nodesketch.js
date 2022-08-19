// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Neuro-Evolution Flappy Bird

// Part 1: https://youtu.be/c6y21FkaUqw
// Part 2: https://youtu.be/tRA6tqgJBc
// Part 3: https://youtu.be/3lvj9jvERvs
// Part 4: https://youtu.be/HrvNpbnjEG8
// Part 5: https://youtu.be/U9wiMM3BqLU

const MATRIX = require('./neuralnetwork/matrix.js')
var NeuralNetwork = require('./neuralnetwork/nn.js')
const Pipe = require('./pipe.js')
var defbird = require('./defbird.js')
const Bird = require('./bird.js')
const GA = require('./ga.js')

const TOTAL = 500;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;
let div;
let inp;
let loadedJson = null;

function setup() {
    global.width = 1640;
    global.height = 680; 

    for (let i = 0; i < TOTAL; i++) {
        let b = new Bird();
        birds[i] = b;
    }
    //birds.push(new Bird(NeuralNetwork.deserialize(defbird)));

}



function draw() {
        if (counter % 75 == 0) {
            pipes.push(new Pipe());
            console.log(counter);
        }
        counter++;

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].update();

            for (let j = birds.length - 1; j >= 0; j--) {
                if (pipes[i].hits(birds[j])) {
                    savedBirds.push(birds.splice(j, 1)[0]);
                }
            }

            if (pipes[i].offscreen()) {
                pipes.splice(i, 1);
            }
        }

        for (let i = birds.length - 1; i >= 0; i--) {
            if (birds[i].offScreen()) {
                savedBirds.push(birds.splice(i, 1)[0]);
            }
        }

        for (let bird of birds) {
            //if (counter % 8 == 0)
            bird.think(pipes);
            bird.update();
        }

        if (birds.length < 2) {
            if (birds[0] !== undefined) savedBirds.push(birds[0]);
            counter = 0;
            nextGeneration();
            pipes = [];
        }

}


setup();
while(true)draw();
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});

