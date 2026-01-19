import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuestionType } from "./use-question";
import type { PlayerKey } from "./use-player";

interface ApplicationState {
  turn: PlayerKey;
  mode: QuestionType;
  setTurn: (turn: PlayerKey) => void;
  setMode: (mode: QuestionType) => void;
  resetApplication: () => void;
}

export const useApplication = create<ApplicationState>()(
  persist(
    (set) => ({
      turn: "player1",
      mode: "CASUAL",
      setMode: (mode: QuestionType) => {
        set(() => ({
          mode,
        }));
      },
      setTurn: (turn: PlayerKey) => {
        set(() => ({
          turn,
        }));
      },
      resetApplication: () => {
        set(() => ({
          mode: "CASUAL",
          turn: "player1",
        }));
      },
    }),
    {
      name: "application-storage",
      version: 1,
    },
  ),
);
