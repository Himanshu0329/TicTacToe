document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');
    const resetButton = document.getElementById('reset');
    const tapSound = document.getElementById('tapSound');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    let currentPlayer = 'X';
    let gameActive = true;
    let boardState = Array(9).fill(null);
    let scores = { X: 0, O: 0 };

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const cell = event.target;
        const index = cell.getAttribute('data-index');

        if (boardState[index] || !gameActive) return;

        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.setAttribute('data-player', currentPlayer);
        tapSound.play();

        if (checkWin()) {
            scores[currentPlayer]++;
            updateScores();
            gameActive = false;
            showPopup(`Player ${currentPlayer} wins!`);
            setTimeout(resetGame, 2000);
            return;
        }

        if (boardState.every(cell => cell)) {
            gameActive = false;
            showPopup('Draw!');
            setTimeout(resetGame, 2000);
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => boardState[index] === currentPlayer);
        });
    }

    function updateScores() {
        scoreX.textContent = scores.X;
        scoreO.textContent = scores.O;
    }

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.classList.add('active');
        createConfetti();
        setTimeout(() => {
            popup.classList.remove('active');
        }, 2000);
    }

    function createConfetti() {
        const colors = ['#61dafb', '#ff6b6b', '#ffffff', '#21a1f1'];
        const confettiCount = 150;
        const confettiContainer = document.querySelector('.confetti');
        confettiContainer.innerHTML = '';

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0;
                transform: translateY(0);
                animation: confetti-fall ${1 + Math.random() * 2}s linear forwards;
            `;
            confettiContainer.appendChild(confetti);
        }
    }

    function resetGame() {
        boardState.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.removeAttribute('data-player');
        });
        currentPlayer = 'X';
        gameActive = true;
        popup.classList.remove('active');
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}); 