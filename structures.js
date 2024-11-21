// this is used to spawn specific structures

function spawnBox(){

  //sets the 9 middle boxes to an open tile for spawn point
  grid[thePlayer.spawnBox-2][thePlayer.spawnBox] = OPEN_TILE; //higher top middle
  grid[thePlayer.spawnBox-1][thePlayer.spawnBox-1] = OPEN_TILE; //top left
  grid[thePlayer.spawnBox-1][thePlayer.spawnBox] = OPEN_TILE; //top middle
  grid[thePlayer.spawnBox-1][thePlayer.spawnBox+1] = OPEN_TILE; //top right
  grid[thePlayer.spawnBox][thePlayer.spawnBox-1] = OPEN_TILE; //left middle
  grid[thePlayer.spawnBox][thePlayer.spawnBox] = OPEN_TILE; //center
  grid[thePlayer.spawnBox][thePlayer.spawnBox+1] = OPEN_TILE; //right middle
  grid[thePlayer.spawnBox+1][thePlayer.spawnBox-1] = OPEN_TILE; //bottom left
  grid[thePlayer.spawnBox+1][thePlayer.spawnBox] = OPEN_TILE; //bottom middle
  grid[thePlayer.spawnBox+1][thePlayer.spawnBox+1] = OPEN_TILE; //bottom right
}