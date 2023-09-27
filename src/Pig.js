import "./styles.css";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import React, { useRef, useEffect, useState } from "react";

export default function PigGame() {
  const canvasRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [turnTotal, setTurnTotal] = useState(0);
  const [diceFace, setDiceFace] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winnerMessage, setWinnerMessage] = useState("");
  const [diceShake, setDiceShake] = useState(false);
  const diceFaces = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#bc13fe";
      ctx.font = isMobile ? "15px Arial" : "15px Arial";
      ctx.fillText(`Player Score: ${playerScore}`, 70, canvas.height / 8);

      ctx.fillStyle = "#bc13fe";
      ctx.font = isMobile ? "15px Arial" : "15px Arial";
      ctx.textAlign = "right";
      ctx.fillText(
        `Computer score: ${computerScore}`,
        isMobile ? canvas.width - 30 : canvas.width - 20,
        canvas.height / 8
      );
      ctx.fillStyle = "#bc13fe";
      ctx.font = isMobile ? "24px Arial" : "15px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `Turn Total: ${turnTotal}`,
        canvas.width / 2,
        canvas.height / 1.15
      );
      const diceWidth = isMobile ? 75 : 65;
      const diceHeight = isMobile ? 45 : 45;
      const x = canvas.width / 2 - diceWidth / 2;
      const y = canvas.height / 2 - diceHeight / 2;

      let displacementX = 0;
      let displacementY = 0;

      if (diceShake) {
        displacementX = Math.random() * 5 - 4;
        displacementY = Math.random() * 5 - 4;
        ctx.translate(displacementX, displacementY);
      }

      ctx.fillStyle = "white";
      ctx.fillRect(x, y, diceWidth, diceHeight);
      ctx.strokeRect(x, y, diceWidth, diceHeight);

      const dotRadius = 5;
      const dotX = x + diceWidth / 2;
      const dotY = y + diceHeight / 2;

      const dotPositions = [
        [{ x: dotX, y: dotY }],
        [
          { x: dotX - 20, y: dotY - 10 },
          { x: dotX + 20, y: dotY + 10 }
        ],
        [
          { x: dotX - 20, y: dotY - 10 },
          { x: dotX, y: dotY },
          { x: dotX + 20, y: dotY + 10 }
        ],
        [
          { x: dotX - 20, y: dotY - 10 },
          { x: dotX + 20, y: dotY - 10 },
          { x: dotX - 20, y: dotY + 10 },
          { x: dotX + 20, y: dotY + 10 }
        ],
        [
          { x: dotX - 20, y: dotY - 10 },
          { x: dotX + 20, y: dotY - 10 },
          { x: dotX, y: dotY },
          { x: dotX - 20, y: dotY + 10 },
          { x: dotX + 20, y: dotY + 10 }
        ],
        [
          { x: dotX - 20, y: dotY - 10 },
          { x: dotX + 20, y: dotY - 10 },
          { x: dotX - 20, y: dotY + 10 },
          { x: dotX + 20, y: dotY + 10 },
          { x: dotX, y: dotY }
        ]
      ];

      ctx.fillStyle = "black";
      for (const dot of dotPositions[diceFace - 1]) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.translate(-displacementX, -displacementY);

      ctx.fillStyle = "yellow";
      ctx.font = isMobile ? "21px Arial" : "15px Arial";
      ctx.textAlign = "center";
      const turnText = isPlayerTurn ? "Player's Turn" : "Computer's Turn";
      ctx.fillText(turnText, canvas.width / 2, canvas.height / 3.5);
    };

    const resetGame = () => {
      setPlayerScore(0);
      setComputerScore(0);
      setTurnTotal(0);
      setDiceFace(1);
      setIsPlayerTurn(true);
      setWinnerMessage("");
    };

    if (playerScore >= 100) {
      setWinnerMessage("Player Wins!");
      setTimeout(() => {
        resetGame();
        drawGame();
      }, 5000);
    } else if (computerScore >= 100) {
      setWinnerMessage("Computer Wins :(");
      setTimeout(() => {
        resetGame();
        drawGame();
      }, 5000);
    } else {
      setWinnerMessage("");
      drawGame();
    }

    drawGame();
  }, [
    isMobile,
    isPlayerTurn,
    playerScore,
    computerScore,
    turnTotal,
    diceFace,
    diceShake
  ]);

  const computerTurn = () => {
    let rollsLeft = 5;
    let totalRoll = 0;

    const rollDice = () => {
      const randomRoll = Math.floor(Math.random() * 6) + 1;

      if (randomRoll === 1) {
        setDiceFace(randomRoll);
        setTurnTotal(0);
        setIsPlayerTurn(true);
      } else {
        totalRoll += randomRoll;
        setDiceFace(randomRoll);
        setTurnTotal(totalRoll);
        rollsLeft--;

        if (
          rollsLeft === 0 ||
          totalRoll >= 20 ||
          totalRoll + computerScore >= 100
        ) {
          const updatedComputerScore = computerScore + totalRoll;
          setComputerScore(updatedComputerScore);
          setIsPlayerTurn(true);
          setTurnTotal(0);
          setDiceShake(false);
        } else {
          setTimeout(rollDice, 1000);
        }
      }
    };

    setDiceShake(true);

    setTimeout(() => {
      rollDice();
    }, 1000);
  };

  const rollClick = () => {
    if (isPlayerTurn) {
      setDiceShake(true);
      const rollAnimationDuration = 1000;
      const rollsPerSecond = 6;

      const rollInterval = setInterval(() => {
        const newDiceFace = diceFaces[Math.floor(Math.random() * 6)];
        setDiceFace(newDiceFace);
      }, 1000 / rollsPerSecond);

      setTimeout(() => {
        setDiceShake(false);
        clearInterval(rollInterval);

        const newDiceFace = Math.floor(Math.random() * 6) + 1;

        if (newDiceFace === 1) {
          setDiceFace(newDiceFace);
          setTurnTotal(0);
          setIsPlayerTurn(false);
          computerTurn();
        } else {
          const updatedTurnTotal = turnTotal + newDiceFace;
          setDiceFace(newDiceFace);
          setTurnTotal(updatedTurnTotal);
        }
      }, rollAnimationDuration);
    }
  };

  const holdClick = () => {
    if (isPlayerTurn) {
      const updatedPlayerScore = playerScore + turnTotal;
      setPlayerScore(updatedPlayerScore);

      if (updatedPlayerScore >= 100) {
      } else {
        setIsPlayerTurn(false);
        computerTurn();
      }

      setTurnTotal(0);
    }
  };

  return (
    <div id="pig-page">
      <div className="buttons-div">
        <Link to="/">
          <button className="top-buttons">
            <BiArrowBack />
          </button>
        </Link>
      </div>
      <div className="header">
        <h1>Pig Game</h1>
      </div>
      <div className="machine">
        {winnerMessage ? (
          <div className="winner-message">{winnerMessage}</div>
        ) : (
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%" }}
          ></canvas>
        )}
        {!winnerMessage && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? "70%" : "80%",
              left: isMobile ? "20%" : "30%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <button
              className="pig-buttons"
              id="roll-button"
              onClick={rollClick}
            >
              <span>Roll!</span>
            </button>
          </div>
        )}
        {!winnerMessage && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? "70%" : "80%",
              right: isMobile ? "20%" : "30%",
              transform: "translate(50%, -50%)"
            }}
          >
            <button
              className="pig-buttons"
              id="hold-button"
              onClick={holdClick}
            >
              <span>Hold!</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
