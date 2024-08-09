const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');

let pegRadius = 6;
let ballRadius = 15;
const pegs = [];
const balls = [];
let rows = document.getElementById('rows').value; // Initial value

const gravity = 0.3;
const friction = 0;
const slotCount = 9;
const resultsTableBody = document.getElementById('resultsTable').querySelector('tbody');

const multipliersMatrix = {
    low: {
        8: [5.6 , 2.1 , 1.1 , 1 , 0.5 , 1 , 1.1 , 2.1 , 5.6],
        9: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6],
        10: [8.9 , 3 , 1.4 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.4 , 3 , 8.9],
        11: [8.4 , 3 , 1.9 , 1.3 , 1 , 0.7 , 0.7 , 1 , 1.3 , 1.9 , 3 , 8.4],
        12: [10 , 3 , 1.6 , 1.4 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.4 , 1.6 , 3 , 10],
        13: [5.6 , 2.1 , 1.1 , 1 , 0.5 , 1 , 1.1 , 2.1 , 5.6],
        14: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6],
        15: [8.9 , 3 , 1.4 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.4 , 3 , 8.9],
        16: [16 , 9 , 2 , 1.4 , 1.4 ,1.2 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.2 , 1.4 , 1.4 , 2 , 9 , 16]
    }, 
    medium: {
        8: [5.6 , 2.1 , 1.1 , 1 , 0.5 , 1 , 1.1 , 2.1 , 5.6],
        9: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6],
        10: [8.9 , 3 , 1.4 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.4 , 3 , 8.9],
        11: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6],
        12: [8.9 , 3 , 1.4 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.4 , 3 , 8.9],
        13: [5.6 , 2.1 , 1.1 , 1 , 0.5 , 1 , 1.1 , 2.1 , 5.6],
        14: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6],
        15: [8.9 , 3 , 1.4 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.4 , 3 , 8.9],
        16: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6]
    },
    high: {
        8: [5.6 , 2.1 , 1.1 , 1 , 0.5 , 1 , 1.1 , 2.1 , 5.6],
        9: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6],
        10: [8.9 , 3 , 1.4 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.4 , 3 , 8.9],
        11: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6],
        12: [8.9 , 3 , 1.4 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.4 , 3 , 8.9],
        13: [5.6 , 2.1 , 1.1 , 1 , 0.5 , 1 , 1.1 , 2.1 , 5.6],
        14: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6],
        15: [8.9 , 3 , 1.4 , 1.1 , 1 , 0.5 , 1 , 1.1 , 1.4 , 3 , 8.9],
        16: [5.6 , 2 , 1.6 , 1 , 0.7 , 0.7 , 1 , 1.6 , 2 , 5.6]
    }
};

let slotMultipliers = multipliersMatrix.medium[rows]; // Default to medium risk with the initial row count

let isBallRolling = false;
let disableControls = false;

function updateMultipliers() {
    if (!isBallRolling) {
        const riskLevel = document.getElementById('riskLevel').value;
        const rowCount = document.getElementById('rows').value;
        slotMultipliers = multipliersMatrix[riskLevel][rowCount];
        displayMultipliers();
    }
}

function displayMultipliers() {
    const multipliersContainer = document.getElementById('multipliers');
    multipliersContainer.innerHTML = ''; // Clear previous multipliers

    slotMultipliers.forEach(multiplier => {
        const multiplierDiv = document.createElement('div');
        multiplierDiv.classList.add('multiplier');
        multiplierDiv.textContent = `${multiplier}x`;
        multipliersContainer.appendChild(multiplierDiv);
    });
}

function updateRows() {
    if (!isBallRolling) {
        rows = document.getElementById('rows').value;
        initializePegs();
        updateMultipliers(); // Update multipliers whenever rows change
    }
}

function initializePegs() {
    let rowss = parseInt(rows);
    pegRadius = 6 - (rowss - 8) * 0.375;
    ballRadius = 15 - (rowss - 8) * 0.625;
    pegs.length = 0; // Clear existing pegs
    const spacingY = canvas.height / (rowss + 2);
    let ballwidth = (canvas.width - 25) / (rowss + 1);
    for (let row = 1; row <= rowss; row++) {
        for (let col = 0; col < row + 2; col++) {
            let firstspace = (canvas.width - (ballwidth * (row + 1))) / 2;
            const x = col * ballwidth + firstspace;
            const y = (row) * spacingY;
            pegs.push({ x, y });
        }
    }
    drawPegs();
}

function drawPegs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    pegs.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Initial setup
updateRows();

function drawSlots() {
    ctx.fillStyle = 'black';
    const slotWidth = canvas.width / slotCount;
    for (let i = 0; i <= slotCount; i++) {
        const x = i * slotWidth;
        ctx.fillRect(x - 1, canvas.height - 50, 2, 50);
    }
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

function showErrorMessage(message, multiplier) {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-message');
    errorContainer.textContent = message;

    const multiplierButton = document.querySelector(`.bet-multiplier[data-multiplier="${multiplier}"]`);
    if (multiplierButton) {
        multiplierButton.parentNode.insertBefore(errorContainer, multiplierButton.nextSibling);
    }

    // Remove error message after 3 seconds
    setTimeout(() => {
        errorContainer.remove();
    }, 3000);
}
// let i=1;
function dropBall() {
        let rowss = parseInt(rows);
        let ballwidth = (canvas.width - 25) / (rowss + 1);
        let firstspace = (canvas.width - (ballwidth * 2)) / 2;
        const x = firstspace + Math.random() * ballwidth * 2;
        // const x = firstspace + 30.4;
        // i+=1;
        console.log(x);
        const betAmount = parseFloat(document.getElementById('betAmount').value);
        balls.push({ x, y: 0, vx: 0, vy: 2, betAmount });
        isBallRolling = true;

        // Disable controls while ball is rolling
        disableControls = true;
}
function getRandomColor() {
    var colors = ['red', 'yellow', 'green', 'blue'];
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[1];
}

function drawBalls() {
    ctx.fillStyle = getRandomColor();
    for (const ball of balls) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateBalls() {
    const gravity = 0.3;
    const damping = 0.93;
    const friction = 0.05;
    const minVelocity = 0.1; // Minimum velocity to consider the ball settled

    for (const ball of balls) {
        ball.vy += gravity;
        ball.vy *= damping; // Apply damping to simulate energy loss
        ball.vx *= damping; // Apply damping to simulate energy loss
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Collision with pegs
        for (const peg of pegs) {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < pegRadius + ballRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (pegRadius + ballRadius - distance) * 0.5; // Force proportional to penetration depth
                ball.vx += Math.cos(angle) * force;
                ball.vy += Math.sin(angle) * force;
                ball.vx *= (1 - friction); // Apply friction
                ball.vy *= (1 - friction); // Apply friction
            }
        }

        // Collision with walls
        if (ball.x < ballRadius) {
            ball.x = ballRadius;
            ball.vx = -ball.vx;
        }
        if (ball.x > canvas.width - ballRadius) {
            ball.x = canvas.width - ballRadius;
            ball.vx = -ball.vx;
        }

        // Collision with floor
        if (ball.y > canvas.height - ballRadius - 50) {
            ball.y = canvas.height - ballRadius - 50;
            ball.vy = -ball.vy * friction;

            const slotWidth = canvas.width / slotCount;
            const slotIndex = Math.floor(ball.x / slotWidth);

            // Check if ball is settled in a slot
            if (Math.abs(ball.vy) < minVelocity) {
                const multiplier = slotMultipliers[slotIndex];
                const payout = ball.betAmount * multiplier;
                console.log(ball);
                addResultToTable(ball, multiplier, payout);
                balls.splice(balls.indexOf(ball), 1); // Remove the ball from the array
                isBallRolling = false;
                disableControls = false; // Enable controls after ball settles
            }
        }
    }
}

function addResultToTable(ball, multiplier, payout) {
    const row = document.createElement('tr');
    const ballCell = document.createElement('td');
    ballCell.textContent = `Ball ${balls.length + 1}`;
    const multiplierCell = document.createElement('td');
    multiplierCell.textContent = `${multiplier}x`;
    const payoutCell = document.createElement('td');
    payoutCell.textContent = payout.toFixed(8);
    row.appendChild(ballCell);
    row.appendChild(multiplierCell);
    row.appendChild(payoutCell);
    resultsTableBody.appendChild(row);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPegs();
    drawBalls();
    drawSlots();
}

function update() {
    updateBalls();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
document.addEventListener('DOMContentLoaded', function() {
    // Access and log the initial value of the input field
    console.log(document.getElementById('noofbets').value);

    // Add event listener to the betButton
    document.getElementById('betButton').addEventListener('click', function() {
        // Get the current value of noofbets input field
        let numberOfBets = parseInt(document.getElementById('noofbets').value);

        // Validate if numberOfBets is 0 or greater
        if (numberOfBets === 0) {
            dropBall();
        } else if (numberOfBets > 0) {
            for (let i = 0; i < numberOfBets; i++) {
                dropBall();
            }
        } else {
            // Handle invalid input if needed
            console.error('Invalid input for number of bets');
        }
    });
});



document.getElementById('riskLevel').addEventListener('change', function() {
    if (!disableControls) {
        updateMultipliers();
    }
});
document.getElementById('rows').addEventListener('change', function() {
    if (!disableControls) {
        updateRows();
    }
});
updateMultipliers(); // Initial call to set up multipliers based on the default settings
