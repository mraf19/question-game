import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { usePlayer, type Player } from "../store/use-player";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { useApplication } from "../store/use-application";

function RegisterPlayer() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { addPlayer, players, hasAddedPlayer, hasAddPlayer } = usePlayer();
  const { gameMode } = useApplication();
  const inputRef = useRef<HTMLInputElement>(null);

  const isNextTwoPlayers = players.length + 1 >= 2;

  const nextStage = () => {
    hasAddPlayer();
    navigate("/");
  };

  const handleSubmit = () => {
    const name = input.trim();
    if (!name) return;

    const player: Player = {
      id: uuidv4(),
      name,
    };

    addPlayer(player);
    setInput("");
    inputRef.current?.focus();
    if (gameMode === "COUPLE") {
      const nextCount = players.length + 1;
      if (nextCount >= 2) {
        nextStage();
      }
    }
  };

  const handleNext = () => {
    handleSubmit();
    nextStage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.length > 0) {
      e.preventDefault(); // aman kalau nanti dibungkus <form>
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (hasAddedPlayer) {
    return <></>;
  }

  return (
    <div className="flex flex-col h-full items-center py-20 gap-8 px-8">
      <h1 className="font-poppins font-bold text-6xl text-text-secondary">
        Player {players.length + 1}
      </h1>

      <input
        type="text"
        value={input}
        ref={inputRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Masukkin namanya yaa..."
        className="w-full p-4 border border-primary placeholder:text-primary placeholder:italic text-text-primary rounded-xl outline-none disabled:opacity-50"
      />
      <div className="w-full flex items-center justify-center gap-8">
        <button
          onClick={handleSubmit}
          className="font-poppins p-4 border border-primary bg-primary rounded-xl text-white disabled:opacity-50"
        >
          {isNextTwoPlayers && gameMode === "MULTIPLAYER"
            ? "Daftarin & Tambah Lagi"
            : "Daftarin"}
        </button>

        {isNextTwoPlayers && gameMode === "MULTIPLAYER" ? (
          <button
            onClick={handleNext}
            className="font-poppins p-4 border border-primary bg-primary rounded-xl text-white disabled:opacity-50"
          >
            Daftarin & Lanjut
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default RegisterPlayer;
