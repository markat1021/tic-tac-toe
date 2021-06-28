"use strict"
let gameFlow;
let gameBoard;
let player1;
let player2;

const mainDiv = document.querySelector("main");




//============================
// Game Flow module
//============================
gameFlow = (function() {
  let playerTurn = null; //boolean true=player1
  let isGameOver = false; 
  let isWinner = null; 

  // makes sure two players are available
  // can resetBoard game

  // get current player
  const currentPlayer = function () { 
    return playerTurn 
  }

  const gameOver = function (winner) { 
    isGameOver = true; 
    isWinner = winner;
  }

  const gameReset = function () { 
    isGameOver = false; 
    playerTurn = true;
    isWinner = null;
  }
  
  // Initialize and switch current player
  const nextPlayer = function(){
    if (playerTurn == null) {
      playerTurn = true;  //start with player1
    } else {
      playerTurn = !playerTurn;  //switch to opposite player
    }
  }


  return { nextPlayer, currentPlayer, gameOver, gameReset, isGameOver };
})();


//============================
// Gameboard module
//============================
gameBoard = (function() {
  let lastmove = null; //indicate if last move was success
  let board = [[null,null,null],[null,null,null],[null,null,null]]; 


  const addMove = function (rowInt, colInt) {
    let move = gameFlow.currentPlayer();
    let curr = board[rowInt][colInt];
    if (gameFlow.isGameOver) {
      return;
    }

    // legal move
    if (curr === null) { 
      board[rowInt][colInt] = move;
      lastmove = true;
      if (checkWinCondition()) { // check win
        gameFlow.gameOver();
        render();
        return (move+", "+helper.getString("gameOver"));
      } else {  // no winner, so next player
        gameFlow.nextPlayer();
        return helper.getString("success"); 
      }

    // illegal move
    } else {  
      lastmove = false;
      render();
      return helper.getString("failure");
    };
  };

  const checkWinCondition = function() {
    let tempArr = [];
    // check columns
    for (let row=0; row<=2; row++){
      if (areAllThreeSame(board[row])) {
        return true;
      }
    }
    // check rows
    for (let col=0; col<=2; col++){
      tempArr = [board[0][col],board[1][col],board[2][col]];
      if (areAllThreeSame(tempArr)) {
        return true;
      }
    }
    // check diagonals
    tempArr = [board[0][0],board[1][1],board[2][2]]
    if (areAllThreeSame(tempArr)) {
      return true;
    }
    tempArr = [board[2][0],board[1][1],board[0][2]]
    if (areAllThreeSame(tempArr)) {
      return true;
    }

    // Must be no winner
    return false;  
  }

  const areAllThreeSame = function (arr) {
    if (arr.indexOf(null) > -1) { // check for null
      return false;
    } else if (arr[0] == arr[1] && arr[1] == arr[2]) {
      return true;
    } else {
      return false;
    }
  }

  const render = function() {
    console.log("Rendering. Board: "+board[0]);
    console.log("                  "+board[1]);
    console.log("                  "+board[2]);
  };

  const resetBoard = function () {
    board = [[null,null,null],[null,null,null],[null,null,null]];
    lastmove = null;
  }


  // renders the current game status
    // highlights current players turn
  // determines if move is legal
  return {addMove, resetBoard}
})()

//============================
// Player factory
//============================
  // keeps track of wins
  // 

//============================
// Helper module
//============================
const helper = (function(){
  const successArray = ["Nice move!","I like it!","I hope this works!",
    "Wowzers!","Here goes nothing...","Could this be it?!","Great pick!",
    "Incredible move!", "What foresight you have!","Majestic move!"];
  const failureArray = ["Try again.","That's not a legal move.",
    "Try a different one.","You might want to think harder.", 
    "That's not possible.", "Give it another go.", 
    "Another go and you'll get it."];
  const gameOverArray = ["you've won!", "I knew you'd beat 'em!", 
    "that was a spectacular game!", "winner winner chicken dinner!"];
  const tieArray = ["It's a tie.", "BORING!", "Ties seem to happen often",
    "There's a reason I don't play too often. Tie.", ]


  let getString = function(typeStr) {
    if (typeStr == "success") {
      return successArray[Math.floor(Math.random()*successArray.length)]
    } else if (typeStr == "failure") {
      return failureArray[Math.floor(Math.random()*failureArray.length)]
    } else if (typeStr == "gameOver") {
      return gameOverArray[Math.floor(Math.random()*gameOverArray.length)]
    } else if (typeStr == "tie") {
      return tieArray[Math.floor(Math.random()*tieArray.length)]
    } else {
      return "Something went wrong calling the helper!"
    }

  }

  return { getString }
})()


//============================
// Execute code
//============================
gameFlow.nextPlayer();
console.log(gameBoard.addMove(0,1)); //true
console.log(gameBoard.addMove(2,2)); //false
console.log(gameBoard.addMove(2,2)); // --bad move
console.log(gameBoard.addMove(1,1)); //true
console.log(gameBoard.addMove(2,0)); //false
console.log(gameBoard.addMove(2,1)); //true