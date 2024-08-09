function startGame(game) {
    alert(`Starting ${game} game!`);
    window.location.href = `${game}.html`;
}

function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));
}

window.onload = loadHeader;
