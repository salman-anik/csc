const cells = document.querySelectorAll('.cell');
  const status = document.getElementById('status');
  const restartBtn = document.getElementById('restart');

  let board = ['', '', '', '', '', '', '', '', ''];
  const human = 'X';
  const ai = 'O';
  let gameActive = true;

  const winningConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] !== '' || !gameActive) return;

    makeMove(index, human);
    if (!gameActive) return;

    status.textContent = 'AI is thinking...';
    setTimeout(() => {
      const bestMove = minimax(board, ai).index;
      makeMove(bestMove, ai);
    }, 300);
  }

  function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;

    if (checkWin(board, player)) {
      status.textContent = player === human ? '🔥 You win!' : '💻 AI wins!';
      gameActive = false;
      return;
    }

    if (board.every(cell => cell !== '')) {
      status.textContent = "🤝 It's a draw!";
      gameActive = false;
      return;
    }

    status.textContent = player === human ? "AI's turn (O)" : "Your turn (X)";
  }

  function checkWin(board, player) {
    return winningConditions.some(condition => condition.every(i => board[i] === player));
  }

  // Minimax algorithm
  function minimax(newBoard, player) {
    const availSpots = newBoard
      .map((val, idx) => val === '' ? idx : null)
      .filter(i => i !== null);

    if (checkWin(newBoard, human)) {
      return { score: -10 };
    } else if (checkWin(newBoard, ai)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      const move = {};
      move.index = availSpots[i];
      newBoard[availSpots[i]] = player;

      if (player === ai) {
        const result = minimax(newBoard, human);
        move.score = result.score;
      } else {
        const result = minimax(newBoard, ai);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = '';
      moves.push(move);
    }

    let bestMove;
    if (player === ai) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }

  function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    status.textContent = 'Your turn (X)';
    cells.forEach(cell => cell.textContent = '');
  }

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  restartBtn.addEventListener('click', restartGame);