import Square from './Square';
import calculateWinner from '../helper/functions.js';

// Board component
function Board({ xIsNext, squares, onPlay, winningLine }) {
    function handleClick(i) {
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      onPlay(i);
    }
  
    // Determine the status of the game
    let status;
    const winner = calculateWinner(squares);
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
  
    return (
      <>
        <div className="status">{status}</div>
        {[0, 1, 2].map((row) => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              const isHighlight = winningLine && winningLine.includes(index);
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
                  highlight={isHighlight}
                />
              );
            })}
          </div>
        ))}
      </>
    );
  }

export default Board;