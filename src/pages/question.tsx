import { useEffect, useMemo, useState, useCallback } from "react";
import { useApplication } from "../store/use-application";
import { useQuestion, type Question } from "../store/use-question";
import Loader from "../components/loader";
import { useNavigate } from "react-router";
import { usePlayer } from "../store/use-player";
import { APPLICATION_LABELS } from "../constants/labels";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { mode, resetApplication, turn, gameMode, resetGameMode } = useApplication();
  const { getAvailableQuestions, markAsked, resetQuestions } = useQuestion();
  const { resetPlayers, players, nextTurn, resetTurn } = usePlayer();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const title = APPLICATION_LABELS[gameMode].QUESTIONS_PAGE.TITLE;

  const questions = useMemo(() => {
    return getAvailableQuestions(mode, turn?.id || null);
  }, [mode, turn, getAvailableQuestions]);

  const getQuestion = useCallback(() => {
    if (questions.length === 0) return null;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const index = array[0] % questions.length;
    return questions[index];
  }, [questions]);

  const changeTurn = () => {
    if (players.length === 0) return;

    nextTurn();
    navigate("/type-selection");
  };

  const loadQuestion = useCallback(() => {
    const selected = getQuestion();
    if (!selected || !turn) return;

    setQuestion(selected);
    markAsked(selected.id, turn.id);
  }, [getQuestion, markAsked, turn]);

  const resetHandler = () => {
    resetApplication();
    resetQuestions();
    resetGameMode();
    resetPlayers();
    navigate("/");
    resetTurn();
  };

  useEffect(() => {
    if (!turn) return;

    const timer = setTimeout(() => {
      loadQuestion();
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [turn, loadQuestion]);

  if (!loading && !question) {
    return <p>Tidak ada pertanyaan tersedia</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col items-center gap-10">
          <div className="w-4/5 flex flex-col items-center bg-primary rounded-4xl border-3 border-text-muted gap-5">
            <h5 className="px-10 pt-5 pb-3 border-b-3 w-full text-xl font-poppins text-text-muted border-b-text-muted">
              {title}
            </h5>
            <p className="px-10 pb-10 text-white text-2xl font-poppins font-semibold">
              {question?.text || "Tidak ada pertanyaan tersedia"}
            </p>
          </div>
          <div className="w-3/5 flex flex-col gap-3">
            <button
              onClick={changeTurn}
              className="py-3 bg-white font-poppins font-bold text-lg text-text-primary hover:text-text-secondary transition w-full border border-text-primary rounded-lg"
            >
              Udah? Gantian yukk
            </button>
            <button
              onClick={resetHandler}
              className="py-3 bg-white font-poppins font-bold text-lg text-text-primary hover:text-text-secondary transition w-full border border-text-primary rounded-lg"
            >
              Mau mulai ulang deh....
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
