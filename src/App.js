import "./App.css";
import React, { useState } from "react";

function Square({ value, onSquareClick, isResultSquare }) {
  const className = isResultSquare ? "square winner" : "square";
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}
function Board({ xIsNext, squares, onPlay, resultLine }) {
  function renderSquare(i) {
    const isResultSquare = resultLine && resultLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isResultSquare={isResultSquare}
      />
    );
  }
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
    // display when it's a draw
  } else if (squares.every((square) => square)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Rewrite the Board to use two loops to make the squares instead of hardcoding them
  const boardSize = 3;
  const rows = [];
  for (let row = 0; row < boardSize; row++) {
    const rowSquares = [];
    for (let col = 0; col < boardSize; col++) {
      const squareIndex = row * boardSize + col;
      rowSquares.push(renderSquare(squareIndex));
    }
    rows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }
  // return (
  //   <>
  //     <div className="status">{status}</div>
  //     <div className="board-row">
  //       <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
  //       <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
  //       <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
  //     </div>
  //     <div className="board-row">
  //       <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
  //       <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
  //       <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
  //     </div>
  //     <div className="board-row">
  //       <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
  //       <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
  //       <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
  //     </div>
  //   </>
  // );
  return (
    <div>
      <div className="status">{status}</div>
      {rows}
    </div>
  );
}

let App = function Game() {
  // useState for location
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  // const currentSquares = history[currentMove];
  const currentSquares = history[currentMove].squares;
  // use state for toggle button
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1);
    const location = getLocation(nextSquares, currentSquares);
    nextHistory.push({ squares: nextSquares, location });
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // For the current move only, show “You are at move #…” instead of a button
  // Display the location for each move in the format (row, col) in the move history list
  const moves = history.map((squares, move) => {
    const description =
      move === currentMove ? `You are at move #${move}` : `Go to move #${move}`;
    const location = squares.location
      ? `(${squares.location.row}, ${squares.location.col})`
      : "";
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>
            {description} {location}
          </span>
        ) : (
          <button onClick={() => jumpTo(move)}>
            {description} {location}
          </button>
        )}
      </li>
    );
  });

  // Add a toggle button that lets you sort the moves in either ascending or descending order
  const toggleSort = () => {
    setIsAscending(!isAscending);
  };

  if (!isAscending) {
    moves.reverse();
  }

  const resultLine = calculateWinner(currentSquares);

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          resultLine={resultLine}
        />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleSort}>Sort</button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return squares[a];
      return lines[i];
    }
  }
  return null;
}

function getLocation(nextSquares, currentSquares) {
  for (let i = 0; i < nextSquares.length; i++) {
    if (nextSquares[i] !== currentSquares[i]) {
      const row = Math.floor(i / 3) + 1;
      const col = (i % 3) + 1;
      return { row, col };
    }
  }
  return null;
}

// function App() {
//   return <div className="App"></div>;
// }
export default App;
