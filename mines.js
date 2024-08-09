document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("minesCanvas");
    const ctx = canvas.getContext("2d");
    const status = document.getElementById("status");
    const betButton = document.getElementById("betButton");

    const boardSize = 5;
    const cellSize = canvas.width / boardSize;
    let minesCount = parseInt(document.getElementById('mines').value);
    let board = [];
    let mines = [];
    let gameActive = false;
    let cellRevealed = false;

    let i = 1;
    let profit = 1;
    let currentBetAmount = 0;

    function initializeBoard() {
        board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
        mines = [];
        while (mines.length < minesCount) {
            const x = Math.floor(Math.random() * boardSize);
            const y = Math.floor(Math.random() * boardSize);
            if (!mines.some(mine => mine.x === x && mine.y === y)) {
                mines.push({ x, y });
                board[x][y] = 1;
            }
        }
        renderBoard();
        status.innerText = "";
    }

    function adjustBetAmount(multiplier) {
        const betAmountInput = document.getElementById('betAmount');
        let currentAmount = parseFloat(betAmountInput.value);
    
        if (isNaN(currentAmount)) {
            currentAmount = 0;
        }
    
        let newAmount = currentAmount * multiplier;
    
        // Limit newAmount to maximum and minimum values
        if (newAmount >= 100000) {
            newAmount = 100000;
            showErrorMessage('Maximum bet amount reached: 100,000', multiplier);
        }
        if (newAmount < 0.001) {
            newAmount = 0.001;
            showErrorMessage('Minimum bet amount reached: 0.001', multiplier);
        }
    
        betAmountInput.value = newAmount.toFixed(8);
    }
    window.adjustBetAmount = adjustBetAmount;
    function renderBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000';

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);

                if (board[i][j] === 2) { // Revealed cell
                    ctx.fillStyle = '#888';
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                    ctx.fillStyle = '#000';
                    ctx.fillText('✔️', i * cellSize + cellSize / 4, j * cellSize + 3 * cellSize / 4);
                } else if (board[i][j] === 3) { // Mine or game over cell
                    ctx.fillStyle = 'red';
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                    // Apply fade out effect for revealed mines
                    ctx.globalAlpha = 0.5; // Adjust opacity level for fade out
                    ctx.fillStyle = '#000';
                    ctx.fillText('💣', i * cellSize + cellSize / 4, j * cellSize + 3 * cellSize / 4);
                    ctx.globalAlpha = 1; // Reset opacity for other elements
                }
            }
        }
    }

    function revealCell(x, y) {
        if (!gameActive) return;

        if (board[x][y] === 1) {
            board[x][y] = 3; // Mine
            status.innerText = "Game Over!";
            endGame();
        } else {
            board[x][y] = 2; // Revealed
            cellRevealed = true;
            checkWinCondition();
        }
        renderBoard();
    }

    function checkWinCondition() {
        let revealedCells = board.flat().filter(cell => cell === 2).length;
        if (revealedCells === (boardSize * boardSize - minesCount)) {
            status.innerText = "You Win!";
            endGame();
        }
    }

    function startGame() {
        minesCount = parseInt(document.getElementById('mines').value);
        currentBetAmount = parseFloat(document.getElementById('betAmount').value);
        initializeBoard();
        gameActive = true;
        betButton.innerText = "Cashout";

        // Reset profit and step counter for a new game
        i = 1;
        profit = 1;
    }

    function revealAllCells() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 1) {
                    board[i][j] = 3; // Mine
                } else if (board[i][j] === 0) {
                    board[i][j] = 2; // Revealed
                }
            }
        }
        renderBoard();
    }

    function endGame() {
        gameActive = false;
        betButton.innerText = "Bet";
        revealAllCells();

        // Add result to table
        addResultToTable(currentBetAmount, profit, currentBetAmount * profit);
    }

    function handleCanvasClick(event) {
        if (!gameActive) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / cellSize);
        const y = Math.floor((event.clientY - rect.top) / cellSize);

        if (board[x][y] === 0) {
            revealCell(x, y);
            console.log(minesCount);
            let p = 25 - minesCount;
            profit = profit * ((25 - i + 1) / (p - i + 1));
        } else if (board[x][y] === 1) {
            revealCell(x, y);
            profit = 0;
            i = 0;
        }

        console.log(profit);
        i += 1;
    }

    
    function addResultToTable(betAmount, multiplier, payout) {
        const resultsTableBody = document.getElementById('resultsTable').querySelector('tbody');

        const row = document.createElement('tr');

        // Bet Amount
        const betAmountCell = document.createElement('td');
        betAmountCell.textContent = betAmount.toFixed(8);
        row.appendChild(betAmountCell);

        // Multiplier
        const multiplierCell = document.createElement('td');
        multiplierCell.textContent = `${multiplier.toFixed(2)}x`;
        row.appendChild(multiplierCell);

        // Payout
        const payoutCell = document.createElement('td');
        payoutCell.textContent = payout.toFixed(8);
        row.appendChild(payoutCell);

        resultsTableBody.appendChild(row);
    }

    canvas.addEventListener("click", handleCanvasClick);

    betButton.addEventListener("click", () => {
        if (gameActive) {
            if (cellRevealed) { // Allow cashout only if a cell has been revealed
                status.innerText = "You cashed out!";
                cellRevealed = false;
                endGame();
            } else {
                alert("You must reveal at least one cell before cashing out.");
            }
        } else {
            startGame();
        }
    });

    initializeBoard();
});
