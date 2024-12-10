// Major Project Assignment
// Katos Booth
// November 21st 2024

const GRID_SEED = 327147;

class theMaze{
  constructor(cols, rows, seed){
    this.cols = cols;
    this.rows = rows;
    this.seed = seed;
    this.randomSeed = this.seedTheNumber(seed);
    this.grid = Array.from({length:rows}, () => Array(cols).fill(IMPASSIBLE));
    this.carvePath(2, 0);
  }

  seedTheNumber(seed){
    let value = seed;
    return ()=>{
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }
  carvePath(x, y){
    const directions = [
      {dx: 0, dy: -1},//up
      {dx: 0, dy: 1},//down
      {dx: 1, dy: 0},//right
      {dx: -1, dy: 0},//left
    ];


    for (let i = 0; i < 2; i++){
      for (let j = 0; j < 3; j++){
        this.grid[j + Math.round(MAZE_SIZE/2)-2][i + Math.round(MAZE_SIZE/2)-1] = OPEN_TILE;
      }
    }

    directions.sort(() => this.randomSeed() - 0.5);
    directions.forEach(({dx,dy}) => {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows && this.grid[ny][nx] === IMPASSIBLE){
        this.grid[y + dy][x + dx] = OPEN_TILE;
        this.grid[ny][nx] = OPEN_TILE;
        this.carvePath(nx, ny);
      }
    });
  }
  
  //expands the maze
  expand(direction){
    if (direction === "right"){
      for (let row of this.grid){
        row.push(...Array(MAZE_SIZE).fill(IMPASSIBLE));
      }
      this.cols += MAZE_SIZE;
      //Carve the path
      for (let y = 0; y < this.rows; y++){
        if (y % 2 === 0){
          this.carvePath(this.cols - MAZE_SIZE, y);
        }
      }
    }
    if (direction === "down"){
      const newRows = Array.from({ length: MAZE_SIZE}, () => Array(this.cols).fill(IMPASSIBLE));
      this.grid.push(...newRows);
      this.rows += MAZE_SIZE;
      for (let x = 0; x < this.rows; x++){
        if (x % 2 === 0){
          this.carvePath(x, this.rows - MAZE_SIZE);
        }
      }
    }
    if (direction === "up"){
      const newRows = Array.from({ length: MAZE_SIZE}, () => Array(this.cols).fill(IMPASSIBLE));
      this.grid.push(...newRows);
      this.rows += MAZE_SIZE;
      for (let x = 0; x < this.rows; x++){
        if (x % 2 === 0){
          this.carvePath(x, this.rows - MAZE_SIZE);
        }
      }
    }
  }
  
  display(offsetX, offsetY){
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const screenX = x * cellSize - offsetX;
        const screenY = y * cellSize - offsetY;
        if (screenX > 0 - cellSize && screenX < width && screenY > 0 - cellSize && screenY < height){
          if (this.grid[y][x] === IMPASSIBLE){
            stroke(0, 0, 255);
            fill(0, 0, 255);
            square(screenX, screenY, cellSize);
          }
        }
      }
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
let thePlayer = {
  x:0,
  y:0,
  speed: 0.15,
  spawnPositionX: 0,
  spawnPositionY: 0,
  spawnBox: 0,
  nextMove: 0,
};

let cameraOffsetX = 0;
let cameraOffsetY = 0;

//the state for the players movement
let PacManMoveState = 0;

let spriteState = 0;
let lastSpriteTime;
const SPRITE_ANIMATION_DURATION = 200;

let defaultPacManSprite;

let rightPacManSprite;
let rightPacManSprite1;
let rightPacManSprite2;
let rightPacManSprite3;
let rightPacManSprite4;
let rightPacManSprite5;

let downPacManSprite;
let downPacManSprite1;
let downPacManSprite2;
let downPacManSprite3;
let downPacManSprite4;
let downPacManSprite5;

let leftPacManSprite;

let upPacManSprite;

//the state for the screen
let screenState = 1;

let gridPositionX = 0;
let gridPositionY = 0;

function preload(){
  //loads the sprites
  defaultPacManSprite = loadImage("images/pacman/pacman-default.png"); 

  rightPacManSprite = loadImage("images/pacman/pacman-right0.png"); 
  rightPacManSprite1 = loadImage("images/pacman/pacman-right1.png"); 
  rightPacManSprite2 = loadImage("images/pacman/pacman-right2.png");
  rightPacManSprite3 = loadImage("images/pacman/pacman-right3.png"); 
  rightPacManSprite4 = loadImage("images/pacman/pacman-right4.png");
  rightPacManSprite5 = loadImage("images/pacman/pacman-right5.png"); 
  
  downPacManSprite = loadImage("images/pacman/pacman-down0.png");
  
  leftPacManSprite = loadImage("images/pacman/pacman-left0.png"); 
  
  upPacManSprite = loadImage("images/pacman/pacman-up0.png"); 
}

function setup() {
  frameRate(60);

  //creates the screen
  createCanvas(windowWidth, windowHeight);
  
  //makes cellSize scale to the height of the screen
  cellSize = height/gridSize;
  
  //creates the spawn position for pac man
  thePlayer.x = Math.round(MAZE_SIZE / 2);
  thePlayer.y = Math.round(MAZE_SIZE / 2);

  gridPositionX = width/2-50;
  gridPositionY = height/2-50;

  maze = new theMaze(MAZE_SIZE, MAZE_SIZE, GRID_SEED);

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
  cellSize = height/gridSize;

  cameraOffsetX = thePlayer.x * cellSize - width /2;
  cameraOffsetY = thePlayer.y * cellSize - height /2;
  
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
  checkMazeExpansion();
  createPlayer();
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
  if (thePlayer.y < maze.rows - threshold){
    maze.expand("up");
  }
  if (thePlayer.y > maze.rows - threshold){
    maze.expand("down");
  }
  if (thePlayer.x > maze.cols - threshold){
    maze.expand("right");
  }
}

function createPlayer(){
  displayPlayer();
  movePlayer();
}

function movePlayer() {
  playerGridCollision(thePlayer.x, thePlayer.y);
  // const { x, y } = thePlayer;
  if (PacManMoveState === 1){ //up
    thePlayer.y -= thePlayer.speed;
  }
  if (PacManMoveState === 2){ //left
    thePlayer.x -= thePlayer.speed;
  }
  if (PacManMoveState === 3){ //down
    thePlayer.y += thePlayer.speed;
  }
  if (PacManMoveState === 4){ //right
    thePlayer.x += thePlayer.speed;
  }
  
  inputsForGame();
}

//Detects the grid collision
function playerGridCollision(x, y) {
  if (maze.grid[Math.round(y)-1][Math.round(x - 0.45)] === IMPASSIBLE){ //up
    thePlayer.y = Math.round(thePlayer.y)+0.5;

    //these are used to show the detection of collision
    //square(width/2 - cellSize/8, height/2 - cellSize/2, cellSize/4);
  }
  if (maze.grid[Math.round(y)][Math.round(x - 0.45)] === IMPASSIBLE){ //down
    thePlayer.y = Math.round(thePlayer.y)-0.5;
    //square(width/2 - cellSize/8, height/2 + cellSize/2 - cellSize/4, cellSize/4);
  }
  if (maze.grid[Math.round(y - 0.45)][Math.round(x)-1] === IMPASSIBLE){ //left
    thePlayer.x = Math.round(thePlayer.x)+0.5;
    //square(width/2 - cellSize/2, height/2 - cellSize/8, cellSize/4);
  }
  if (maze.grid[Math.round(y - 0.45)][Math.round(x)] === IMPASSIBLE){ //right
    thePlayer.x = Math.round(thePlayer.x)-0.5;
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
}

function mouseWheel(event){
  if (event.delta < 0){
    gridSize -= 5;
  }
  else {
    gridSize += 5;
  }
}

//Displays the player
function displayPlayer(){
  if (PacManMoveState === 0){
    image(defaultPacManSprite, width / 2, height / 2, cellSize, cellSize);
  }
  if (PacManMoveState === 1){
    image(upPacManSprite, width / 2, height / 2, cellSize, cellSize);
  }
  if (PacManMoveState === 2){
    image(leftPacManSprite, width / 2, height / 2, cellSize, cellSize);
  }
  if (PacManMoveState === 3){
    image(downPacManSprite, width / 2, height / 2, cellSize, cellSize);
  }
  if (PacManMoveState === 4){
    image(rightPacManSprite, width / 2, height / 2, cellSize, cellSize);
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