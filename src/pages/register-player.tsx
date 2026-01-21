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

function RegisterPlayer() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { addPlayer, players, hasAddedPlayer, hasAddPlayer } = usePlayer();
  const inputRef = useRef<HTMLInputElement>(null);

  const isHaveTwoPlayers = players.length >= 2;

  const handleSubmit = () => {
    if (!input.trim()) return;

    const player: Player = {
      id: uuidv4(),
      name: input.trim(),
    };

    addPlayer(player);
    setInput("");
    inputRef.current?.focus();
  };

  const handleNext = () => {
    hasAddPlayer();
    navigate("/");
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
          Daftarin
        </button>
        {isHaveTwoPlayers ? (
          <button
            onClick={handleNext}
            className="font-poppins p-4 border border-primary bg-primary rounded-xl text-white disabled:opacity-50"
          >
            Lanjut....
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default RegisterPlayer;
