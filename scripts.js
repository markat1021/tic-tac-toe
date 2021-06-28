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
  let lastGame = null; //string 
  let playerTurn = null; //boolean true=player1
  let gameOverStatus = false; 
  let isWinner = null; 

  // makes sure two players are available
  // can resetBoard game

  // get current player
  const currentPlayer = function () { 
    return playerTurn;
  }

  const isGameOver = function() {
    return gameOverStatus;
  }
  const gameOver = function (winnerStr) { 
    gameOverStatus = true; 
    isWinner = winnerStr;
    // if (typeStr == "win") {
    //   lastGameResult = typeStr;
    // }
  }

  const gameReset = function () { 
    gameOverStatus = false; 
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

  const getLastGameResult = function(){
    return lastGame;
  }


  return { nextPlayer, currentPlayer, gameOver, gameReset, isGameOver,
            getLastGameResult };
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
    if (gameFlow.isGameOver()) {
      return;
    }

    // legal move
    if (curr === null) { 
      board[rowInt][colInt] = move;
      lastmove = true;
      if (checkWinCondition()) { // check win
        gameFlow.gameOver(move);
        render();
        console.log(move+", "+helper.getString("gameOver"));
        return (move+", "+helper.getString("gameOver"));
      } else {  // no winner, so next player
        gameFlow.nextPlayer();
        render();
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
    // check rows
    for (let row=0; row<=2; row++){
      if (areAllThreeSame(board[row])) {
        //console.log("row "+row+" was winner")
        return true;
      }
    }
    // check columns
    for (let col=0; col<=2; col++){
      tempArr = [board[0][col],board[1][col],board[2][col]];
      if (areAllThreeSame(tempArr)) {
        //console.log("col "+col+" was winner")
        return true;
      }
    }
    // check diagonals
    tempArr = [board[0][0],board[1][1],board[2][2]]
    if (areAllThreeSame(tempArr)) {
      //console.log("diag down was winner")
      return true;
    }
    tempArr = [board[2][0],board[1][1],board[0][2]]
    if (areAllThreeSame(tempArr)) {
      //console.log("diag up was winner")
      return true;
    }

    // Check for tie
    let count = 0;
    for (let row=0; row<=2; row++) {
      for (let col=0; col<=2; col++) {
        if (board[row][col] == true || board[row][col] == false) {
          count++;
          if (count == 9) {
            gameFlow
          }
        }
      }
    }

    // Must be no winner
    return false;  
  }

  const resetBoard = function () {
    board = [[null,null,null],[null,null,null],[null,null,null]];
    lastmove = null;
    render();
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

  // renders the current game status
  const render = function() {
    let divGameBoard = document.querySelector("#tic-tac-toe");
    if (divGameBoard) {divGameBoard.remove()};
    let tempDiv;
    let tempImg;

    divGameBoard = document.createElement("div");
    divGameBoard.id = "tic-tac-toe";
    for (let row=0; row<=2; row++) {
      for (let col=0; col<=2; col++) {
        tempDiv = document.createElement("div");
        tempDiv.addEventListener("mousedown",() => addMove(row,col));
        tempImg = document.createElement("img");
        // Add X or O image
        if (board[row][col] === true) {
          tempImg.src = "./images/X.svg"
          tempDiv.appendChild(tempImg);
        } else if (board[row][col] === false) {
          tempImg.src = "./images/O.svg"
          tempDiv.appendChild(tempImg);
        } 
        divGameBoard.appendChild(tempDiv);
      }
      
      mainDiv.appendChild(divGameBoard);
    }
    // highlights current players turn
    // console.log("Rendering. Board: "+board[0]);
    // console.log("                  "+board[1]);
    // console.log("                  "+board[2]);
  };

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
  const successArray = ["Nice move!","I like it!","I hope that works!",
    "Wowzers!","There goes nothing...","Could this be it?!","Great pick!",
    "Incredible move!", "What foresight you have!","Majestic move!"];
  const failureArray = ["Try again.","That's not a legal move.",
    "Try a different move.","You might want to think harder.", 
    "That's not a legit move.", "Give it another go.", 
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
