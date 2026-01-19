import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { usePlayer, type Player } from "../store/use-player";
import { useNavigate } from "react-router";

function RegisterPlayer() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { setPlayer, player1, player2 } = usePlayer();
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllPlayerReady = Boolean(player1?.name && player2?.name);

  const handleSubmit = () => {
    if (!input.trim() || isAllPlayerReady) return;

    const playerId: Player["id"] = player1 ? "player2" : "player1";

    const player: Player = {
      id: playerId,
      name: input.trim(),
    };

    setPlayer(playerId, player);
    setInput("");
    inputRef.current?.focus();
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
    if (isAllPlayerReady) {
      navigate("/");
    }
  }, [isAllPlayerReady, navigate]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (isAllPlayerReady) {
    return <></>;
  }

  return (
    <div className="flex flex-col h-full items-center py-20 gap-8 px-8">
      <h1 className="font-poppins font-bold text-6xl text-text-secondary">
        {player1 ? "Player 2" : "Player 1"}
      </h1>

      <input
        type="text"
        value={input}
        ref={inputRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isAllPlayerReady}
        placeholder="Masukkin namanya yaa..."
        className="w-full p-4 border border-primary placeholder:text-primary placeholder:italic text-text-primary rounded-xl outline-none disabled:opacity-50"
      />

      <button
        onClick={handleSubmit}
        disabled={isAllPlayerReady}
        className="font-poppins p-4 border border-primary bg-primary rounded-xl text-white disabled:opacity-50"
      >
        OK !
      </button>
    </div>
  );
}

export default RegisterPlayer;
