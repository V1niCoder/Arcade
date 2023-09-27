import "./styles.css";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import React, { useState, useEffect, useRef } from "react";

export default function MazeGame() {
  const canvasRef = useRef(null);
  const mazeWidth = 20;
  const mazeHeight = 20;
  const cellSize = 100;
  const canvasWidth = (mazeWidth + 1) * cellSize;
  const canvasHeight = (mazeHeight + 1) * cellSize;
  const [shouldGenerateMaze, setShouldGenerateMaze] = useState(false);
  const [characterPosition, setCharacterPosition] = useState({
    x: 1,
    y: mazeHeight - 1
  });

  const [maze, setMaze] = useState(generateMaze(mazeWidth, mazeHeight));

  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event;
      let newX = characterPosition.x;
      let newY = characterPosition.y;

      switch (key) {
        case "ArrowUp":
          newY = Math.max(0, newY - 1);
          break;
        case "ArrowDown":
          newY = Math.min(mazeHeight - 1, newY + 1);
          break;
        case "ArrowLeft":
          newX = Math.max(0, newX - 1);
          break;
        case "ArrowRight":
          newX = Math.min(mazeWidth - 1, newX + 1);
          break;
        default:
          break;
      }

      if (maze[newY][newX] === 0) {
        setCharacterPosition({ x: newX, y: newY });
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [characterPosition, maze, mazeHeight, mazeWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    function drawMaze() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let row = 0; row < mazeHeight; row++) {
        for (let col = 0; col < mazeWidth; col++) {
          const cell = maze[row][col];
          const x = col * cellSize;
          const y = row * cellSize;

          if (row === mazeHeight - 1 && col === 1) {
            ctx.fillStyle = "#bc13fe";
          } else if (row === 1 && col === mazeWidth - 1) {
            ctx.fillStyle = "#bc13fe";
            if (characterPosition.x === col && characterPosition.y === row) {
              setShouldGenerateMaze(true);
            }
          } else {
            ctx.fillStyle = cell === 1 ? "black" : "white";
          }
          if (row === characterPosition.y && col === characterPosition.x) {
            ctx.fillStyle = "#7fffd4";
            ctx.fillRect(x, y, cellSize, cellSize);
          }

          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }

    drawMaze();
  }, [
    maze,
    canvasHeight,
    canvasWidth,
    characterPosition.x,
    characterPosition.y
  ]);

  useEffect(() => {
    if (shouldGenerateMaze) {
      generateNewMaze();
      setShouldGenerateMaze(false);
      setCharacterPosition({
        x: 1,
        y: mazeHeight - 1
      });
    }
  }, [shouldGenerateMaze]);

  const generateNewMaze = () => {
    const newMaze = generateMaze(mazeWidth, mazeHeight);
    setMaze(newMaze);
  };

  function generateMaze(width, height) {
    const maze = Array.from({ length: height }, () => Array(width).fill(1));

    function recursiveBacktrack(row, col) {
      maze[row][col] = 0;

      const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0]
      ];

      directions.sort(() => Math.random() - 0.5);
      const randomOrder = [...directions];

      for (const [dx, dy] of randomOrder) {
        const newRow = row + 2 * dx;
        const newCol = col + 2 * dy;

        if (
          newRow >= 0 &&
          newRow < height &&
          newCol >= 0 &&
          newCol < width &&
          maze[newRow][newCol] === 1
        ) {
          maze[row + dx][col + dy] = 0;

          recursiveBacktrack(newRow, newCol);
        }
      }
    }

    const startRow = 1;
    const startCol = 1;
    recursiveBacktrack(startRow, startCol);

    return maze;
  }

  return (
    <div id="maze-page">
      <div className="buttons-div">
        <Link to="/">
          <button className="top-buttons">
            <BiArrowBack />
          </button>
        </Link>
      </div>
      <div className="header">
        <h1>Maze</h1>
      </div>
      <div className="machine">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%" }}
        ></canvas>
      </div>
    </div>
  );
}
