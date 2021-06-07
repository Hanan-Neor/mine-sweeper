'use strict'

function cellClicked(elCell, i, j) {
    if (FIRST_CLICK) {
        if (sec === '00') timer();
        elCell.className = "clicked";
        setRandomMines(gBoard, i, j);
        setMinesNegsCount(gBoard);
        expandShown(gBoard, elCell, i, j);
        FIRST_CLICK = false;
    }
    if (!gGame.isOn) return;
    if (gBoard[i][j].isMarked) return;
    if (gBoard[i][j].isMine === true) {
        elCell.innerHTML = MINE_IMG;
        elCell.style.background = "red";
        livesCount--;
        document.querySelector('.lives span').innerText = livesCount + ' ';
    }
    else if (!gBoard[i][j].minesAroundCount) expandShown(gBoard, elCell, i, j);
    else if (gBoard[i][j].isShown) expandShownNums(gBoard, elCell, i, j);
    else {
        elCell.innerText = gBoard[i][j].minesAroundCount;
        document.querySelector(`#cell-${i}-${j}`).className = "clicked";

        gGame.shownCount++;
        gBoard[i][j].isShown = true;
    }
    checkGameOver(gBoard[i][j], 'rc');
}

function expandShownNums(board, elCell, i, j) {
    var neighMarked = 0;
    for (var k = i - 1; k <= i + 1; k++) {
        for (var z = j - 1; z <= j + 1; z++) {
            if (k === i && z === j) continue;
            if (k < 0 || k >= board.length || z < 0 || z >= board.length) continue;
            if (board[k][z].isMarked) neighMarked++;
        }
    }
    if (neighMarked !== board[i][j].minesAroundCount) return;


    for (var k = i - 1; k <= i + 1; k++) {
        for (var z = j - 1; z <= j + 1; z++) {
            if (k === i && z === j) continue;
            if (k < 0 || k >= board.length || z < 0 || z >= board.length) continue;
            if (board[k][z].isMarked) continue;
            if (gBoard[k][z].isMine === true) {
                document.querySelector(`#cell-${k}-${z}`).innerHTML = MINE_IMG;
                document.querySelector(`#cell-${k}-${z}`).style.background = "red";
                livesCount--;
                document.querySelector('.lives span').innerText = livesCount + ' ';
            }
            else if (board[k][z].isShown) continue;
            else if (!board[k][z].minesAroundCount) {
                document.querySelector(`#cell-${k}-${z}`).className = "clicked";
                expandShown(board, elCell, k, z);
                checkGameOver(gBoard[i][j], 'rc');
            } else {
                document.querySelector(`#cell-${k}-${z}`).innerText = board[k][z].minesAroundCount;
                document.querySelector(`#cell-${k}-${z}`).className = "clicked";
                board[k][z].isShown = true;
                gGame.shownCount++;
            }
        }
    }
}




function expandShown(board, elCell, i, j) {
    elCell.className = "clicked";
    if (!board[i][j].isShown) gGame.shownCount++;
    gBoard[i][j].isShown = true;
    for (var k = i - 1; k <= i + 1; k++) {
        for (var z = j - 1; z <= j + 1; z++) {
            if (k === i && z === j) continue;
            if (k < 0 || k >= board.length || z < 0 || z >= board.length) continue;
            if (board[k][z].isMarked) continue;
            if (board[k][z].isShown) continue;
            if (!board[k][z].minesAroundCount) {
                document.querySelector(`#cell-${k}-${z}`).className = "clicked";
                expandShown(board, elCell, k, z);
            } else {
                document.querySelector(`#cell-${k}-${z}`).innerText = board[k][z].minesAroundCount;
                document.querySelector(`#cell-${k}-${z}`).className = "clicked";
                board[k][z].isShown = true;
                gGame.shownCount++;
            }
        }
    }
}




function cellMarked(elCell, i, j) {
        if (FIRST_CLICK) {
        timer();
        FIRST_CLICK = false
    }

    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];
    if (currCell.isShown) return;
    if (!currCell.isMarked) {
        gGame.markedCount++;
        elCell.innerHTML = FLAG_IMG;
        elCell.style.background = '';
        currCell.isMarked = true;
    }
    else {
        gGame.markedCount--;
        elCell.innerHTML = '';
        currCell.isMarked = false;
    }
    checkGameOver(gBoard[i][j], 'lc');
}
