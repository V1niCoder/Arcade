import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import WelcomeSection from "./WelcomeSection";
import PongGame from "./Pong";
import TicTacToeGame from "./TicTacToe";
import MazeGame from "./Maze";
import PigGame from "./Pig";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeSection />} />
        <Route path="/Pong" element={<PongGame />} />
        <Route path="/TicTacToe" element={<TicTacToeGame />} />
        <Route path="/Maze" element={<MazeGame />} />
        <Route path="/Pig" element={<PigGame />} />
      </Routes>
    </Router>
  </StrictMode>
);
