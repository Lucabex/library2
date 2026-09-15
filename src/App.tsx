import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

interface PuzzleInfo {
  fen: string;
  themes: string[];
  solution: string[];
  playerColor: "withe" | "black";
  moveToWin: number;
}

function App() {
  const [game, setGame] = useState(new Chess());
  const [feedback, setFeedback] = useState<string>("");
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  const [state, setState] = useState<
    "loading" | "playing" | "solved" | "failed"
  >("loading");
  const [puzzle, setPuzzle] = useState<PuzzleInfo | null>(null);

  useEffect(() => {
    async function fetchPuzzle() {
      const response = await fetch("https://lichess.org/api/puzzle/daily");
      const data = await response.json();
      //extract from data info to create puzzle
      const fen = data.puzzle.fen;
      const themes = data.puzzle.themes;
      const solution = data.puzzle.solution;
      const turn = fen.split(" ")[1];
      const playerColor = turn === "w" ? "withe" : "black";
      const numMoves = themes.find((t: string) => t.startsWith("mateIn"));
      const moveTowin = parseInt(numMoves.replace("mateIn", ""));
    }
  }, []);

  return (
    <>
      <Chessboard />
    </>
  );
}
