import "./styles.css";
import pongImg from "./PONG.png";
import tictactoeImg from "./TICTACTOE.png";
import mazeImg from "./MAZE.png";
import pigImg from "./PIG.png";

export default function WelcomeSection() {
  return (
    <div id="intro-page">
      <div className="header">
        <h1>Welcome to the Arcade!</h1>
      </div>
      <div className="machine">
        <p>Choose a game to play:</p>

        <div id="games-grid">
          <a href="/Pong">
            PONG
            <div className="games-div">
              <img src={pongImg} alt="Pong" className="welcome-imgs" />
            </div>
          </a>
          <a href="/TicTacToe">
            TIC TAC TOE
            <div className="games-div">
              <img
                src={tictactoeImg}
                alt="Tic Tac Toe"
                className="welcome-imgs"
              />
            </div>
          </a>
          <a href="/Maze">
            MAZE
            <div className="games-div">
              <img src={mazeImg} alt="Maze" className="welcome-imgs" />
            </div>
          </a>
          <a href="/Pig">
            PIG GAME
            <div className="games-div">
              <img src={pigImg} alt="Maze" className="welcome-imgs" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
