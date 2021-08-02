'use strict'
// TYPES
const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = 'GLUE';
// IMAGES
const GAMER_IMG = '<img src="img/gamer.png">';
const BALL_IMG = '<img src="img/ball.png">';
const GLUE_IMG = '<img src="img/candy.png">';
// PASSAGE IDXs
const PASSAGE_1 = { row: 5, col: 0 };
const PASSAGE_2 = { row: 5, col: 11 };
const PASSAGE_3 = { row: 0, col: 5 };
const PASSAGE_4 = { row: 9, col: 5 };



// Model:
var gBoard;
var gGamerPos;
var gRndBallTimer;
var gRndGlueTimer;
var gScore = 0;
var gBallCount = 2;
var gAudio = new Audio('collect.wav');
var gIsStuck = false;


// starts the game with 2 balls placed
function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gScore = 0;
	gBallCount = 2;
	document.querySelector('.score').innerHTML = 'Score: None collected';
	document.querySelector('.victory').innerHTML = '';
	gBoard = buildBoard();
	renderBoard(gBoard);
	gRndBallTimer = setInterval(renderRndBall, 2000);
	gRndGlueTimer = setInterval(renderRndGlue, 5000);
}

// checks gScore === gBallCount
function checkScore() {
	// user win?
	if (gScore === gBallCount) {
		clearInterval(gRndBallTimer);
		// render win situation
		var elVictory = document.querySelector('.victory');
		elVictory.innerHTML = 'You won!<button onclick="initGame()">Play Again</button>'
	}
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player to a specific location
function moveTo(i, j) {
	renderCell(gGamerPos, GAMER_IMG)
	if (!gIsStuck) {
		var targetCell = gBoard[i][j];
		if (targetCell.type === WALL) return;
		// Calculate distance to make sure we are moving to a neighbor cell
		var iAbsDiff = Math.abs(i - gGamerPos.i);
		var jAbsDiff = Math.abs(j - gGamerPos.j);
		// If the clicked Cell is one of the four allowed
		if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
			if (targetCell.gameElement === GLUE) {
				freezeGame();
			}
			if (targetCell.gameElement === BALL) {
				gAudio.play();
				gScore++;
				document.querySelector('.score').innerHTML = `Score: ${gScore}`;
				checkScore();
			}
			// Update the model
			gBoard[gGamerPos.i][gGamerPos.j].gameElement = '';
			// Update the dom
			renderCell(gGamerPos, '')
			if (PASSAGE_1.row === i && PASSAGE_1.col === j) {
				gGamerPos.i = PASSAGE_2.row;
				gGamerPos.j = PASSAGE_2.col - 1;
				gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
				renderCell(gGamerPos, GAMER_IMG);
				return;
			}
			if (PASSAGE_2.row === i && PASSAGE_2.col === j) {
				gGamerPos.i = PASSAGE_1.row;
				gGamerPos.j = PASSAGE_1.col + 1;
				gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
				renderCell(gGamerPos, GAMER_IMG);
				return;
			}
			if (PASSAGE_3.row === i && PASSAGE_3.col === j) {
				gGamerPos.i = PASSAGE_4.row - 1;
				gGamerPos.j = PASSAGE_4.col;
				gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
				renderCell(gGamerPos, GAMER_IMG);
				return;
			}
			if (PASSAGE_4.row === i && PASSAGE_4.col === j) {
				gGamerPos.i = PASSAGE_3.row + 1;
				gGamerPos.j = PASSAGE_3.col;
				gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
				renderCell(gGamerPos, GAMER_IMG);
				return;
			}
			gGamerPos.i = i;
			gGamerPos.j = j;
			gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
			renderCell(gGamerPos, GAMER_IMG);
		} else console.log('TOO FAR', iAbsDiff, jAbsDiff);
	}
}

// RENDER NEXT GLUE
function renderRndGlue() {
	var i = getRandomInteger(1, 9);
	var j = getRandomInteger(1, 11);
	var rndCell = { i, j };
	// checks if not ball position
	if (gBoard[i][j].gameElement === BALL) {
		console.log('ball pos - glue');
		renderRndBall();
	}
	// checks if not gamer position
	if (rndCell.i === gGamerPos.i) {
		if (rndCell.j === gGamerPos.j) {
			console.log('gamer pos - glue');
			renderRndBall();
		} else {
			gBoard[i][j].gameElement = GLUE;
			renderCell(rndCell, GLUE_IMG);
			setTimeout(() => {
				// Update the model
				gBoard[i][j].gameElement = '';
				// Update the dom
				renderCell(rndCell, '')
			}, 3000);
		}
	}
	else {
		gBoard[i][j].gameElement = GLUE;
		renderCell(rndCell, GLUE_IMG);
		setTimeout(() => {
			// Update the model
			gBoard[i][j].gameElement = '';
			// Update the dom
			renderCell(rndCell, '')
		}, 3000);
	}
}
function freezeGame() {
	gIsStuck = true;
	setTimeout(() => {
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);
		gIsStuck = false;
	}, 3000);
}
// RENDER NEXT BALL
function renderRndBall() {
	var i = getRandomInteger(1, 9);
	var j = getRandomInteger(1, 11);
	var rndCell = { i, j };
	// checks if not ball position
	if (gBoard[i][j].gameElement === BALL) {
		console.log('ball pos');
		renderRndBall();
	}
	// checks if not gamer position
	if (rndCell.i === gGamerPos.i) {
		if (rndCell.j === gGamerPos.j) {
			console.log('gamer pos');
			renderRndBall();
		} else {
			gBoard[i][j].gameElement = BALL;
			renderCell(rndCell, BALL_IMG);
			gBallCount++;
		}
	}
	else {
		gBoard[i][j].gameElement = BALL;
		renderCell(rndCell, BALL_IMG);
		gBallCount++;
	}
}

// BUILD MODEL
function buildBoard() {
	var board = createMat(10, 12);
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = { type: FLOOR, gameElement: null }
			// COL PASSAGE
			if (i === 0 || i === board.length - 1) {
				j === 5 ? cell.type = FLOOR : cell.type = WALL;
			}
			// ROW PASSAGE
			else if (j === 0 || j === board[0].length - 1) {
				i === 5 ? cell.type = FLOOR : cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	board[3][8].gameElement = BALL;
	board[5][4].gameElement = BALL;
	gBallCount = 2;
	return board;
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

// RENDER DOM
function renderBoard(board) {
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];
			var cellClass = getClassName({ i, j })
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';
			strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`;
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}
			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}