document.addEventListener("DOMContentLoaded", () => {
    const betCanvas = document.getElementById("betCanvas");
    const ctx = betCanvas.getContext("2d");
    const betSlider = document.getElementById("betSlider");
    const betButton = document.getElementById("betButton");
    const betAmountInput = document.getElementById("betAmount");
    const resultsTableBody = document.getElementById("resultsTable").querySelector("tbody");

    let sliderValue = betSlider.value;

    function drawSlider() {
        const width = betCanvas.width;
        const height = betCanvas.height;

        ctx.clearRect(0, 0, width, height);

        // Draw red part
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, sliderValue / 100 * width, height);

        // Draw green part
        ctx.fillStyle = "red";
        ctx.fillRect(sliderValue / 100 * width, 0, width - (sliderValue / 100 * width), height);

        // Draw slider cursor
        ctx.fillStyle = "blue";
        ctx.fillRect((sliderValue / 100 * width) - 2, 0, 4, height);

        // Draw bet amount, multiplier, roll over, win chance
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(`Win Chance: ${sliderValue}%`, 10, 20);
        ctx.fillText(`Roll Over: ${(100 - sliderValue).toFixed(2)}`, 10, 40);
        ctx.fillText(`Multiplier: ${(99 / sliderValue).toFixed(4)}x`, 10, 60);
        ctx.fillText(`Bet Amount: ${betAmountInput.value}`, 10, 80);
    }

    betSlider.addEventListener("input", () => {
        sliderValue = betSlider.value;
        drawSlider();
    });

    betButton.addEventListener("click", () => {
        const winChance = sliderValue;
        const betAmount = parseFloat(betAmountInput.value);
        const multiplier = (99 / winChance).toFixed(4);
        const result = Math.random() * 100;

        let payout = 0;
        if (result <= winChance) {
            payout = betAmount * parseFloat(multiplier);
        }

        const row = document.createElement("tr");
        const betAmountCell = document.createElement("td");
        betAmountCell.textContent = betAmount.toFixed(8);
        row.appendChild(betAmountCell);
        const multiplierCell = document.createElement("td");
        multiplierCell.textContent = `${multiplier}x`;
        row.appendChild(multiplierCell);
        const payoutCell = document.createElement("td");
        payoutCell.textContent = payout.toFixed(8);
        row.appendChild(payoutCell);

        resultsTableBody.appendChild(row);
    });

    drawSlider();
});

function adjustBetAmount(factor) {
    const betAmountInput = document.getElementById("betAmount");
    const currentBetAmount = parseFloat(betAmountInput.value);
    betAmountInput.value = (currentBetAmount * factor).toFixed(8);
}
