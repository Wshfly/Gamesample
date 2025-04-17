let tiles = new Array(8).fill(0); // Default values (0 means no sound)
let currentTile = 0;
let synth;
let index = 0;
let isPlaying = false;
let playButton;

function setup() {
  createCanvas(600, 200);
  synth = new p5.Oscillator('sine');
  synth.start();
  synth.amp(0);

  playButton = createButton("Play");
  playButton.position(10, 130);
  playButton.mousePressed(togglePlay);
}

function draw() {
  background(220);

  for (let i = 0; i < 8; i++) {
    fill(getTileColor(tiles[i]));
    stroke(i === currentTile ? 'black' : 'white'); // Outline for selected tile
    strokeWeight(3);
    rect(i * 70 + 10, 50, 60, 60);

    fill(0);
    textAlign(CENTER, CENTER);
    text(tiles[i], i * 70 + 40, 80);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    currentTile = max(0, currentTile - 1);
  } else if (keyCode === RIGHT_ARROW) {
    currentTile = min(7, currentTile + 1);
  } else if (key >= '1' && key <= '8') {
    tiles[currentTile] = int(key); // Store number (1-8)
  }
}

function togglePlay() {
  isPlaying = !isPlaying;
  playButton.html(isPlaying ? "Stop" : "Play");

  if (isPlaying) {
    index = 0;
    playNext();
  }
}

function playNext() {
  if (!isPlaying) return;

  let freq = tiles[index] * 110; // Convert stored number to frequency
  if (tiles[index] > 0) {
    synth.freq(freq);
    synth.amp(0.5, 0.05);
    setTimeout(() => synth.amp(0, 0.1), 200);
  }

  index = (index + 1) % 8;
  setTimeout(playNext, 500);
}

function getTileColor(value) {
  let colors = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'gray'];
  return colors[value] || 'white';
}
