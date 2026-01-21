import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuestionType } from "./use-question";
import type { Player } from "./use-player";

export type GameModeType = "COUPLE" | "MULTIPLAYER";

interface ApplicationState {
  turn: Player | null;
  mode: QuestionType;
  gameMode: GameModeType;
  setTurn: (turn: Player | null) => void;
  setMode: (mode: QuestionType) => void;
  setGameMode: (gameMode: GameModeType) => void;
  resetApplication: VoidFunction;
  hasAddedGameMode: boolean;
  hasAddGameMode: VoidFunction;
  resetGameMode: VoidFunction;
}

export const useApplication = create<ApplicationState>()(
  persist(
    (set) => ({
      turn: null,
      mode: "CASUAL",
      gameMode: "COUPLE",
      hasAddedGameMode: false,
      hasAddGameMode: () =>
        set(() => ({
          hasAddedGameMode: true,
        })),
      setMode: (mode: QuestionType) => {
        set(() => ({
          mode,
        }));
      },
      setTurn: (turn: Player | null) => {
        set(() => ({
          turn,
        }));
      },
      setGameMode: (gameMode: GameModeType) => {
        set(() => ({
          gameMode,
        }));
      },
      resetApplication: () => {
        set(() => ({
          mode: "CASUAL",
          turn: null,
        }));
      },
      resetGameMode: () => {
        set(() => ({
          gameMode: "COUPLE",
          hasAddedGameMode: false,
        }));
      },
    }),
    {
      name: "application-storage",
      version: 1,
    },
  ),
);
