'use strict'

var tableGame = document.querySelector('.board')
var elMines = document.querySelector('.mine')
var elimogi = document.querySelector('.playAgainBtn')


const MINE = '💣'
const MARKED = '🚩'
const GAME_OVER = '😔'
const WINNER_IMG = '😎'
const LIFE_IMG = '❤'

var gBoard;
var elBoardContainer = document.querySelector('.board')


// game state
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,

}


var gLevel = {
    SIZE: 4,
    MINES: 2,
    lives: 0
}


function init() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    // console.log('gboard', gBoard)
    tableGame.style.pointerEvents = 'auto'
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    console.log('glevel size', gLevel.SIZE)
}


function gameLevel(elBtn) {
    var level = elBtn.getAttribute('data-cellNums')
    if (level === '4') {
        gLevel.lives = 1
        gLevel.SIZE = 4
        gLevel.MINES = 2
        buildBoard(8)
    } else if (level === '8') {
        gLevel.lives = 3
        gLevel.SIZE = 8
        gLevel.MINES = 12
        buildBoard(8)
    } else {
        gLevel.lives = 3
        gLevel.SIZE = 12
        gLevel.MINES = 30
        buildBoard(12)
    }
    init()
}


function buildBoard() {
    var SIZE = gLevel.SIZE;
    // var MINES = gLevel.MINES
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            var cellObj = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cellObj
        }
    }

    for (var i = 0; i < gLevel.MINES; i++) {
        var minePosition = board[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)].isMine = true
    }

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board)
        }
    }
    console.table(board);

    return board;
}


function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        var cell = board[i]

        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];

            var className = (cell.isMine) ? 'mine' : ''

            strHTML += `<td data-i="${i}" data-j="${j}" onclick="cellClicked(this, ${i},${j})" onclick="cellMarked(this, ${i},${j})" class="${className}"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board');

    elContainer.innerHTML = strHTML;
   
}


window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    cellMarked(e.target)
}, false);


function cellMarked(elCell) {

    if (gBoard[elCell.dataset.i][elCell.dataset.j].isShown) return

    if (!gBoard[elCell.dataset.i][elCell.dataset.j].isMarked) {
        gBoard[elCell.dataset.i][elCell.dataset.j].isMarked = true
        gGame.markedCount++
        elCell.innerHTML = `${MARKED}`
        
    } else {
        gBoard[elCell.dataset.i][elCell.dataset.j].isMarked = false
        elCell.innerHTML = ``
        gGame.markedCount--
       
    }
    checkGameOver()
}



function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}



function cellClicked(elCell, cellI, cellJ) {
    console.log(cellI, cellJ)
    if (gBoard[cellI][cellJ].isMine) {
        elCell.innerHTML = `${MINE}`
        gBoard[cellI][cellJ].isShown = true
        gBoard[cellI][cellJ].isMine = true
        tableGame.style.pointerEvents = 'none'
        showMines();
        gameOver() 
    } else if (gBoard[cellI][cellJ].minesAroundCount > 0) {
        gGame.shownCount++
        gBoard[cellI][cellJ].isShown = true;
        elCell.innerHTML = `${gBoard[cellI][cellJ].minesAroundCount}`
    } else if (gBoard[cellI][cellJ].minesAroundCount === 0) {
        gGame.shownCount++
        elCell.style.backgroundColor = 'darkgrey'
        gBoard[elCell.dataset.i][elCell.dataset.j].isShown = true
        // gBoard[cellI][cellJ].isShown = true;
        expandShown(gBoard, cellI, cellJ)
    } else if (gBoard[cellI][cellJ].isMarked) return
    console.log('cell cliced', gBoard[elCell.dataset.i][elCell.dataset.j])
    // console.log('show count',gGame.shownCount)
    checkGameOver()
}


function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].minesAroundCount === 0) {

                // update the model:
                board[cellI][cellI].isShown = true;
                gGame.shownCount++

                // update the dom:
                document.querySelector(`[data-i="${i}"][data-j="${j}"]`).style.backgroundColor = "darkgrey";
            }
        }
    }
}



function checkGameOver() {
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === (gLevel.SIZE - gLevel.MINES)) {
        victory()
    }
}

function gameOver() {
    console.log('lost')
    showMines()
    gGame.isOn = false
    elimogi.innerHTML = `${GAME_OVER}`
}

function victory (){
    elimogi.innerHTML = `${WINNER_IMG}`
    init()
}


function playAgain() {

    elimogi.innerHTML = `😀`
    init()
}

var minesPos = []
function showMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
                gBoard[i][j].isShown = true;
                document.querySelector(`[data-i="${i}"][data-j="${j}"]`).innerHTML = MINE;
            }
        }
    }
}


