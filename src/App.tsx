import { useState, useEffect } from "react";
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
  const [status, setStatus] = useState<
    "loading" | "playing" | "solved" | "failed"
  >("loading");
  const [puzzle, setPuzzle] = useState<PuzzleInfo | null>(null);

  useEffect(() => {
    async function fetchPuzzle() {
      try {
        const response = await fetch("https://lichess.org/api/puzzle/daily");
        const data = await response.json();
        //extract from data info to create puzzle
        const fen = data.puzzle.fen;
        const themes = data.puzzle.themes;
        const solution = data.puzzle.solution;
        const turn = fen.split(" ")[1];
        const playerColor = turn === "w" ? "withe" : "black";
        const numMoves = themes.find((t: string) => t.startsWith("mateIn"));
        const moveToWin = parseInt(numMoves.replace("mateIn", ""));
        setPuzzle({ fen, themes, solution, playerColor, moveToWin });
        setGame(new Chess(fen));
      } catch (error) {
        console.error(error);
      }
    }
    fetchPuzzle();
  }, []);

  function onDropa(start: string, target: string) {
    if (!puzzle || status !== "playing") return false;
    const actualMove = start + target;
    const rightMove = puzzle?.solution[currentMoveIndex];

    if (actualMove !== rightMove) {
      setFeedback("Wrong move");
      setTimeout(() => setFeedback(""), 2000);
      return false;
    }

    setFeedback("Yes,correct move");
    setTimeout(() => setFeedback(""), 2000);
    const gameCopy = new Chess(game.fen());
    gameCopy.move({
      from: start,
      to: target,
      promotion: "q",
    });
    setGame(gameCopy);
    const nextIndex = currentMoveIndex + 1;
    setCurrentMoveIndex(nextIndex);
    if (nextIndex >= puzzle.solution.length) {
      setStatus("solved");
      return true;
    }
    setTimeout(() => {
      const cpuMove = puzzle.solution[nextIndex];
      const from = cpuMove.substring(0, 2);
      const to = cpuMove.substring(2, 4);
      const cpuGameCopy = new Chess(gameCopy.fen());
      cpuGameCopy.move({ from, to, promotion: "q" });
      setGame(cpuGameCopy);
      setCurrentMoveIndex(nextIndex + 1);
    });
  }

  return (
    <>
      <Chessboard />
    </>
  );
}
