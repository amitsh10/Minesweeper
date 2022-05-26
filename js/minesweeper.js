"use strict";

const MINE = "💣";
const NEIGHBORS = ["", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
const FLAG = "🚩";
const LIVE = "💗";
const EXPLOSION = new Audio("audio/explosion.wav");

var gLives;
var gStartTime;
var gTimerInterval;
var gBoard;
var gLevel = {
  size: 4,
  mines: 2,
};
var gGame = {
  isOn: true,
  isStarted: false,
  minesLocated: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function initGame() {
  gGame.isOn = true;
  gGame.isStarted = false;
  gGame.minesLocated = false;
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gLives = 3;
  gBoard = createBoard();
  renderPlayBtn("gameOn");
  renderLives(gLives);
  renderBoard(gBoard);
  renderTimerText();
  clearInterval(gTimerInterval);
}

function createBoard() {
  var board = [];
  var BoardSize = gLevel.size;
  for (var i = 0; i < BoardSize; i++) {
    board[i] = [];
    for (var j = 0; j < BoardSize; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      var value;
      if (!gGame.isOn && board[i][j].isMine) {
        board[i][j].isShown = true;
      }
      if (board[i][j].isMarked) {
        value = FLAG;
        strHTML += `<td onclick="cellClicked(${i}, ${j})" onmousedown="cellMarked(event, ${i}, ${j})" class="cell">${value}</td>`;
      } else if (board[i][j].isShown) {
        var neighborsCount = board[i][j].minesAroundCount;
        value = board[i][j].isMine ? MINE : NEIGHBORS[neighborsCount];
        strHTML += `<td onclick="cellClicked(${i}, ${j})" onmousedown="cellMarked(event, ${i}, ${j})" class="cell">${value}</td>`;
      } else {
        strHTML += `<td onclick="cellClicked(${i}, ${j})" onmousedown="cellMarked(event, ${i}, ${j})" class="hidden-cell">X</td>`;
      }
    }
  }
  strHTML += "</tr>";
  var elBoard = document.querySelector("table tbody");
  elBoard.innerHTML = strHTML;
}

function cellClicked(i, j) {
  //check if its the first clicked cell
  if (!gGame.isStarted) {
    startTimer();
    gGame.isStarted = true;
  }
  // locate mines after first cell clicked
  if (!gGame.minesLocated) {
    locateMines(i, j);
    gGame.minesLocated = true;
  }
  //if the clicked cell is marked or the game is not on return
  if (gBoard[i][j].isMarked || !gGame.isOn) return;
  if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) {
    //check how many mine neighbors around
    setMinesNegCount(gBoard, i, j);
    //changes the status of the cell to shown
    gBoard[i][j].isShown = true;
    //change to smiley emoji (chance the previous cell was mine)
    renderPlayBtn("gameOn");
  }

  if (gBoard[i][j].isMine) {
    EXPLOSION.play();
    gLives--;
    // change to lose emoji
    renderPlayBtn("lose");
    renderLives(gLives);
    gBoard[i][j].isShown = true;
    if (gLives === 0) {
      gameOver();
    }
  }
  renderBoard(gBoard);
  checkWin();
}

function setMinesNegCount(board, cellI, cellJ) {
  var neighbors = [];
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      // skip on the clicked cell
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isMine) {
        board[cellI][cellJ].minesAroundCount++;
      }
      neighbors.push({ i, j });
    }
  }
  if (board[cellI][cellJ].minesAroundCount === 0) {
    for (var i = 0; i < neighbors.length; i++) {
      expandShown(board, neighbors[i].i, neighbors[i].j);
    }
  }
}

function cellMarked(event, i, j) {
  //check if its the first clicked cell
  if (!gGame.isStarted) {
    startTimer();
    gGame.isStarted = true;
  }
  // check if right click and game is on
  if (event.button !== 2 || !gGame.isOn) return;
  //if its clicked cell cannot mark it
  if (gBoard[i][j].isShown) return;
  //if cell not marked put flag
  if (!gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = true;
    renderBoard(gBoard);
    //if cell already marked - unmark it
  } else {
    gBoard[i][j].isMarked = false;
    renderBoard(gBoard);
  }
  checkWin();
}

function gameOver() {
  clearInterval(gTimerInterval);
  gGame.isOn = false;
  renderPlayBtn("lose");
}

function checkWin() {
  /* not completed
  if (gGame.shownCount + gGame.markedCount === gGame.size ** 2) {}
  */
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      // checking if there is a cell not revealed - no win
      if (!cell.isMine && !cell.isShown) return;
      // checking if a mine cell is still not revealed and not marked - no win
      if (cell.isMine && !cell.isShown && !cell.isMarked) return;
    }
  }
  clearInterval(gTimerInterval);
  gGame.isOn = false;
  renderPlayBtn("win");
}

function setDifficulty(difficulty, mines) {
  gLevel.size = difficulty;
  gLevel.mines = mines;
  initGame();
}

function expandShown(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      // skip on the clicked cell
      if ((i === cellI && j === cellJ) || board[cellI][cellJ].minesAroundCount)
        continue;
      if (board[i][j].isMine) {
        board[cellI][cellJ].minesAroundCount++;
      }
      if (!board[cellI][cellJ].isMarked) {
        board[cellI][cellJ].isShown = true;
      }
    }
  }
}

function startTimer() {
  gStartTime = Date.now();
  gTimerInterval = setInterval(updateTime, 50);
}

function updateTime() {
  var now = Date.now();
  var diff = now - gStartTime;
  var secondsPast = diff / 1000;
  var elTimer = document.querySelector(".timer");
  elTimer.innerText = secondsPast.toFixed(3);
}

function renderTimerText() {
  var elTimer = document.querySelector(".timer");
  elTimer.innerText = "Timer";
}

function renderLives(lives) {
  var elLives = document.querySelector(".lives");
  elLives.innerText = "";
  for (var i = 0; i < lives; i++) {
    elLives.innerText += LIVE;
  }
}

function renderPlayBtn(situation) {
  var elPlaybtn = document.querySelector(".play");
  if (situation === "gameOn") elPlaybtn.innerText = "😀";
  else if (situation === "lose") elPlaybtn.innerText = "🤯";
  else if (situation === "win") elPlaybtn.innerText = "😎";
}
