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
  let startedThisGame = null;
  let isWinner = null; 

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
    if (playerTurn == null) {playerTurn = true}; 
    isWinner = null;
    if (gameOverStatus) {
      startedThisGame = !startedThisGame;
      playerTurn = startedThisGame;
    } else {
      playerTurn = startedThisGame;
    }
    gameOverStatus = false; 
    gameBoard.resetBoard();
  }
  
  // Initialize and switch current player
  const nextPlayer = function(){
    if (playerTurn == null) {
      playerTurn = true;  //start with player1
      startedThisGame = true;
    } else {
      playerTurn = !playerTurn;  //switch to opposite player
    }
  }

  const getLastGameResult = function(){
    return lastGame;
  }

  const start = function(){
    gameReset();
    gameBoard.resetBoard();
    nextPlayer();
  }

  return { nextPlayer, currentPlayer, gameOver, gameReset, isGameOver,
            getLastGameResult, start};
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

    // make the legal move
    if (curr === null) { 
      if (move) {
        player1.addComment(helper.getString("success"));
      } else {
        player2.addComment(helper.getString("success"));
      }
      board[rowInt][colInt] = move;
      lastmove = true;
      console.log(checkWinCondition())
      // check for win and end if so
      if (checkWinCondition() == "Win"){
        gameFlow.gameOver(move);
        if(move) {
          player1.addWin();
          player1.addComment(helper.getString("gameOver"));
        } else {
          player2.addWin();
          player2.addComment(helper.getString("gameOver"));
        }
        render();
        console.log(move+", "+helper.getString("gameOver"));
        return (move+", "+helper.getString("gameOver"));
      // else check if it was a tie
      } else if (checkWinCondition() == "Tie") {  
        player1.addComment(helper.getString("tie"));
        player2.addComment("");
        gameFlow.gameOver("Tie");
        render();
      // no winner yet, so next player
      } else {  
        gameFlow.nextPlayer();
        render();
      }

    // illegal move
    } else {  
      lastmove = false;
      player1.addComment(helper.getString("failure"));
      player2.addComment(helper.getString("failure"));
      render();
    };
  };

  const checkWinCondition = function() {
    let tempArr = [];
    // check rows
    for (let row=0; row<=2; row++){
      if (areAllThreeSame(board[row])) {
        //console.log("row "+row+" was winner")
        return "Win";
      }
    }
    // check columns
    for (let col=0; col<=2; col++){
      tempArr = [board[0][col],board[1][col],board[2][col]];
      if (areAllThreeSame(tempArr)) {
        //console.log("col "+col+" was winner")
        return "Win";
      }
    }
    // check diagonals
    tempArr = [board[0][0],board[1][1],board[2][2]]
    if (areAllThreeSame(tempArr)) {
      //console.log("diag down was winner")
      return "Win";
    }
    tempArr = [board[2][0],board[1][1],board[0][2]]
    if (areAllThreeSame(tempArr)) {
      //console.log("diag up was winner")
      return "Win";
    }

    // Check for tie
    let count = 0;
    for (let row=0; row<=2; row++) {
      for (let col=0; col<=2; col++) {
        if (board[row][col] == true || board[row][col] == false) {
          count++;
          if (count == 9) {
            return "Tie";
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
    console.log(gameBoard);
    console.log(gameFlow);

    // empty current board and recreate
    let divGame = document.querySelector("#divGame");
    if (divGame) {divGame.remove()};
    divGame = document.createElement("div");
    divGame.id = "divGame";
    
    // prepare the player stats
    let divPlayer1 = document.createElement("div");
    let divPlayer2 = document.createElement("div");
    divPlayer1.id = "player1div";
    divPlayer2.id = "player2div";
    divPlayer1.className = "playerdiv";
    divPlayer2.className = "playerdiv";

    let playerDivArr = [,divPlayer1,divPlayer2];
    let playerArr = [,player1,player2];
    for (let num = 1; num <= 2; num++) {
      let h2 = document.createElement("h2");
      let h3 = document.createElement("h3");
      let h4 = document.createElement("h4");
      h2.textContent = playerArr[num].playerName;
      h3.textContent = "Wins: "+playerArr[num].wins;
      h4.textContent = "";
      if (gameFlow.currentPlayer() == false && num == 1) {
        h4.textContent = player1.getComment();
      } else if (gameFlow.currentPlayer() == true && num == 2) {
        h4.textContent = player2.getComment();
      }

      playerDivArr[num].append(h2, h3, h4);
    }

    let background1 = "rgb(229,229,241)";
    let background2 = "radial-gradient(circle, rgba(229,229,241,1) 0%, rgba(242,242,242,1) 18%, rgba(255,255,255,1) 65%)";
    let fontWeight = 900;
    if (gameFlow.currentPlayer() == true) {
      divPlayer1.style.background = background1;
      divPlayer1.style.background = background2;
      divPlayer1.style.fontWeight = fontWeight;
    } else if (gameFlow.currentPlayer() == false) {
      divPlayer2.style.background = background1;
      divPlayer2.style.background = background2;
      divPlayer2.style.fontWeight = fontWeight;
    }

    // build the gameboard
    let divGameBoard = document.querySelector("#tic-tac-toe");
    let tempDiv;
    let tempImg;

    divGameBoard = document.createElement("div");
    divGameBoard.id = "tic-tac-toe";
    for (let row=0; row<=2; row++) {
      for (let col=0; col<=2; col++) {
        tempDiv = document.createElement("div");
        tempDiv.classList.add("XOBoxDiv");
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
    }

    //add reset game button
    let btn = document.querySelector("#resetBtn");
    if (btn) {btn.remove()};
    btn = document.createElement("button");
    btn.id = "resetBtn";
    btn.textContent="Reset";
    btn.addEventListener("mouseup", gameFlow.gameReset);



    //add players and gameboard to the div
    divGame.append(playerDivArr[1],divGameBoard,playerDivArr[2])
    mainDiv.append(divGame,btn);
  
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
const createPlayer = (playerName) => {
  return ({
    playerName : playerName || "Player 1",
    wins : 0,
    comment : "",
    setUserName(newName) {
      this.playerName = newName;
      return this;
    },
    addWin () {
      this.wins++;
      return this;
    },
    addComment(str) {
      this.comment = str;
    },
    getComment() {
      return this.comment;
    }
  });
};

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
  const tieArray = ["It's a tie.", "BORING! Tie!", "Ties seem to happen often",
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
player1 = createPlayer("Player 1");
player2 = createPlayer("Murphy");
gameFlow.start();
// console.log(gameBoard.addMove(0,1)); //true
// console.log(gameBoard.addMove(2,2)); //false
// console.log(gameBoard.addMove(2,2)); // --bad move
