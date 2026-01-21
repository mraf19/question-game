import { useEffect } from "react";
import { usePlayer } from "../store/use-player";
import { useApplication } from "../store/use-application";

export const useSyncTurn = () => {
  const { players, currentTurnIndex } = usePlayer();
  const { setTurn } = useApplication();

  useEffect(() => {
    if (players.length === 0) {
      setTurn(null);
      return;
    }

    const currentPlayer = players[currentTurnIndex];
    setTurn(currentPlayer);
  }, [players, currentTurnIndex, setTurn]);
};
