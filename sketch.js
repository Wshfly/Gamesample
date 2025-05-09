let playerHealth = 100;
let enemyHealth = 100;
let playerTurn = true;
let attackButtons = [];
let lastHiddenButton = null;
let enemyButtons = [];

const maxHealth = 100;
const potionMaxCooldown = 3;
const specialMaxCooldown = 5;
const poisonBaseDamage = 5;

let playerPotionTurns = potionMaxCooldown;
let enemyPotionTurns = potionMaxCooldown;
let playerSpecialTurns = specialMaxCooldown;
let enemySpecialTurns = specialMaxCooldown;

let playerPoisonTurns = 0;
let enemyPoisonTurns = 0;
let enemySick = false;
let playerSick = false;
let playerPoisonDamage = poisonBaseDamage;
let enemyPoisonDamage = poisonBaseDamage;
let accuracyModifier = 1;
let slime = 1;

let playerFlash = 0;
let enemyFlash = 0;
let shakeFrames = 0;
let criticalFlashFrames = 0;

let healSparkles = [];
let particles = [];
let floatTexts = [];
let explosions = [];

let winScreen = false;
let gameState = "start";

let actionText = "";
let potionButton;
let startButton, restartButton;

let turnLog = [];
let logBox;

let effectButtons = [];
let currentEffectAttack = null;

let attacks = [
  { name: "Light", damage: [5, 15], hitChance: 1 },
  { name: "Heavy", damage: [10, 20], hitChance: 0.75 },
  { name: "Special", damage: [15, 30], hitChance: 0.5, special: true },
];

let enemyAttacks = [
  { name: "Test", damage: [5, 15], hitChance: 0.9 },
  { name: "Test2", damage: [5, 15], hitChance: 0.9 },
  { name: "Test3", damage: [5, 15], hitChance: 0.9 },
  { name: "Test4", damage: [5, 15], hitChance: 0.9 },
  { name: "Heavy", damage: [1,2], hitChance: 1 },

 
 
  //slime attacks
  { name: "Slime", damage: [5, 10], hitChance: 1},
  { name: "Ooze", damage: [12, 18], hitChance: 0.8},
  { name: "Crush", damage: [10, 30], hitChance: 0.6},
  { name: "Devour", damage: [10, 10], hitChance: 1, special: true},

 
  //

  { name: "Special", damage: [15, 30], hitChance: 0.5, special: true },
];



function setup() {
  createCanvas(600, 600);
  setupUI();
}

function setupUI() {
  for (let i = 0; i < attacks.length; i++) {
	let btn = createButton(attacks[i].name);
	btn.position(60, 360 + i * 60);
	btn.size(100, 40);
	btn.mousePressed(() => showEffectButtons(attacks[i], btn));
	attackButtons.push(btn);
  }

  potionButton = createButton("Potion");
  potionButton.position(60, 540);
  potionButton.size(100, 40);
  potionButton.mousePressed(playerUsePotion);

  startButton = createButton("Play");
  startButton.position(width / 2 - 50, height / 2 + 20);
  startButton.size(100, 40);
  startButton.mousePressed(() => {
	gameState = "selection";
	resetGame();
	startButton.hide();
  });

  selectButton = createButton("Play");
  selectButton.position(width / 2 - 50, height / 2 + 20);
  selectButton.size(100, 40);
  selectButton.mousePressed(() => {
    selectedEnemy = enemytype["test"];
  enemyHealth = selectedEnemy.health;
	gameState = "battle";
	resetGame();
	selectButton.hide();
  });

  restartButton = createButton("Play Again");
  restartButton.position(width / 2 - 50, height / 2 + 50);
  restartButton.size(100, 40);
  restartButton.mousePressed(() => {
	gameState = "battle";
	resetGame();
	restartButton.hide();
  });

  logBox = createDiv();
  logBox.position(300, 360);
  logBox.size(280, 180);
  logBox.style("background", "#bbbbbb");
  logBox.style("padding", "10px");
  logBox.style("border", "1px solid #aaa");
  logBox.style("overflow-y", "scroll");
  logBox.style("font-family", "monospace");
  logBox.style("font-size", "12px");
}

function draw() {
  background(220);

  if (gameState === "start") {
	drawStartScreen();
	return;
  }

  if (gameState === "selection") {
	drawSelectScreen();
	return;
  }

  if (gameState === "end") {
	drawEndScreen();
	return;
  }

  if (shakeFrames > 0) {
	translate(random(-5, 5), random(-5, 5));
	shakeFrames--;
  }

  // // Cure poison + reset poison ramping
  // if (enemyPoisonTurns > 0 || enemySick) {
  //   logTurn("Player is cured of poison and sickness!");
  //   enemyPoisonDamage = 0;
  //   enemySick = false;
  //   enemyPoisonDamagePoisonDamage = poisonBaseDamage;
  // }

  fill(0);
  textSize(20);
  textAlign(CENTER);
  text(playerTurn ? "Player's Turn" : "Enemy's Turn", width / 2, 40);

  drawHealthBar(50, 100, 200, playerHealth, maxHealth, "Player", true, playerPoisonTurns, playerSick);
  drawHealthBar(width - 250, 100, 200, enemyHealth, selectedEnemy.health, selectedEnemy.name, false, enemyPoisonTurns, enemySick);

  drawConsole();
  drawSparkles();
  drawParticles();
  drawFloatTexts();
  drawExplosions();

  updateAttackButtonState();

  if (criticalFlashFrames > 0) {
	fill(255, 0, 0, 100);
	rect(0, 0, width, height);
	criticalFlashFrames--;
  }

  if (actionText) {
	fill(0);
	textSize(18);
	text(actionText, width / 2, height / 2);
  }
}

function drawStartScreen() {
  background(30, 60, 150);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Turn-Based Battle", width / 2, height / 2 - 60);
  startButton.show();
  restartButton.hide();
  selectButton.hide();
  logBox.hide();
  attackButtons.forEach((btn) => btn.hide());
  potionButton.hide();
}

function drawSelectScreen() {
  background(30, 60, 150);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Choose an Enemy", width / 2, height / 2 - 100);

  startButton.hide();
  selectButton.hide();
  restartButton.hide();
  logBox.hide();
  attackButtons.forEach((btn) => btn.hide());
  potionButton.hide();

  if (enemyButtons.length === 0) {
    let i = 0;
    for (let key in enemytype) {
      let enemy = enemytype[key];
      let btn = createButton(enemy.name);
      btn.position(width / 2 - 50, height / 2 - 40 + i * 50);
      btn.size(120, 40);
      btn.mousePressed(() => {
        selectedEnemy = enemy;
        enemyHealth = selectedEnemy.health;
        resetGame();
        gameState = "battle";
        // Remove buttons after selection
        enemyButtons.forEach(b => b.remove());
        enemyButtons = [];
      });
      enemyButtons.push(btn);
      i++;
    }
  }
}

function drawEndScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text(winScreen ? "You Win!" : "You Lose!", width / 2, height / 2 - 50);
  restartButton.show();
  startButton.show();
  selectButton.hide();
  logBox.hide();
  attackButtons.forEach((btn) => btn.hide());
  potionButton.hide();
}

function resetGame() {
  playerHealth = 100;
  if (selectedEnemy) enemyHealth = selectedEnemy.health;
  playerTurn = true;
  playerPotionTurns = potionMaxCooldown;
  enemyPotionTurns = potionMaxCooldown;
  playerSpecialTurns = specialMaxCooldown;
  enemySpecialTurns = specialMaxCooldown;
  playerPoisonTurns = 0;
  enemyPoisonTurns = 0;
  playerSick = false;
  enemySick = false;
  playerPoisonDamage = poisonBaseDamage;
  actionText = "";
  explosions = [];
  floatTexts = [];
  healSparkles = [];
  startButton.hide();

  turnLog = [];
  logBox.html("");
  logBox.show();

  attackButtons.forEach((btn) => btn.show());
  potionButton.show();
  clearEffectButtons();
}

function keyPressed() {
  if (!playerTurn || gameState !== "battle") return;

  switch (key) {
    case 'w':
      playerAttack(attacks[0], "Hammer");
      break;
    case 'a':
      playerAttack(attacks[0], "Scalpel");
      break;
    case 's':
      playerAttack(attacks[1], "Burn");
      break;
    case 'd':
      playerAttack(attacks[1], "Poison");
      break;
    case 'f':
      playerAttack(attacks[2], "Infect");
      break;
    case 'g':
      playerAttack(attacks[2], "Malpractice");
      break;
    case ' ':
      playerUsePotion();
      break;
  }
}

function showEffectButtons(attack, button) {
  if (!playerTurn) return;

  // Re-show previously hidden button
  if (lastHiddenButton && lastHiddenButton !== button) {
	lastHiddenButton.show();
  }

  currentEffectAttack = attack;
  clearEffectButtons();

  button.hide(); // hide the current button
  lastHiddenButton = button; // track it

  let choices = [];
  if (attack.name === "Heavy") choices = ["Burn", "Poison"];
  else if (attack.name === "Light") choices = ["Hammer", "Scalpel"];
  else if (attack.name === "Special") choices = ["Infect", "Malpractice"];

  for (let i = 0; i < choices.length; i++) {
	let effBtn = createButton(choices[i]);
	effBtn.position(button.x + i * 110, button.y);
	effBtn.size(100, 40);
	effBtn.mousePressed(() => {
  	logTurn(`player ➜ ${attack.name.toLowerCase()} ➜ ${choices[i]}`);
  	button.show(); // make sure it comes back
  	lastHiddenButton = null;
  	clearEffectButtons();
  	playerAttack(attack, choices[i]);
	});
	effectButtons.push(effBtn);
  }
}

function clearEffectButtons() {
  for (let b of effectButtons) b.remove();
  effectButtons = [];
}

function updateAttackButtonState() {
  for (let i = 0; i < attackButtons.length; i++) {
	let attack = attacks[i];
	attackButtons[i].elt.disabled =
  	!playerTurn ||
  	(attack.special && playerSpecialTurns < specialMaxCooldown);
  }
  potionButton.elt.disabled =
	!playerTurn || playerPotionTurns < potionMaxCooldown;
}

function playerAttack(attack, effect) {
  if (
	!playerTurn ||
	(attack.special && playerSpecialTurns < specialMaxCooldown)
  )
	return;

  let hit = random() < attack.hitChance * accuracyModifier;
  let dmg = 0;
  let attackText = `You used ${attack.name}`;

  if (hit) {
	dmg = int(random(attack.damage[0], attack.damage[1]));
	if (effect === "Scalpel") dmg += 5;
	if (enemySick) dmg += 5;

	enemyHealth = max(0, enemyHealth - dmg);
	addFloatText("-" + dmg, width - 200, 90, [255, 0, 0]);
	enemyFlash = 5;
	shakeFrames = 10;
	if (dmg === attack.damage[1]) criticalFlashFrames = 10;

	if (effect === "Poison") applyPoison("enemy", 3);
	if (effect === "Burn") applyPoison("enemy", 2);

	if (effect === "Infect") {
  	enemySick = true;
  	logTurn("Enemy is infected!");
  	let infectDmg = int(random(20, 31));
  	enemyHealth = max(0, enemyHealth - infectDmg);
  	addFloatText("-" + infectDmg + " (Infected!)", width - 200, 70, [
    	200,
    	100,
    	255,
  	]);
  	enemyFlash = 5;
  	shakeFrames = 10;

  	if (enemyHealth <= 0) {
    	triggerExplosion(width - 200, 100);
    	logTurn("You Win!");
    	setTimeout(() => {
      	winScreen = true;
      	gameState = "end";
    	}, 800); // Wait 800ms for effects to play
    	return;
  	}
	}
  } else {
	attackText += " (Missed!)";
  }

  if (attack.special) playerSpecialTurns = 0;

  actionText = attackText;
  logTurn("Player: " + actionText);
  playerTurn = false;

  applyPoisonTick("enemy");

  setTimeout(() => {
	playerPotionTurns = min(playerPotionTurns + 1, potionMaxCooldown);
	playerSpecialTurns = min(playerSpecialTurns + 1, specialMaxCooldown);

	if (enemyHealth <= 0) {
  	winScreen = true;
  	gameState = "end";
  	triggerExplosion(width - 200, 100);
  	logTurn("You Win!");
  	return;
	}

	enemyTurn();
  }, 2000);
}

function playerUsePotion() {
  if (!playerTurn || playerPotionTurns < potionMaxCooldown) return;
  if (playerHealth >= maxHealth) {
	actionText = "You have full health!";
	logTurn("Player: " + actionText);
	return;
  }

  let healAmount = min(30, maxHealth - playerHealth);
  playerHealth += healAmount;
  addFloatText("+" + healAmount, 150, 90, [0, 255, 0]);
  playerFlash = 5;
  addSparkles(150, 90);
  playerPotionTurns = 0;

  // Cure poison + reset poison ramping
  if (playerPoisonTurns > 0 || playerSick) {
	logTurn("Player is cured of poison and sickness!");
	playerPoisonTurns = 0;
	playerSick = false;
	playerPoisonDamage = poisonBaseDamage;
  }

  actionText = "You used a Potion!";
  logTurn("Player: " + actionText);
  playerTurn = false;

  setTimeout(() => {
	playerPotionTurns = min(playerPotionTurns + 1, potionMaxCooldown);
	playerSpecialTurns = min(playerSpecialTurns + 1, specialMaxCooldown);
	enemyTurn();
  }, 2000);
}

function applyPoisonTick(target) {
  let isPlayer = target === "player";
  let turns = isPlayer ? playerPoisonTurns : enemyPoisonTurns;
  let damage = isPlayer ? playerPoisonDamage : enemyPoisonDamage;

  if (turns > 0) {
	if (isPlayer) {
  	playerHealth = max(0, playerHealth - damage);
  	playerPoisonTurns--;
  	playerPoisonDamage += 2;
  	playerFlash = 5;
  	addFloatText(`-${damage} (Poison)`, 150, 70, [100, 255, 100]);
  	logTurn("Player takes poison damage!");
	} else {
  	enemyHealth = max(0, enemyHealth - damage);
  	enemyPoisonTurns--;
  	enemyPoisonDamage += 2;
  	enemyFlash = 5;
  	addFloatText(`-${damage} (Poison)`, width - 200, 70, [100, 255, 100]);
  	logTurn("Enemy takes poison damage!");
	}

	if (playerHealth <= 0 || enemyHealth <= 0) {
  	gameState = "end";
  	winScreen = !isPlayer;
  	triggerExplosion(isPlayer ? 150 : width - 200, 100);
  	logTurn(winScreen ? "You Win!" : "You Lose!");
	}
  }
}

function enemyTurn() {
  if (enemyHealth <= 0 || playerHealth <= 0) return;
  	applyPoisonTick("player");
  //Enemy 2
    
 
  let options = [...selectedEnemy.moves];
  if (enemySpecialTurns >= specialMaxCooldown && selectedEnemy.specialMove) {
    options.push(selectedEnemy.specialMove);
  }
    
	//if (enemySpecialTurns >= specialMaxCooldown) options.push("Special");
	if (enemyPotionTurns >= potionMaxCooldown) options.push("Potion");

	let choice = random(options);
	let attack = enemyAttacks.find((a) => a.name === choice);
	let text = `Enemy used ${choice}!`;

	if (choice === "Potion") {
  	if (enemyHealth >= maxHealth) {
    	text = "Enemy tried to heal but is already at full health!";
  	} else {
    	let healAmount = min(30, maxHealth - enemyHealth);
    	enemyHealth += healAmount;
    	enemyPotionTurns = 0;
    	enemySick = false;
    	addFloatText("+" + healAmount, width - 200, 90, [0, 255, 0]);
    	addSparkles(width - 200, 90);
    	text = "Enemy used Potion!";
  	}
	} else {
  	let hit = random() < attack.hitChance;
  	if (hit) {
    	let dmg = int(random(attack.damage[0], attack.damage[1]));
    	if (enemySick) dmg = int(dmg * 0.75);
    	if (choice === "Devour") dmg *= slime;
    	playerHealth = max(0, playerHealth - dmg);
    	addFloatText("-" + dmg, 150, 90, [255, 0, 0]);
    	playerFlash = 5;
    	shakeFrames = 10;
    	if (dmg === attack.damage[1]) criticalFlashFrames = 10;
    	if (choice === "Slime") slime ++;
    	if (choice === "Ooze") slime ++;
    	if (choice === "Crush") slime ++;
    	if (choice === "Heavy") applyPoison("player", 3);
    	if (choice === "Special") {
      	let infectDmg = int(random(20, 31));
      	playerHealth = max(0, playerHealth - infectDmg);
      	playerSick = true;
      	addFloatText("-" + infectDmg + " (Infected!)", 150, 70, [
        	200,
        	100,
        	255,
      	]);
      	playerFlash = 5;
    	}
  	} else {
    	text += " (Missed!)";
  	}
  	//changed to "Devour" for test, rewrite so it can be universal with special moves, probably attack.special === true or some shit
  	if (choice === "Devour") enemySpecialTurns = 0, slime = 1;
	}

	enemyPotionTurns = min(enemyPotionTurns + 1, potionMaxCooldown);
	enemySpecialTurns = min(enemySpecialTurns + 1, specialMaxCooldown);

	actionText = text;
	logTurn("Enemy: " + text);
	attackButtons.forEach((btn) => btn.show());
	playerTurn = true;

	if (playerHealth <= 0) {
  	triggerExplosion(150, 100);
  	logTurn("You Lose!");
  	setTimeout(() => {
    	winScreen = false;
    	gameState = "end";
  	}, 800);
	}
}

function applyPoison(target, turns) {
  if (target === "enemy") {
	if (enemyPoisonTurns > 0) return; // already poisoned
	enemyPoisonTurns = turns;
	enemyPoisonDamage = poisonBaseDamage;
	logTurn("Enemy is poisoned!");
  } else if (target === "player") {
	if (playerPoisonTurns > 0) return; // already poisoned
	playerPoisonTurns = turns;
	playerPoisonDamage = poisonBaseDamage;
	logTurn("Player is poisoned!");
  }
}

function drawHealthBar(x, y, w, hp, maxHp, label, isPlayer, poisonTurns, isSick) {
  let healthRatio = constrain(hp / maxHp, 0, 1);
  let healthColor = lerpColor(color(255, 0, 0), color(0, 255, 0), healthRatio);

  // Sick enemy tint
  if (!isPlayer && isSick && frameCount % 20 < 10) {
	fill(100, 255, 100);
  } else if ((isPlayer && playerFlash > 0) || (!isPlayer && enemyFlash > 0)) {
	fill(255);
	if (isPlayer) playerFlash--;
	else enemyFlash--;
  } else {
	fill(healthColor);
  }

  noStroke();
  rect(x, y, w * healthRatio, 20);
  stroke(0);
  noFill();
  rect(x, y, w, 20);

  fill(0);
  textAlign(isPlayer ? LEFT : RIGHT);
  text(label, isPlayer ? x : x + w, y - 10);

  // Draw status icons
  let iconX = isPlayer ? x + w + 10 : x - 25;
  let iconY = y + 5;
  if (poisonTurns > 0) {
	fill(0, 200, 0);
	ellipse(iconX, iconY, 10);
  }
  if (isSick) {
	fill(150, 0, 150);
	textSize(14);
	text("☠", iconX, iconY + 4);
  }
}

function addSparkles(x, y) {
  for (let i = 0; i < 15; i++) {
	healSparkles.push({
  	x: x + random(-20, 20),
  	y: y + random(-10, 10),
  	size: random(4, 8),
  	alpha: 255,
	});
  }
}

function drawSparkles() {
  for (let i = healSparkles.length - 1; i >= 0; i--) {
	let s = healSparkles[i];
	fill(255, 255, 0, s.alpha);
	noStroke();
	ellipse(s.x, s.y, s.size);
	s.y -= 0.3;
	s.alpha -= 4;
	if (s.alpha <= 0) healSparkles.splice(i, 1);
  }
}

function drawParticles() {}

function addFloatText(text, x, y, color = [0, 0, 0]) {
  floatTexts.push({ text, x, y, alpha: 255, color });
}

function drawFloatTexts() {
  textSize(16);
  textAlign(CENTER);
  for (let i = floatTexts.length - 1; i >= 0; i--) {
	let t = floatTexts[i];
	fill(t.color[0], t.color[1], t.color[2], t.alpha);
	text(t.text, t.x, t.y);
	t.y -= 0.5;
	t.alpha -= 3;
	if (t.alpha <= 0) floatTexts.splice(i, 1);
  }
}

function drawExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
	let e = explosions[i];
	fill(255, 0, 0, e.alpha);
	noStroke();
	ellipse(e.x, e.y, e.size);
	e.size += 5;
	e.alpha -= 15;
	if (e.alpha <= 0) explosions.splice(i, 1);
  }
}

function triggerExplosion(x, y) {
  explosions.push({ x, y, size: 10, alpha: 255 });
}

function drawConsole() {
  fill(180);
  rect(0, 350, width, height - 350);
  stroke(0);
  noFill();
  rect(0, 350, width, height - 350);

  drawCooldownBar(
	attackButtons[2].x + 110,
	attackButtons[2].y + 10,
	120,
	10,
	playerSpecialTurns / specialMaxCooldown
  );
  drawCooldownBar(
	potionButton.x + 110,
	potionButton.y + 10,
	120,
	10,
	playerPotionTurns / potionMaxCooldown
  );
}

function drawCooldownBar(x, y, w, h, progress) {
  noStroke();
  fill(200);
  rect(x, y, w, h);
  fill(progress >= 1 ? color(0, 255, 0) : color(255, 0, 0));
  rect(x, y, w * constrain(progress, 0, 1), h);
  stroke(0);
  noFill();
  rect(x, y, w, h);
}

function logTurn(text) {
  let formatted = text
	.replace(
  	"Player:",
  	`<span style="color:#007700;"><strong>Player:</strong></span>`
	)
	.replace(
  	"Enemy:",
  	`<span style="color:#880000;"><strong>Enemy:</strong></span>`
	);

  if (text.includes("(Missed!)")) {
	formatted = `<em style="color: #444;">${formatted}</em>`;
  }

  if (text.includes("!") && text.includes("damage")) {
	formatted = `<span style="color: #ffcc00;"><strong>${formatted}</strong></span>`;
  }

  if (text.includes("You Win") || text.includes("You Lose")) {
	formatted = `<span style="color: white; background: black; padding: 2px 5px;"><strong>${text}</strong></span>`;
  }

  turnLog.push(formatted);
  if (turnLog.length > 50) turnLog.shift();

  logBox.html(turnLog.join("<br>"));
  logBox.elt.scrollTop = logBox.elt.scrollHeight;
}
