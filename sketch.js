// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Neuro-Evolution Flappy Bird

// Part 1: https://youtu.be/c6y21FkaUqw
// Part 2: https://youtu.be/tRA6tqgJBc
// Part 3: https://youtu.be/3lvj9jvERvs
// Part 4: https://youtu.be/HrvNpbnjEG8
// Part 5: https://youtu.be/U9wiMM3BqLU

const TOTAL = 500;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;
let div;
let inp;
let loadedJson = null;

function keyPressed() {
    if (key === 'S') {
        let bird = birds[0];
        saveJSON(bird.brain, 'bird.json');
    }
    if (key === 'L') {
        //let bird = birds[0];
        loadedJson = loadJSON('bird.json', onloadJson);
        console.log(loadedJson);
    }

}

function onloadJson() {
    birds[0].brain.deserialize(loadedJson);

    text('loaded', 10, 670);
    console.log('loaded bird');
}

function setup() {
    createCanvas(1640, 680);
    slider = createSlider(1, 10, 1);
    div = createDiv('this is some text');
    //div.html = gen+" "+score;
    div.style('font-size', '16px');
    //div.position(10, 0);
    for (let i = 0; i < TOTAL; i++) {
        let b = new Bird();


        birds[i] = b;
    }
    birds.push(new Bird(NeuralNetwork.deserialize(defbird)));

    let inp = createInput('');
    //inp.position(0, 0);
    //inp.size(65535);
    inp.input(myInputEvent);
}

function myInputEvent() {
    console.log('you are typing: ', this.value());
    birds[0].brain = NeuralNetwork.deserialize(this.value());
    birds.push(new Bird(NeuralNetwork.deserialize(this.value())));
    console.log('loaded: ', birds[0].brain.serialize());
}


function draw() {
    div.html("gen:" + gen + " hiscore:" + score + " birds:" + birds.length);


    for (let n = 0; n < slider.value(); n++) {
        if (counter % 75 == 0) {
            pipes.push(new Pipe());
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

        if (birds.length === 0) {
            counter = 0;
            nextGeneration();
            pipes = [];
        }
    }

    // All the drawing stuff
    background(0);

    for (let bird of birds) {
        bird.show();

    }
    birds[0].showview();
    for (let pipe of pipes) {
        pipe.show();
    }
}

// function keyPressed() {
//   if (key == ' ') {
//     bird.up();
//     //console.log("SPACE");
//   }
// }
