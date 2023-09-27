import "./styles.css";
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const isMobile = window.innerWidth < 768;

export default function TicTacToeGame() {
  const canvasRef = useRef(null);
  const [isXNext, setIsXNext] = useState(true);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winnerMessage, setWinnerMessage] = useState(null);

  function checkWinner(board) {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const combo of winCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes(null)) {
      return "draw";
    }

    return null;
  }

  const handleMove = (index) => {
    if (board[index] === null) {
      const newBoard = [...board];
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);
      setIsXNext(!isXNext);

      const winner = checkWinner(newBoard);
      if (winner) {
        if (winner === "draw") {
          setWinnerMessage("It's a draw!");
        } else {
          setWinnerMessage(`${winner} wins!`);
        }
        setTimeout(() => {
          setBoard(Array(9).fill(null));
          setIsXNext(true);
          setWinnerMessage(null);
        }, 5000);
      }
    }
  };

  const handleAI = () => {
    if (!winnerMessage && !isXNext) {
      setTimeout(() => {
        const availableCells = board
          .map((cell, index) => (cell === null ? index : null))
          .filter((cell) => cell !== null);

        if (availableCells.length > 0) {
          // Prioritize winning
          for (let i = 0; i < availableCells.length; i++) {
            const testBoard = [...board];
            testBoard[availableCells[i]] = "O";
            if (checkWinner(testBoard) === "O") {
              handleMove(availableCells[i]);
              return;
            }
          }

          // Block the opponent from winning
          for (let i = 0; i < availableCells.length; i++) {
            const testBoard = [...board];
            testBoard[availableCells[i]] = "X";
            if (checkWinner(testBoard) === "X") {
              handleMove(availableCells[i]);
              return;
            }
          }

          // Center preference
          if (availableCells.includes(4)) {
            handleMove(4);
            return;
          }

          // Choose a random available cell
          const randomIndex = Math.floor(Math.random() * availableCells.length);
          handleMove(availableCells[randomIndex]);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#7FFFD4";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, 0);
    ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((canvas.width * 2) / 3, 0);
    ctx.lineTo((canvas.width * 2) / 3, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 3);
    ctx.lineTo(canvas.width, canvas.height / 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, (canvas.height * 2) / 3);
    ctx.lineTo(canvas.width, (canvas.height * 2) / 3);
    ctx.stroke();

    const cellSizeX = canvas.width / 3;
    const cellSizeY = canvas.height / 3;
    const fontSize = isMobile ? 70 : 50;

    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const cellValue = board[i];

      ctx.font = `${fontSize}px "ArcadeClassic", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (cellValue === "X") {
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "#bc13fe";
        ctx.lineWidth = 2;
        ctx.fillText(
          "X",
          col * cellSizeX + cellSizeX / 2,
          row * cellSizeY + cellSizeY / 2
        );
        ctx.strokeText(
          "X",
          col * cellSizeX + cellSizeX / 2,
          row * cellSizeY + cellSizeY / 2
        );
      } else if (cellValue === "O") {
        ctx.fillStyle = "#FF4500";
        ctx.strokeStyle = "#bc13fe";
        ctx.lineWidth = 1;
        ctx.fillText(
          "O",
          col * cellSizeX + cellSizeX / 2,
          row * cellSizeY + cellSizeY / 2
        );
        ctx.strokeText(
          "O",
          col * cellSizeX + cellSizeX / 2,
          row * cellSizeY + cellSizeY / 2
        );
      }
    }

    if (!isXNext) {
      handleAI();
    }
  }, [board]);

  return (
    <div id="tictactoe-page">
      <div className="buttons-div">
        <Link to="/">
          <button className="top-buttons">
            <BiArrowBack />
          </button>
        </Link>
      </div>
      <div className="header">
        <h1>Tic Tac Toe</h1>
      </div>
      <div className="machine">
        {winnerMessage ? (
          <div className="winner-message">{winnerMessage}</div>
        ) : (
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%" }}
            onClick={(e) => {
              const rect = canvasRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const col = Math.floor((x / rect.width) * 3);
              const row = Math.floor((y / rect.height) * 3);
              const index = row * 3 + col;
              handleMove(index);
            }}
          ></canvas>
        )}
      </div>
    </div>
  );
}
