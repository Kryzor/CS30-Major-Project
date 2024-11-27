// Major Project Assignment
// Katos Booth
// November 21st 2024

class Maze{
  constructor(cols,rows){
    this.cols = cols;
    this.rows = rows;
    this.maze = Array.from({length:rows}, () => Array(cols).fill(IMPASSIBLE));
    this.carvePath(0, 0);
  }

  carvePath(x,y){
    const directions = [
      {dx: 0, dy: -1},//up
      {dx: 0, dy: 1},//down
      {dx: 1, dy: 0},//right
      {dx: -1, dy: 0},//left
    ];

    //change the random number to change how often lines will be made
    //decrease the value for more vertical lines
    //increase the value for more horizontal lines
    directions.sort(() => Math.random() - 0.5);

    directions.forEach(({dx,dy}) => {

      const nx = x + dx * 2;
      const ny = y + dy * 2;

      if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows && this.maze[ny][nx] === IMPASSIBLE){
        this.maze[y + dy][x + dx] = OPEN_TILE;
        this.maze[ny][nx] = OPEN_TILE;
        this.carvePath(nx, ny);
      }
    });
  }
  
  expand(direction){
    if (direction === "right"){
      this.cols += MAZE_SIZE;
      // for (let cols of this.maze){
      //   this.carvePath(this.rows - MAZE_SIZE, y);
      // }
      for (let y = 0; y < this.cols; y++){
        this.carvePath(this.rows - MAZE_SIZE, y);
      }
    }
    if (direction === "down"){
      this.rows += MAZE_SIZE;
      for (let col of this.maze){
        col.push(...Array(MAZE_SIZE).fill(IMPASSIBLE));
      }
      for (let x = 0; x < this.cols; x++){
        this.carvePath(x, this.rows - MAZE_SIZE);
      }
    }
  }
  
  display(){
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        
        //gives the squares colour appropiate to its state
        //no open tile colour to optimize the performance
        if (this.maze[y][x] === IMPASSIBLE) {
          stroke("blue");
          fill("blue");
          square(x * cellSize, y * cellSize, cellSize);
        }
      }
    }
  }
}

let maze;
let cellSize;

const MAZE_SIZE = 25;

//visual grid size for the amount of blocks will be seen on screen
let gridSize = 25;

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
  speed: 0,
  spawnPositionX: 0,
  spawnPositionY: 0,
  spawnBox: 0,
};

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
  thePlayer.spawnBox = Math.round(gridSize/2);
  thePlayer.x = thePlayer.spawnBox*2;
  thePlayer.y = thePlayer.spawnBox*2;

  gridPositionX = width/2-50;
  gridPositionY = height/2-50;

  maze = new Maze(MAZE_SIZE, MAZE_SIZE);

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
  
  //makes the speed go the same speed for the size of the grid, if it was a static number
  //it would go super fast on a screen fitting a large amount of squares
  //or super slow on a screen fitting a little amount of squares
  thePlayer.speed = cellSize*0.5;

  displayGridX = width/cellSize;
  displayGridY = height/cellSize;
  
  screenController();
  checkMazeExpansion();
  
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
  maze.display();
  createPlayer();
  //touchInputs();
}

//Displays the main screen
function displayMainScreen(){
  fill(0,0,255);
  rect(width/2,height/2, 50, 50);
  background(0);
}

function checkMazeExpansion(){
  const threshold = MAZE_SIZE * cellSize * 0;

  if (thePlayer.x >  maze.cols * cellSize - threshold){
    maze.expand("right");
  }
  if (thePlayer.y >  maze.rows * cellSize - threshold){
    maze.expand("down");
  }
}

function createPlayer(){
  displayPlayer();
  movePlayer();
}

function movePlayer() {
  //center point
  let playerGridX = Math.floor(thePlayer.x/cellSize);
  let playerGridY = Math.floor(thePlayer.y/cellSize);

  //directional points
  let playerUpperGridY = Math.floor(thePlayer.y/cellSize-0.45); //up
  let playerLowerGridY = Math.floor(thePlayer.y/cellSize+0.45); //down
  let playerLeftGridX = Math.floor(thePlayer.x/cellSize-0.45); //left
  let playerRightGridY = Math.floor(thePlayer.x/cellSize+0.45); //right
  
  //Checks states to move the player depending on that state
  if (PacManMoveState === 1){ //up
    thePlayer.y -= thePlayer.speed;
  }
  else if (PacManMoveState === 2){ //left
    thePlayer.x -= thePlayer.speed;
  }
  else if (PacManMoveState === 3){ //down
    thePlayer.y += thePlayer.speed;
  }
  else if (PacManMoveState === 4){ //right
    thePlayer.x += thePlayer.speed;
  }
  
  //playerGridCollision(playerGridX, playerGridY, playerUpperGridY, playerLowerGridY,  playerLeftGridX, playerRightGridY);
  inputsForGame();
}

//Detects the grid collision
function playerGridCollision(gridX, gridY, upperGridY, lowerGridY, leftGridX, rightGridX){
  if (mazeGrid[upperGridY][gridX] === IMPASSIBLE){ //up
    thePlayer.y = thePlayer.y+cellSize/10;
  }
  if (mazeGrid[lowerGridY][gridX] === IMPASSIBLE){ //down
    thePlayer.y = thePlayer.y-cellSize/10;
  }
  if (mazeGrid[gridY][leftGridX] === IMPASSIBLE){ //left
    thePlayer.x = thePlayer.x+cellSize/10;
  }
  if (mazeGrid[gridY][rightGridX] === IMPASSIBLE){ //right
    thePlayer.x = thePlayer.x-cellSize/10;
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
  // if (gridSize > MAZE_SIZE){
  //   gridSize = MAZE_SIZE;
  // }
}

//Displays the player
function displayPlayer(){
  if (PacManMoveState === 0){
    image(defaultPacManSprite, thePlayer.x, thePlayer.y, cellSize, cellSize);
  }
  if (PacManMoveState === 1){
    image(upPacManSprite, thePlayer.x, thePlayer.y, cellSize, cellSize);
  }
  if (PacManMoveState === 2){
    image(leftPacManSprite, thePlayer.x, thePlayer.y, cellSize, cellSize);
  }
  if (PacManMoveState === 3){
    image(downPacManSprite, thePlayer.x, thePlayer.y, cellSize, cellSize);
  }
  if (PacManMoveState === 4){
    image(rightPacManSprite, thePlayer.x, thePlayer.y, cellSize, cellSize);
  }
}

function touchInputs(){
  fill(255,255,255);
  stroke(0);
  square(75, height-75, 50, 10);
}