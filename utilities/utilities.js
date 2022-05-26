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
