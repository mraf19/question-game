import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useQuestion, type Question } from "../store/use-question";
import { useNavigate } from "react-router";
import { useApplication } from "../store/use-application";
import { v4 as uuidv4 } from "uuid";
import { usePlayer } from "../store/use-player";
import { APPLICATION_LABELS } from "../constants/labels";

const AddQuestions = () => {
  const navigate = useNavigate();
  const { addQuestionsBulk, hasAddQuestions, hasAddedQuestions } =
    useQuestion();
  const { players, nextTurn, resetTurn } = usePlayer();
  const { mode, turn, setMode, resetApplication, gameMode } = useApplication();
  const [id, setId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  console.log(gameMode);
  console.log(APPLICATION_LABELS);
  const title = APPLICATION_LABELS[gameMode].ADD_QUESTIONS[mode];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const handleEdit = (question: Question) => {
    setId(question.id);
    setInput(question.text);
    inputRef?.current?.focus();
  };

  const handleSubmit = () => {
    if (!input || !input.trim()) return;
    const question: Question = {
      id: uuidv4(),
      text: input,
      askedTo: [],
      type: mode,
    };
    if (id) {
      setQuestions((questions) => {
        const filtered = questions.filter((question) => question.id !== id);
        return [...filtered, question];
      });
    } else {
      setQuestions((questions) => [...questions, question]);
    }
    setInput("");
    inputRef.current?.focus();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && questions.length < 10) {
      e.preventDefault(); // aman kalau nanti dibungkus <form>
      handleSubmit();
    }
  };
  const handleDone = () => {
    addQuestionsBulk(questions);
    setQuestions([]);
    inputRef?.current?.focus();
    if (mode === "CASUAL") {
      nextTurn();
      if (turn === players[players.length - 1]) {
        setMode("DEEP");
        resetTurn();
      }
      return;
    }

    if (turn !== players[players.length - 1]) {
      nextTurn();
      return;
    }
    hasAddQuestions();
    resetApplication();
    resetTurn();
    navigate("/");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (hasAddedQuestions) {
      navigate("/type-selection");
    }
  }, [hasAddedQuestions, navigate]);

  if (hasAddedQuestions) {
    return <></>;
  }
  return (
    <div className="flex flex-col h-full items-center py-32 gap-6 px-8">
      <h1 className="font-poppins font-bold text-2xl text-text-secondary">
        {title}
      </h1>
      <input
        type="text"
        value={input}
        ref={inputRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={questions.length === 10}
        placeholder="Masukkin pertanyaannya yaa..."
        className="w-full p-4 border border-primary placeholder:text-primary placeholder:italic text-text-primary rounded-xl outline-none disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={!input || questions.length === 10}
        className="p-4 border border-primary bg-primary rounded-xl font-poppins text-white disabled:opacity-50"
      >
        OK !
      </button>
      {questions.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          <h5 className="text-xl font-semibold text-text-primary font-poppins">
            Review :
          </h5>
          <div className="flex flex-col gap-1">
            {questions.map((question, idx) => (
              <div
                key={`extra-questions-${idx}`}
                className="w-full flex justify-between"
              >
                <p className="text-text-secondary font-poppins">
                  {idx + 1}. {question.text}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  onClick={() => handleEdit(question)}
                >
                  <path
                    d="M11.05 3.00002L4.20829 10.2417C3.94996 10.5167 3.69996 11.0584 3.64996 11.4334L3.34162 14.1334C3.23329 15.1084 3.93329 15.775 4.89996 15.6084L7.58329 15.15C7.95829 15.0834 8.48329 14.8084 8.74162 14.525L15.5833 7.28335C16.7666 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2333 1.75002 11.05 3.00002Z"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    stroke="#9d174d"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.90833 4.20837C10.2667 6.50837 12.1333 8.26671 14.45 8.50004"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    stroke="#9d174d"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 18.3334H17.5"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    stroke="#9d174d"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {questions.length === 10 ? (
        <button
          onClick={handleDone}
          className="font-poppins p-4 border border-primary bg-primary rounded-xl text-white disabled:opacity-50"
        >
          Done !
        </button>
      ) : null}
    </div>
  );
};

export default AddQuestions;
