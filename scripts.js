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
  let turnNumber = 1;

  // get current player
  const currentPlayer = function () { 
    return playerTurn;
  }

  const isGameOver = function() {
    return gameOverStatus;
  }
  const gameOver = function (winnerStr) { 
    gameOverStatus = true; 
  }

  const gameReset = function () { 
    if (playerTurn == null) {playerTurn = true}; //initialize
    gameFlow.turnNumber = 1;
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
    //get player names!
    var name1 = prompt("Please enter a name for Player 1", "Harry Potter");
    var name2 = prompt("Please enter a name for Player 2", "Harry Potter");
    player1 = createPlayer(name1 || "Player 1");
    player2 = createPlayer(name2 || "Player 2");
    gameReset()
    nextPlayer();

  }

  return { nextPlayer, currentPlayer, gameOver, gameReset, isGameOver,
            getLastGameResult, start, turnNumber};
})();


//============================
// Gameboard module
//============================
gameBoard = (function() {
  let lastmove = null; //indicate if last move was success
  let board = [[null,null,null],[null,null,null],[null,null,null]]; 


  //called when user clicks space board
  const addMove = function (rowInt, colInt) {
    let move = gameFlow.currentPlayer();
    let curr = board[rowInt][colInt];
    if (gameFlow.isGameOver()) {
      return;
    }

    // make the legal move
    if (curr === null) { 
      gameFlow.turnNumber++;
      if (move) {
        player1.addComment(helper.getString("success"));
      } else {
        player2.addComment(helper.getString("success"));
      }
      board[rowInt][colInt] = move;
      lastmove = true;
      // check for win and end if so
      if (checkWinCondition() == "Win"){
        gameFlow.gameOver(move);
        if(move) {
          player1.addWin();
          player1.addComment(player1.playerName+", "+helper.getString("gameOver"));
        } else {
          player2.addWin();
          player2.addComment(player2.playerName+", "+helper.getString("gameOver"));
        }
        render();
      // else check if it was a tie
      } else if (checkWinCondition() == "Tie") {  
        gameFlow.gameOver("Tie");
        let tieStr = helper.getString("tie");
        player1.addComment(tieStr);
        player2.addComment(tieStr);
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
    let tempImg;
    
    for (let num = 1; num <= 2; num++) {
      if (num == 1) {
        tempImg = document.createElement("img");
        tempImg.src = "./images/X.svg";
      } else if (num == 2) {
        tempImg = document.createElement("img");
        tempImg.src = "./images/O.svg";
      }
      tempImg.style.height = "50px"
      let h2 = document.createElement("h2");
      let h3 = document.createElement("h3");
      let h4 = document.createElement("h4");
      h2.textContent = playerArr[num].playerName;
      //bold current player
      if (gameFlow.currentPlayer() == true && num == 1) {
        h2.textContent = "> "+playerArr[num].playerName+" <";
      } else if (gameFlow.currentPlayer() == false && num == 2) {
        h2.textContent = "> "+playerArr[num].playerName+" <";
      }

      h3.textContent = "Wins: "+playerArr[num].wins;
      h4.textContent = "";
      //show no comments on first turn
      if (gameFlow.turnNumber == 1) { 
      //show tie comment on both playerDivs  
      } else if (gameFlow.turnNumber > 9) {
        h4.textContent = player1.getComment();
      //show winner text
      } else if (gameFlow.isGameOver() == true) {
        if (gameFlow.currentPlayer() == true && num == 1) {
          h4.textContent = player1.playerName+", "+helper.getString("gameOver");
        } else if (gameFlow.currentPlayer() == false && num == 2) {
          h4.textContent = player2.playerName+", "+helper.getString("gameOver");
        }
      //show player comment for player who just attempted move
      } else{
        if (gameFlow.currentPlayer() == false && num == 1) {
          h4.textContent = player1.getComment();
        } else if (gameFlow.currentPlayer() == true && num == 2) {
          h4.textContent = player2.getComment();
        }
      }

      playerDivArr[num].append(tempImg, h2, h3, h4);
    }

    // accent the current background
    let background1 = "rgb(229,229,241)";
    let background2 = "radial-gradient(circle, rgba(229,229,241,1) 0%, rgba(242,242,242,1) 35%, rgba(255,255,255,1) 65%)";
    let fontWeight = 900;
    if (gameFlow.currentPlayer() == true) {
      playerDivArr[1].style.background = background1;
      playerDivArr[1].style.background = background2;
      playerDivArr[1].style.fontWeight = fontWeight;
    } else if (gameFlow.currentPlayer() == false) {
      playerDivArr[2].style.background = background1;
      playerDivArr[2].style.background = background2;
      playerDivArr[2].style.fontWeight = fontWeight;
    }

    // build the gameboard
    let divGameBoard = document.querySelector("#tic-tac-toe");
    let tempDiv;

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
    btn.addEventListener("mouseup", gameFlow.gameReset);
    if (gameFlow.isGameOver()) {
      btn.textContent="Start Next Game";
    } else {
      btn.textContent="Reset Board";
    }
    



    //add players and gameboard to the div
    divGame.append(playerDivArr[1],divGameBoard,playerDivArr[2])
    mainDiv.append(divGame,btn);
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
gameFlow.start();
