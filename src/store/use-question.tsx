import { create } from "zustand";
import { CasualQuestions, DeepQuestions } from "../constants/questions";
import type { PlayerKey } from "./use-player";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type QuestionType = "CASUAL" | "DEEP";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  askedTo: Record<PlayerKey, boolean>;
}

interface QuestionState {
  questions: Question[];
  hasAddedQuestions: boolean;
  getAvailableQuestions: (type: QuestionType, player: PlayerKey) => Question[];

  markAsked: (id: string, player: PlayerKey) => void;

  addQuestionsBulk: (newQuestions: Question[]) => void;

  hasAddQuestions: () => void;
  resetQuestions: () => void;
}

export const useQuestion = create<QuestionState>()(
  persist(
    (set, get) => ({
      questions: [
        ...CasualQuestions.map((q) => ({
          id: uuidv4(),
          text: q,
          type: "CASUAL" as QuestionType,
          askedTo: { player1: false, player2: false },
        })),
        ...DeepQuestions.map((q) => ({
          id: uuidv4(),
          text: q,
          type: "DEEP" as QuestionType,
          askedTo: { player1: false, player2: false },
        })),
      ],

      hasAddedQuestions: false,
      hasAddQuestions: () => {
        set(() => ({
          hasAddedQuestions: true,
        }));
      },
      getAvailableQuestions: (type, player) =>
        get().questions.filter((q) => q.type === type && !q.askedTo[player]),

      markAsked: (id, player) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === id
              ? {
                  ...q,
                  askedTo: {
                    ...q.askedTo,
                    [player]: true,
                  },
                }
              : q,
          ),
        })),

      addQuestionsBulk: (newQuestions) =>
        set((state) => {
          return {
            questions: [...state.questions, ...newQuestions],
          };
        }),
      resetQuestions: () => {
        set(() => ({
          questions: [
            ...CasualQuestions.map((q) => ({
              id: uuidv4(),
              text: q,
              type: "CASUAL" as QuestionType,
              askedTo: { player1: false, player2: false },
            })),
            ...DeepQuestions.map((q) => ({
              id: uuidv4(),
              text: q,
              type: "DEEP" as QuestionType,
              askedTo: { player1: false, player2: false },
            })),
          ],
          hasAddedQuestions: false,
        }));
      },
    }),
    {
      name: "question-storage",
      version: 1,
    },
  ),
);
