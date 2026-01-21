import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuestionType } from "./use-question";
import type { Player } from "./use-player";

interface ApplicationState {
  turn: Player | null;
  mode: QuestionType;
  setTurn: (turn: Player | null) => void;
  setMode: (mode: QuestionType) => void;
  resetApplication: () => void;
}

export const useApplication = create<ApplicationState>()(
  persist(
    (set) => ({
      turn: null,
      mode: "CASUAL",
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
      resetApplication: () => {
        set(() => ({
          mode: "CASUAL",
          turn: null,
        }));
      },
    }),
    {
      name: "application-storage",
      version: 1,
    },
  ),
);
