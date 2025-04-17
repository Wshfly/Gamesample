  let tiles = new Array(8).fill(0); // Default values (0 means no sound)
  let currentTile = 0;
  let synth;
  let index = 0;
  let isPlaying = false;
  let playButton;
  let gameState = "instructions";

  function setup() {
    createCanvas(600, 200);
    synth = new p5.Oscillator('sine');
    synth.start();
    synth.amp(0);
  }

  function draw() {
    background(220);

    if (gameState === "instructions") {
      drawInstructions();
    } else if (gameState === "board") {
      drawBoard();
    }
  }

  function drawInstructions() {
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(16);
    text("Arrow keys to Move between tiles", width / 2, 120);
    text("Number keys (1-8): Set tile pitch", width / 2, 150);
    text("Click to start, Press I to view Instructions", width / 2, 180);
  }

  function drawBoard() {
    for (let i = 0; i < 8; i++) {
      fill(getTileColor(tiles[i]));
      stroke(i === currentTile ? 'black' : 'white');
      strokeWeight(3);
      rect(i * 70 + 10, 50, 60, 60);

      fill(0);
      textAlign(CENTER, CENTER);
      text(tiles[i], i * 70 + 40, 80);
      
      playButton = createButton("Play");
      playButton.position(10, 130);
      playButton.mousePressed(togglePlay);
    }
  }

  function mousePressed() {
    if (gameState === "instructions") {
      gameState = "board"; // Switch to main synth program
    }
  }


  function keyPressed() {
    if (keyCode === LEFT_ARROW) {
      currentTile = max(0, currentTile - 1);
    } else if(keyCode === RIGHT_ARROW) {
      currentTile = min(7, currentTile + 1);
    } else if (key >= '0' && key <= '8') {
      tiles[currentTile] = int(key); // Store number (1-8)
    } else if (key === "i") {
      if (gameState === "board") {
        gameState = "instructions"; // Switch to main synth program
      }
    }
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    playButton.html(isPlaying ? "Stop" : "Play");

    if (isPlaying) {
      synth.start(); 
      index = 0;
      playNext();
    } else {
      synth.amp(0, 0.1); // Fade out when stopping
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
    let colors = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'violet', 'gray'];
    return colors[value] || 'white';
  }
