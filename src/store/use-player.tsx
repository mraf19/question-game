import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PlayerKey = "player1" | "player2";

export interface Player {
  id: PlayerKey;
  name: string;
}

interface PlayerState {
  player1: Player | null;
  player2: Player | null;

  setPlayer: (key: PlayerKey, player: Player | null) => void;
  updatePlayer: (key: PlayerKey, data: Partial<Player>) => void;
  resetPlayers: () => void;
}

export const usePlayer = create<PlayerState>()(
  persist(
    (set) => ({
      player1: null,
      player2: null,

      setPlayer: (key, player) =>
        set((state) => ({
          ...state,
          [key]: player,
        })),

      updatePlayer: (key, data) =>
        set((state) => {
          const player = state[key];
          if (!player) return state;

          return {
            ...state,
            [key]: {
              ...player,
              ...data,
            },
          };
        }),

      resetPlayers: () =>
        set({
          player1: null,
          player2: null,
        }),
    }),
    {
      name: "player-storage",
      version: 1,
    },
  ),
);
