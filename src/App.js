// Import necessary libraries and functions
import './styles.css'; // Import CSS for styling
import Game from './components/Game.js'; // Import Game component

function page() {
  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <Game />
    </div>
  );
}

export default page;