import "./styles.css";
import React, { useEffect, useState, useRef } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import PaddleBallSound from "./PaddleBallSound.ogg";

export default function PongGame() {
  const [leftPlayerScore, setLeftPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const canvasRef = useRef(null);
  const PBAudioRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const leftPaddle = {
      width: isMobile ? 10 : 8,
      height: isMobile ? 40 : 40,
      x: 10,
      y: canvas.height / 2 - 40 / 2,
      speed: isMobile ? 8 : 5
    };

    const rightPaddle = {
      width: isMobile ? 10 : 8,
      height: isMobile ? 40 : 40,
      x: 282,
      y: canvas.height / 2 - 40 / 2,
      speed: isMobile ? 8 : 5
    };

    const keyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === "w" && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.speed;
      } else if (
        key === "s" &&
        leftPaddle.y + leftPaddle.height < canvas.height
      ) {
        leftPaddle.y += leftPaddle.speed;
      }
    };

    const paddleAI = () => {
      const rightPaddleCenterY = rightPaddle.y + rightPaddle.height / 2;

      const deltaY = ballDraw.y - rightPaddleCenterY;

      const smoothingFactor = 0.1;

      rightPaddle.y += deltaY * smoothingFactor;
    };

    const ballDraw = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 5,
      speedX: 4,
      speedY: 4
    };

    const ballMovement = () => {
      ballDraw.x += ballDraw.speedX;
      ballDraw.y += ballDraw.speedY;
    };

    const WallCollision = () => {
      if (ballDraw.y - ballDraw.radius < 0) {
        ballDraw.speedY = Math.abs(ballDraw.speedY);
      }

      if (ballDraw.y + ballDraw.radius > canvas.height) {
        ballDraw.speedY = -Math.abs(ballDraw.speedY);
      }
    };

    const paddleCollision = () => {
      if (
        ballDraw.x - ballDraw.radius < leftPaddle.x + leftPaddle.width &&
        ballDraw.x + ballDraw.radius > leftPaddle.x &&
        ballDraw.y + ballDraw.radius > leftPaddle.y &&
        ballDraw.y - ballDraw.radius < leftPaddle.y + leftPaddle.height
      ) {
        const collisionPoint =
          ballDraw.y - (leftPaddle.y + leftPaddle.height / 2);
        const normalizedCollisionPoint =
          collisionPoint / (leftPaddle.height / 2);
        const bounceAngle = normalizedCollisionPoint * (Math.PI / 4);
        ballDraw.speedX = Math.cos(bounceAngle) * (isMobile ? 5 : 5);
        ballDraw.speedY = Math.sin(bounceAngle) * (isMobile ? 5 : 5);
        if (PBAudioRef.current) {
          PBAudioRef.current.play();
        }
      }

      if (
        ballDraw.x + ballDraw.radius > rightPaddle.x &&
        ballDraw.x - ballDraw.radius < rightPaddle.x + rightPaddle.width &&
        ballDraw.y + ballDraw.radius > rightPaddle.y &&
        ballDraw.y - ballDraw.radius < rightPaddle.y + rightPaddle.height
      ) {
        const collisionPoint =
          ballDraw.y - (rightPaddle.y + rightPaddle.height / 2);
        const normalizedCollisionPoint =
          collisionPoint / (rightPaddle.height / 2);
        const bounceAngle = normalizedCollisionPoint * (Math.PI / 4);
        ballDraw.speedX = -Math.cos(bounceAngle) * (isMobile ? 5 : 5);
        ballDraw.speedY = Math.sin(bounceAngle) * (isMobile ? 5 : 5);
        if (PBAudioRef.current) {
          PBAudioRef.current.play();
        }
      }
    };

    const goalScoring = () => {
      if (
        ballDraw.x <= 0 &&
        ballDraw.speedX < 0 &&
        ballDraw.x - ballDraw.radius < 0
      ) {
        setComputerScore((prevScore) => prevScore + 1);
        resetBall();
      } else if (
        ballDraw.x >= canvas.width &&
        ballDraw.speedX > 0 &&
        ballDraw.x + ballDraw.radius > canvas.width
      ) {
        setLeftPlayerScore((prevScore) => prevScore + 1);
        resetBall();
      }
    };

    const resetBall = () => {
      ballDraw.x = canvas.width / 2;
      ballDraw.y = canvas.height / 2;
      ballDraw.speedX = 4;
      ballDraw.speedY = 4;
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Paddles
      ctx.fillStyle = "white";
      ctx.fillRect(
        leftPaddle.x,
        leftPaddle.y,
        leftPaddle.width,
        leftPaddle.height
      );
      ctx.fillStyle = "white";
      ctx.fillRect(
        rightPaddle.x,
        rightPaddle.y,
        rightPaddle.width,
        rightPaddle.height
      );

      window.addEventListener("keydown", keyDown);

      // Ball
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(ballDraw.x, ballDraw.y, ballDraw.radius, 0, Math.PI * 2);
      ctx.fill();

      ballMovement();
      paddleAI();
      WallCollision();
      paddleCollision();
      goalScoring();

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, [isMobile]);

  return (
    <div id="pong-page">
      <div className="buttons-div">
        <Link to="/">
          <button className="top-buttons">
            <BiArrowBack />
          </button>
        </Link>
      </div>
      <div className="header">
        <h1>Pong</h1>
      </div>
      <div className="machine">
        <audio ref={PBAudioRef} src={PaddleBallSound}></audio>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%" }}
        ></canvas>
        <div id="pong-player-div">
          <span>Player Score: {leftPlayerScore}</span>
        </div>
        <div id="pong-computer-div">
          <span>Computer Score: {computerScore}</span>
        </div>
      </div>
    </div>
  );
}
