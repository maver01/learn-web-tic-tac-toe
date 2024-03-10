import React, { useState } from 'react';
import Board from './Board.js'; // Import Board component
import calculateWinner from '../helper/functions.js'; // Import helper function

// Game component
function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Handle the play
  async function handlePlay(squareIndex) {
    const squaresCopy = [...currentSquares];
    if (calculateWinner(squaresCopy) || squaresCopy[squareIndex]) {
      return;
    }
    squaresCopy[squareIndex] = xIsNext ? 'X' : 'O';

    try {
      const response = await fetch('https://localhost:5000/api/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ squareIndex }), // Send squareIndex in the body
      });
      const data = await response.json();
      console.log(data); // Handle response from backend if needed
    } catch (error) {
      console.error('Error:', error);
    }

    // Update the game state if the move is valid
    setHistory(history.slice(0, currentMove + 1).concat([squaresCopy]));
    setCurrentMove(currentMove + 1);
  }

  // Jump to a specific move
  function jumpTo(move) {
    setCurrentMove(move);
  }

  // Generate move history
  const moves = history.map((stepSquares, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} className={move === currentMove ? 'selected' : ''}>
          {desc}
        </button>
      </li>
    );
  });

  // Determine the winner
  const winner = calculateWinner(currentSquares);
  const winningLine = winner ? winner.line : null;

  // Render the game
  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winningLine={winningLine}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game; 