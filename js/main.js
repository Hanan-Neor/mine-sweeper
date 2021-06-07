'use strict'
var gBoard;
var livesCount = 3;
var FIRST_CLICK = false;
var timeInterval;
var minutes;
var sec = 0;

var MINE_IMG = '<img src="img/mine4.png" />';
var FLAG_IMG = '<img src="img/flag2.png" />';
var gLevel =
{
    SIZE: 8, MINES: 12
};


var gGame =
{
    isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0
}




function initGame() {
    dataInitial();
    gBoard = buildBoard();
    renderBoard(gBoard);
}




function dataInitial() {
    document.querySelector('.modal').style.display = 'none';

    clearInterval(timeInterval);
    minutes = '00'; sec = '00';
    document.getElementById('safeTimerDisplay').innerHTML = minutes + ':' + sec;

    livesCount = 3;
    document.querySelector('.lives span').innerText = livesCount + ' ';

    FIRST_CLICK = true;
    document.querySelector('.smiley').innerHTML = '&#128512';
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.isOn = true;
}



function levelSelect(elButton) {
    switch (elButton.innerText) {

        case 'Beginner':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case 'Medium':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            break;
        case 'Expert':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
    }
    initGame();
}




function buildBoard() {
    var board = createMat(gLevel.SIZE);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j] = { minesAroundCount: null, isShown: false, isMine: null, isMarked: null };
        }
    }
    return board;
}




function setRandomMines(board, x, y) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var rndmI = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var rndmJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
        if (board[rndmI][rndmJ].isMine === true) {
            i--;
            continue;
        }
        if (rndmI === x - 1 && rndmJ === y - 1 || rndmI === x - 1 && rndmJ === y ||
            rndmI === x - 1 && rndmJ === y + 1 || rndmI === x && rndmJ === y - 1 ||
            rndmI === x && rndmJ === y || rndmI === x && rndmJ === y + 1 ||
            rndmI === x + 1 && rndmJ === y - 1 || rndmI === x + 1 && rndmJ === y ||
            rndmI === x + 1 && rndmJ === y + 1) {  //no mine in the clicked cell, and in its neighbors.
            i--;
            continue;
        }
        board[rndmI][rndmJ].isMine = true;
    }
}




function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine === true) {
                for (var k = i - 1; k <= i + 1; k++) {
                    for (var z = j - 1; z <= j + 1; z++) {
                        if (k === i && z === j) continue;
                        if (k < 0 || k >= board.length || z < 0 || z >= board.length) continue;
                        board[k][z].minesAroundCount += 1;

                    }
                }
            }

        }
    }
}




function renderBoard(board) {
    var strHTML = '<table class="board" cellpadding="0" ><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board.length; j++) {
            var cellId = `cell-${i}-${j}`
            strHTML += `<td class="cell" id="${cellId}" onclick="cellClicked(this,${i},${j})"  oncontextmenu="cellMarked(this,${i},${j})"><span></span></td>`; // ${this},${i},${j}       style="display: none;"
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    document.querySelector('.board-container').innerHTML = strHTML;
}




function timer() {
    sec = 1
    minutes = 0
    timeInterval = setInterval(function () {
        document.getElementById('safeTimerDisplay').innerHTML = '0' + minutes + ':0' + sec;
        if (sec > 9) document.getElementById('safeTimerDisplay').innerHTML = '0' + minutes + ':' + sec;
        sec++;
        if (sec > 59) {
            sec = 0;
            minutes++;
        }
    }, 1000);
}




function checkGameOver(clicked, button) {
    // console.log('showncount',gGame.shownCount,'markedcount',gGame.markedCount);
    if (livesCount <= 0) {
        gGame.isOn = false;
        document.querySelector('.smiley').innerHTML = '&#129327';
        // document.querySelector('.modal').innerHTML = 'GAME OVER';
        // document.querySelector('.modal').style.background = 'red';
        // document.querySelector('.modal').style.display = 'block';


        clearInterval(timeInterval);
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                if (gBoard[i][j].isMine === true) {
                    document.querySelector(`#cell-${i}-${j}`).innerHTML = MINE_IMG;
                }
            }
        }
    }
    if (gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES) && gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false;
        document.querySelector('.smiley').innerHTML = '&#128526';
        clearInterval(timeInterval);
        // document.querySelector('.modal').innerHTML = 'VICTORY !!';
        // document.querySelector('.modal').style.background = 'rgb(85, 157, 224)';
        // document.querySelector('.modal').style.display = 'block';
    }
    return;
}




function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}