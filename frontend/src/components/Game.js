import React, { useState } from 'react';
import Board from './Board.js'; // Import Board component
import calculateWinner from '../helper/functions.js'; // Import helper function

// Game component
function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); 
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  var gameWinner = null;
  var winningLine = null;


  // Handle the play
  async function handlePlay(squareIndex) {
    const squaresCopy = [...currentSquares];
    if (gameWinner || squaresCopy[squareIndex]) {
      return;
    }
    squaresCopy[squareIndex] = xIsNext ? 'X' : 'O';
    // try send the move to the server
    try {
      const response = await fetch('http://localhost:5000/send-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player: squaresCopy[squareIndex], // send player
          square: squareIndex, // sned id of played squared
          board: squaresCopy, // send the board
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Server response:', data.response);
      // Determine the winner
      gameWinner = data.winner;
      winningLine = gameWinner ? gameWinner.line : null;
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
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