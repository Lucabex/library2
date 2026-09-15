import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

interface PuzzleInfo {
  fen: string;
  themes: string[];
  solution: string[];
  playerColor: "withe" | "black";
}

function App() {
  const [game, setGame] = useState(new Chess());
  const [feedback, setFeedback] = useState<string>("");
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [state, setState] = useState<
    "loading" | "playing" | "solved" | "failed"
  >("loading");
  const [puzzle, setPuzzle] = useState<PuzzleInfo | null>(null);

  return (
    <>
      <Chessboard />
    </>
  );
}
