// Major Project Assignment
// Katos Booth
// November 21st 2024

const GRID_SEED = 327147;

class theMaze {
  constructor(cols, rows, seed){
    this.cols = cols;
    this.rows = rows;
    this.seed = seed;
    this.randomSeed = this.seedTheNumber(seed);
    this.grid = Array.from({length:rows}, () => Array(cols).fill(IMPASSIBLE));
    this.generateBaseMaze;
  }

  seedTheNumber(seed){
    let value = seed;
    return ()=>{
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  generateBaseMaze(){
    const centerX = Math.floor(this.rows / 2);
    const centerY = Math.floor(this.cols / 2);
    for (let y = 0; y < this.rows; y++){
      for (let x = 0; x < this.cols; x++){
        if (y % 2 === 0 || x % 2 === 0){
          this.grid[y][x] = IMPASSIBLE;
        }
        else if (this.randomSeed() > 0.5){
          this.grid[y][x] = OPEN_TILE;
        }
      }
    }
    //spawn box
    for (let y = centerY - 1; y <= centerY+1; y++){
      for (let x = centerX - 1; x <= centerX + 1; x++){
        this.grid[y][x] = OPEN_TILE;
      }
    }
    this.reflectHorizontally();
  }

  reflectHorizontally(){
    const midX = Math.floor(this.cols / 2);
    for (let y = 0; y < this.rows; y++){
      for (let x = 0; x < midX; x++){
        this.grid[y][this.cols - x - 1] = this.grid[y][x];
      }
    }
  }

  generateNewChunk(offsetX, offsetY){
    for (let y = offsetY; y < offsetY + MAZE_SIZE; y++){
      for (let x = offsetX; x < offsetX + MAZE_SIZE; x++){
        if (y % 2 === 0|| x % 2 === 0){
          this.grid[y][x] = IMPASSIBLE;
        }
        else if (this.randomSeed() > 0.5){
          this.grid[y][x] = OPEN_TILE;
        }
        else {
          this.grid[y][x] = OPEN_TILE;
        }
      }
    }
    for (let y = offsetY; y < offsetY + MAZE_SIZE; y++){
      const  midX = offsetX + Math.floor(MAZE_SIZE / 2);
      for (let x = offsetX; x < midX; x++){
        this.grid[y][2 * midX - x - 1] = this.grid[y][x];
      }
    }
    for (let y = offsetY; y < offsetY + MAZE_SIZE; y++){
      this.grid[y][offsetX] = OPEN_TILE;
    }
    for (let x = offsetX; x < offsetX + MAZE_SIZE; x++){
      this.grid[offsetY][x] = OPEN_TILE;
    }
  }
  
  //expands the maze depending on direction
  expand(direction){
    if (direction === "right"){
      this.expandRight();
    }
    else if (direction === "down"){
      this.expandDown();
    }
    else if (direction === "left"){
      this.expandLeft();
    }
    else if (direction === "up") {
      this.expandUp();
    }
  }
  
  expandRight(){
    for (let row of this.grid){
      row.push(...Array(MAZE_SIZE).fill(IMPASSIBLE));
    }
    this.cols += MAZE_SIZE;
    this.generateNewChunk(this.cols - MAZE_SIZE, 0, "horizontal");
  }
  expandDown(){
    const newRows = Array.from({"length": MAZE_SIZE}, () => Array(this.cols).fill(IMPASSIBLE));
    this.grid.push(...newRows);
    this.rows += MAZE_SIZE;
    this.generateNewChunk(0, this.rows - MAZE_SIZE, "vertical");
  }
  expandLeft(){
    const newCols = Array.from({"length": MAZE_SIZE}, () => Array(this.rows).fill(IMPASSIBLE));
    for (let row of this.grid){
      row.shift(...newCols);
    }
    this.cols += MAZE_SIZE;
    this.generateNewChunk(this.cols + MAZE_SIZE, 0, "horizontal");
  }
  expandUp(){
  }

  
  display(offsetX, offsetY){
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const screenX = x * cellSize - offsetX;
        const screenY = y * cellSize - offsetY;
        if (screenX > 0 - cellSize && screenX < width && screenY > 0 - cellSize && screenY < height){
          if (this.grid[y][x] === IMPASSIBLE && this.grid[y][x+1] !== IMPASSIBLE){
            stroke(0, 0, 255);
            fill(0, 0, 255);
            square(screenX, screenY, cellSize);
          }
          if (this.grid[y][x] === IMPASSIBLE && this.grid[y][x+1] === IMPASSIBLE){
            stroke(0, 255, 0, 128);
            fill(0, 255, 0, 128);
            rect(screenX, screenY, cellSize, cellSize);
          }
        }
      }
    }
  }
}

class thePlayer {
  constructor(playerX, playerY){
    this.x = playerX;
    this.y = playerY;
    this.speed = 0.15;
  }
  
  movePlayer(){
    if (PacManMoveState === 1){ //up
      this.y -= this.speed;
    }
    else if (PacManMoveState === 2){ //left
      this.x -= this.speed;
    }
    else if (PacManMoveState === 3){ //down
      this.y += this.speed;
    }
    else if (PacManMoveState === 4){ //right
      this.x += this.speed;
    }
    inputsForGame();
  }
  
  displayPlayer(){
    if (PacManMoveState === 0){
      image(defaultPacManSprite, width / 2, height / 2, cellSize, cellSize);
    }
    else if (PacManMoveState === 1){
      image(upPacManSprite, width / 2, height / 2, cellSize, cellSize);
    }
    else if (PacManMoveState === 2){
      image(leftPacManSprite, width / 2, height / 2, cellSize, cellSize);
    }
    else if (PacManMoveState === 3){
      image(downPacManSprite, width / 2, height / 2, cellSize, cellSize);
    }
    else if (PacManMoveState === 4){
      image(rightPacManSprite, width / 2, height / 2, cellSize, cellSize);
    }
  }
}

class ghost{
  constructor(ghostX, ghostY){
    this.x = ghostX;
    this.y = ghostY;
    this.speed = 0.15;
  }
  moveGhost(){
    //Base position
    this.x = -cameraOffsetX;
    this.y = -cameraOffsetY;
  }
  displayGhost(){
    if (ghostMoveState === 0){
      image(defaultGhostSprite, this.x, this.y, cellSize, cellSize);
      image(defaultGhostEyesSprite, this.x, this.y, cellSize, cellSize);
    }
    else if (ghostMoveState === 1){
      image(upGhostSprite, this.x, this.y, cellSize, cellSize);
      image(upGhostEyesSprite, this.x, this.y, cellSize, cellSize);
    }
    if (ghostMoveState === 2){
      image(leftGhostSprite, this.x, this.y, cellSize, cellSize);
      image(leftGhostEyesSprite, this.x, this.y, cellSize, cellSize);
    }
    else if (ghostMoveState === 3){
      image(downGhostSprite, this.x, this.y, cellSize, cellSize);
      image(downGhostEyesSprite, this.x, this.y, cellSize, cellSize);
    }
    else if (ghostMoveState === 4){
      image(rightGhostSprite, this.x, this.y, cellSize, cellSize);
      image(rightGhostEyesSprite, this.x, this.y, cellSize, cellSize);
    }
  }
}

let maze;
let cellSize;

const MAZE_SIZE = 25;

//visual grid size for the amount of blocks will be seen on screen
let gridSize = MAZE_SIZE;

//Display grid size variables
let displayGridX;
let displayGridY;

//freeze variable for when the game pauses or when the player kills a ghost
let freezeGame = 0;

//grid states
const OPEN_TILE = 0;
const IMPASSIBLE = 1;

//player variables
// let thePlayer = {
//   x:0,
//   y:0,
//   speed: 0.15,
//   spawnPositionX: 0,
//   spawnPositionY: 0,
//   spawnBox: 0,
//   nextMove: 0,
// };

let cameraOffsetX = 0;
let cameraOffsetY = 0;
  
let player;
  
let ghostsArray = [];

//the state for the players movement
let PacManMoveState = 0;
let ghostMoveState = 0;
let ghostState = 0;

let defaultPacManSprite;
let rightPacManSprite;
let downPacManSprite;
let leftPacManSprite;
let upPacManSprite;

let defaultGhostSprite;
let upGhostSprite;
let rightGhostSprite;
let downGhostSprite;
let leftGhostSprite;
let defaultGhostEyesSprite;
let upGhostEyesSprite;
let rightGhostEyesSprite;
let downGhostEyesSprite;
let leftGhostEyesSprite;

//the state for the screen
let screenState = 1;

function preload(){
  //loads the sprites
  defaultPacManSprite = loadImage("images/pacman/pacman-default.png"); 
  rightPacManSprite = loadImage("images/pacman/pacman-right.gif"); 
  downPacManSprite = loadImage("images/pacman/pacman-down.gif");
  leftPacManSprite = loadImage("images/pacman/pacman-left.gif"); 
  upPacManSprite = loadImage("images/pacman/pacman-up.gif");
  
  defaultGhostSprite = loadImage("images/ghost/ghost_default.png");
  upGhostSprite = loadImage("images/ghost/ghost_up.gif");
  rightGhostSprite = loadImage("images/ghost/ghost_right.gif");
  downGhostSprite = loadImage("images/ghost/ghost_down.gif"); 
  leftGhostSprite = loadImage("images/ghost/ghost_left.gif");
  defaultGhostEyesSprite = loadImage("images/ghost/ghost_eyes_default.png");
  upGhostEyesSprite = loadImage("images/ghost/ghost_eyes_up.png"); 
  rightGhostEyesSprite = loadImage("images/ghost/ghost_eyes_right.png");
  downGhostEyesSprite = loadImage("images/ghost/ghost_eyes_down.png"); 
  leftGhostEyesSprite = loadImage("images/ghost/ghost_eyes_left.png"); 
}

function setup() {
  frameRate(60);
  
  //creates the screen
  createCanvas(windowWidth, windowHeight);
  
  //makes cellSize scale to the height of the screen
  cellSize = height/gridSize;
  
  //creates the spawn position for pac man
  
  maze = new theMaze(MAZE_SIZE, MAZE_SIZE, GRID_SEED);
  maze.generateBaseMaze();
  player = new thePlayer(Math.round(MAZE_SIZE / 2),Math.round(MAZE_SIZE / 2));
  ghostsArray.push(new ghost(0, 0));
  
  imageMode(CENTER);

  noSmooth();
  background(0);
}

//Detect when the window is resized to update certain stuff so it wont look bugged
function windowResized(){
  createCanvas(windowWidth, windowHeight);
  noSmooth();
}

function draw() {
  
  displayGridX = width/cellSize;
  displayGridY = height/cellSize;
  
  screenController();
}

//Controls which screen is allowed to be visible
function screenController(){
  if (screenState === 1){
    displayGameScreen();
  }
  else {
    displayMainScreen();
  }
}

//Displays the game screen
function displayGameScreen(){
  background(0);
  maze.display(cameraOffsetX, cameraOffsetY);
  player.movePlayer();
  player.displayPlayer();
  ghostsArray[0].displayGhost();
  ghostsArray[0].moveGhost(cameraOffsetX, cameraOffsetY);
  cellSize = height/gridSize;
  cameraOffsetX = player.x * cellSize - width /2;
  cameraOffsetY = player.y * cellSize - height /2;
  checkMazeExpansion();
  touchInputs();
}

//Displays the main screen
function displayMainScreen(){
  fill(0,0,255);
  rect(width/2,height/2, 50, 50);
  background(0);
}

function checkMazeExpansion(){
  const threshold = 3;
  if (player.y > maze.rows - threshold){
    maze.expand("down");
  }
  if (player.x > maze.cols - threshold){
    maze.expand("right");
  }
}

function createPlayer(){
  displayPlayer();
  movePlayer();
}

//Detects the grid collision
function playerGridCollision(x, y) {
  if (maze.grid[Math.round(y)-1][Math.round(x - 0.45)] === IMPASSIBLE){ //up
    player.y = Math.round(player.y)+0.5;

    //these are used to show the detection of collision
    //square(width/2 - cellSize/8, height/2 - cellSize/2, cellSize/4);
  }
  if (maze.grid[Math.round(y)][Math.round(x - 0.45)] === IMPASSIBLE){ //down
    player.y = Math.round(player.y)-0.5;
    //square(width/2 - cellSize/8, height/2 + cellSize/2 - cellSize/4, cellSize/4);
  }
  if (maze.grid[Math.round(y - 0.45)][Math.round(x)-1] === IMPASSIBLE){ //left
    player.x = Math.round(player.x)+0.5;
    //square(width/2 - cellSize/2, height/2 - cellSize/8, cellSize/4);
  }
  if (maze.grid[Math.round(y - 0.45)][Math.round(x)] === IMPASSIBLE){ //right
    player.x = Math.round(player.x)-0.5;
    //square(width/2 + cellSize/2 - cellSize/4, height/2 - cellSize/8, cellSize/4);
  }
}

//Get the inputs for the game
function inputsForGame(){
  if (keyIsDown(38) === true || keyIsDown(87) === true){ //up
    PacManMoveState = 1;
  }
  if (keyIsDown(37) === true || keyIsDown(65) === true){ //left
    PacManMoveState = 2;
  }
  if (keyIsDown(40) === true || keyIsDown(83) === true){ //down
    PacManMoveState = 3;
  }
  if (keyIsDown(39) === true || keyIsDown(68) === true){ //right
    PacManMoveState = 4;
  }
  if (keyIsDown(67) === true){ //disable collision
    playerGridCollision(player.x, player.y);
  }
}

function mouseWheel(event){
  if (event.delta < 0){
    gridSize -= 5;
  }
  else {
    gridSize += 5;
  }
}

function touchInputs(){

  //up
  if (mouseX > 75 && mouseX <= 125 && mouseY > height-175 && mouseY <= height-125){
    fill(125);
    PacManMoveState = 1;
  }
  else {
    fill(255);
  }
  square(75, height-175, 50, 10);
  fill(0);
  triangle(115, height-135, 85, height-135,100,height-165);

  //down
  if (mouseX > 75 && mouseX <= 125 && mouseY > height-75 && mouseY <= height-25){
    fill(125);
    PacManMoveState = 3;
  }
  else {
    fill(255);
  }
  square(75, height-75, 50, 10);
  fill(0);
  triangle(115, height-65, 85, height-65,100,height-35);
  
  //left
  if (mouseX > 25 && mouseX <= 75 && mouseY > height-125 && mouseY <= height-75){
    fill(125);
    PacManMoveState = 2;
  }
  else {
    fill(255);
  }
  square(25, height-125, 50, 10);
  fill(0);
  triangle(65, height-85, 65, height-115, 35, height-100);

  //right
  if (mouseX > 125 && mouseX <= 175 && mouseY > height-125 && mouseY <= height-75){
    fill(125);
    PacManMoveState = 4;
  }
  else {
    fill(255);
  }
  square(125, height-125, 50, 10);
  fill(0);
  triangle(135, height-85, 135, height-115, 165, height-100);
}