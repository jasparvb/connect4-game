/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 *  
*/

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
let message = document.querySelector('.game-message');

const startBtn = document.querySelector('.start');
startBtn.addEventListener("click", startGame);

//Function to start game again once finished
function startGame() {
  message.classList.add('hide');
  document.querySelector('#board').innerHTML = '';
  makeBoard();
  makeHtmlBoard()
  currPlayer = 1;
}

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.querySelector('#board');

  // create the top row and add an event listener to the row
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  
  //create 7 columns with incrementing id and add them to the top row. Add a div to each column
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    const piece = document.createElement("div");
    piece.classList.add("piece");
    headCell.setAttribute("id", x);
    headCell.append(piece);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create rows and columns for the whole board and add ids in the format row#-col#
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  
   for(let y = HEIGHT-1; y > -1; y--) {
    if (!board[y][x]) return y;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // Creates a div and inserts into correct table cell, adds a class according to the player
  let piece = document.createElement('div');
  let cell = document.getElementById(`${y}-${x}`);

  piece.classList.add(`p${currPlayer}`,"piece");
  //changes the starting position of the piece to be at the top of the board, so it will animate downwards
  piece.style.top = ((y+1) * -72) + "px";
  cell.append(piece);
  //changes piece position to its actual position on the board
  setTimeout(function(){
    piece.style.top = 0;
  }, 50);
}

/** endGame: announce game end and winner, or if it's a tie*/

function endGame(msg) {
  setTimeout(function() {
    message.classList.remove('hide');
    message.firstElementChild.innerText = msg;
    document.querySelector('#column-top').removeEventListener("click", handleClick);
  }, 500);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell (parentNode since we put a div in there)
  let x = evt.target.parentNode.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // update in-memory board
  board[y][x] = currPlayer;

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
  // check for tie
  else if (checkForTie()) {
    return endGame("Game over, nobody won!");
  }
  

  // switch currPlayer 1 <-> 2
  currPlayer === 1 ? currPlayer++ : currPlayer--;
  //change the piece color in the top column
  document.querySelector('#column-top').classList.toggle('player2');
}

/** checkForTie: check board to see if all cells have content > 0 */
function checkForTie() {
  return board.every(val => val.every(v => v > 0));
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }


  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //checks every horizontal option for every square on the board (some are outside the board)
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //checks every vertical option
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //checks every diagonal right option
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //checks every diagonal left option

      //return true if there are four in a row horizontally, vertically, diagonally right, or diagonally left
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

