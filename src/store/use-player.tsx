import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Player {
  id: string;
  name: string;
}

interface PlayerState {
  players: Player[];
  currentTurnIndex: number;
  hasAddedPlayer: boolean;
  hasAddPlayer: VoidFunction;

  addPlayer: (name: Player) => void;
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, data: Partial<Player>) => void;

  nextTurn: VoidFunction;
  resetTurn: VoidFunction;
  resetPlayers: VoidFunction;
}

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      players: [],
      currentTurnIndex: 0,
      hasAddedPlayer: false,

      hasAddPlayer: () =>
        set({
          hasAddedPlayer: true,
        }),
      addPlayer: (player) =>
        set((state) => ({
          players: [...state.players, player],
        })),

      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
          currentTurnIndex: 0,
        })),

      updatePlayer: (id, data) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, ...data } : p,
          ),
        })),

      nextTurn: () => {
        const { players, currentTurnIndex } = get();
        if (players.length === 0) return;

        set({
          currentTurnIndex: (currentTurnIndex + 1) % players.length,
        });
      },

      resetTurn: () =>
        set({
          currentTurnIndex: 0,
        }),

      resetPlayers: () =>
        set({
          players: [],
          currentTurnIndex: 0,
          hasAddedPlayer: false,
        }),
    }),
    {
      name: "player-storage",
      version: 2,
    },
  ),
);
