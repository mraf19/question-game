import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuestionType = "CASUAL" | "DEEP";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  askedTo: string[];
}

interface QuestionState {
  questions: Question[];
  hasAddedQuestions: boolean;
  getAvailableQuestions: (
    type: QuestionType,
    playerId: string | null,
  ) => Question[];

  markAsked: (id: string, playerId: string) => void;

  addQuestionsBulk: (newQuestions: Question[]) => void;

  shuffleQuestions: () => void;
  hasAddQuestions: () => void;
  resetQuestions: () => void;
}

export const useQuestion = create<QuestionState>()(
  persist(
    (set, get) => ({
      questions: [],

      hasAddedQuestions: false,
      hasAddQuestions: () => {
        set(() => ({
          hasAddedQuestions: true,
        }));
      },
      getAvailableQuestions: (type, playerId) => {
        if (!playerId) return [];
        return get().questions.filter(
          (q) => q.type === type && !q.askedTo.includes(playerId),
        );
      },
      markAsked: (id, playerId) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === id
              ? {
                  ...q,
                  askedTo: [...q.askedTo, playerId],
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
      shuffleQuestions: () =>
        set((state) => {
          const shuffled = [...state.questions];
          let seed = Date.now();

          const next = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed;
          };

          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = next() % (i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }

          return { questions: shuffled };
        }),

      resetQuestions: () => {
        set(() => ({
          questions: [],
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
