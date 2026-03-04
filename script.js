let currentPuzzle = [];
let solutionBoard = [];
let currentBoard = [];
let selectedCell = null;

const boardElement = document.getElementById('game-board');
const numberBtns = document.querySelectorAll('.number-btn');
const messageElement = document.getElementById('message');
const newGameBtn = document.getElementById('new-game-btn');
const solveBtn = document.getElementById('solve-btn');
const clearBtn = document.getElementById('clear-btn');
const difficultySelect = document.getElementById('difficulty');

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    startNewGame();
});

function setupEventListeners() {
    numberBtns.forEach(button => {
        button.addEventListener('click', function() {
            if (selectedCell) {
                const number = parseInt(this.textContent);
                enterNumber(number);
            }
        });
    });

    clearBtn.addEventListener('click', () => {
        if (selectedCell) {
            enterNumber(0);
        }
    });

    newGameBtn.addEventListener('click', startNewGame);
    solveBtn.addEventListener('click', solveSudokuDisplay);
}

function startNewGame() {
    messageElement.textContent = "Gerando novo Sudoku...";
    selectedCell = null;
    
    solutionBoard = generateFullBoard();
    
    const difficulty = difficultySelect.value;
    currentPuzzle = createPuzzle(solutionBoard, difficulty);

    currentBoard = JSON.parse(JSON.stringify(currentPuzzle));
    
    createBoard(currentPuzzle);
    messageElement.textContent = "Jogo pronto! Boa sorte.";
}

function generateFullBoard() {
    let board = Array(9).fill(0).map(() => Array(9).fill(0));
    solve(board);
    return board;
}

function createPuzzle(fullBoard, difficulty) {
    let puzzle = JSON.parse(JSON.stringify(fullBoard));
    let cellsToKeep;

    switch (difficulty) {
        case 'easy':
            cellsToKeep = 35;
            break;
        case 'medium':
            cellsToKeep = 28;
            break;
        case 'hard':
            cellsToKeep = 22;
            break;
        default:
            cellsToKeep = 28;
    }

    let cellsToRemove = 81 - cellsToKeep;
    let count = 0;

    while (count < cellsToRemove) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        
        if (puzzle[r][c] !== 0) {
            puzzle[r][c] = 0;
            count++;
        }
    }

    return puzzle;
}

function solve(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                
                for (let num of numbers) {
                    if (isValidPlacement(r, c, num, board)) {
                        board[r][c] = num;
                        
                        if (solve(board)) {
                            return true;
                        }
                        
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValidPlacement(row, col, num, board) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num && i !== col) return false;
        if (board[i][col] === num && i !== row) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const r = startRow + i;
            const c = startCol + j;
            if (board[r][c] === num && (r !== row || c !== col)) {
                return false;
            }
        }
    }
    return true;
}

function createBoard(puzzle) {
    boardElement.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            const value = puzzle[r][c];

            if (value !== 0) {
                cell.textContent = value;
                cell.classList.add('pre-filled');
            } else {
                cell.textContent = '';
                cell.addEventListener('click', () => selectCell(cell));
            }

            boardElement.appendChild(cell);
        }
    }
    checkBoardValidity();
}

function selectCell(cell) {
    if (cell.classList.contains('pre-filled')) return; 

    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }

    selectedCell = cell;
    selectedCell.classList.add('selected');
}

function enterNumber(number) {
    if (!selectedCell || selectedCell.classList.contains('pre-filled')) return;

    const r = parseInt(selectedCell.dataset.row);
    const c = parseInt(selectedCell.dataset.col);

    selectedCell.textContent = number === 0 ? '' : number;
    currentBoard[r][c] = number;

    selectedCell.classList.remove('selected');
    selectedCell = null;
    checkBoardValidity();
}

function checkBoardValidity() {
    let allFilled = true;
    let hasMistake = false;

    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('mistake');
        cell.classList.remove('solved');
    });

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const value = currentBoard[r][c];
            const cellElement = boardElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);

            if (value === 0) {
                allFilled = false;
                continue;
            }

            if (value !== solutionBoard[r][c]) {
                cellElement.classList.add('mistake');
                hasMistake = true;
            }
        }
    }

    if (allFilled && !hasMistake) {
        messageElement.textContent = "Parabéns! Você resolveu o Sudoku!";
    } else if (hasMistake) {
        messageElement.textContent = "Há erros no tabuleiro. Continue tentando!";
    } else {
        messageElement.textContent = "";
    }
}

function solveSudokuDisplay() {
    document.querySelectorAll('.cell').forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        
        if (currentPuzzle[r][c] === 0) {
            cell.textContent = solutionBoard[r][c];
            cell.classList.add('solved');
            currentBoard[r][c] = solutionBoard[r][c];
        }
    });
    
    checkBoardValidity(); 
    messageElement.textContent = "Aqui está a solução!";
}