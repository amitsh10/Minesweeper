"use strict";

const MINE = "💣";
const NEIGHBORS = ["", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
const FLAG = "🚩";
const PLAYBUTTON = "😀";

var gBoard;
var gLevel = {
  size: 4,
  mines: 2,
};

function initGame() {
  gBoard = createBoard();
  locateMines();
  renderBoard(gBoard);
}

function locateMines() {
  var minesCount = gLevel.mines;
  for (var i = 0; i < minesCount; i++) {
    var randomI = getRandomInt(0, gLevel.size);
    var randomJ = getRandomInt(0, gLevel.size);
    if (!gBoard[randomI][randomJ].isMine) {
      gBoard[randomI][randomJ].isMine = true;
    } else {
      i--;
    }
  }
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
      if (board[i][j].isShown) {
        var neighborsCount = board[i][j].minesAroundCount;
        var value = board[i][j].isMine ? MINE : NEIGHBORS[neighborsCount];
        strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" class="cell">${value}</td>`;
      } else {
        strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" class="hidden-cell">X</td>`;
      }
    }
  }
  strHTML += "</tr>";
  var elBoard = document.querySelector("table tbody");
  elBoard.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {
  // model
  //   if (gBoard[i][j].isMine) gameOver()
  //update Mines around clickedCell (if not already clicked)
  if (!gBoard[i][j].isShown) setMinesNegCount(gBoard, i, j);
  // making the cell visible
  gBoard[i][j].isShown = true;
  //dom
  //making the cell visible in dom
  renderBoard(gBoard);
}

function setMinesNegCount(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isMine) {
        board[cellI][cellJ].minesAroundCount++;
      }
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
