"use strict";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function locateMines(firstCellI, firstCellJ) {
  var minesCount = gLevel.mines;
  for (var i = 0; i < minesCount; i++) {
    var randomI = getRandomInt(0, gLevel.size);
    var randomJ = getRandomInt(0, gLevel.size);
    if (randomI === firstCellI && randomJ === firstCellJ) {
      i--;
      continue;
    }
    if (!gBoard[randomI][randomJ].isMine) {
      gBoard[randomI][randomJ].isMine = true;
    } else {
      i--;
    }
  }
}

function findSafeCells() {
  var hiddenCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      if (!cell.isShown && !cell.isMine) {
        cell.location = { i, j };
        hiddenCells.push(cell);
      }
    }
  }
  return hiddenCells;
}

function safeClick(elButton) {
  var hiddenCells = findSafeCells();
  if (hiddenCells.length === 0 || gGame.safeClicks === 0) return;
  var randomCellIdx = getRandomInt(0, hiddenCells.length);
  var randomCell = hiddenCells[randomCellIdx];
  renderCell(randomCell.location.i, randomCell.location.j);
  gGame.safeClicks--;
  elButton.innerText = `Safe Clicks: ${gGame.safeClicks}`;
}

function renderCell(i, j) {
  var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
  elCell.classList.add("safe-click");
  setTimeout(() => {
    elCell.classList.remove("safe-click");
  }, 1000);
}

function renderSafeClickBtn() {
  var elButton = document.querySelector(".safe-button");
  elButton.innerText = `Safe Clicks: ${gGame.safeClicks}`;
}
