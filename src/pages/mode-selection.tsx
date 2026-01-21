import { useNavigate } from "react-router";
import { useApplication, type GameModeType } from "../store/use-application";
import { useQuestion, type Question } from "../store/use-question";
import {
  CasualQuestions,
  DeepQuestions,
  FriendshipCasualQuestions,
  FriendshipDeepQuestions,
} from "../constants/questions";
import { v4 as uuidv4 } from "uuid";

const gameMode: GameModeType[] = ["COUPLE", "MULTIPLAYER"];

const ModeSelection = () => {
  const navigate = useNavigate();
  const { addQuestionsBulk } = useQuestion();
  const { setGameMode, hasAddGameMode } = useApplication();
  const gameModeClickHandler = (mode: GameModeType) => {
    const casual =
      mode === "COUPLE" ? CasualQuestions : FriendshipCasualQuestions;
    const deep = mode === "COUPLE" ? DeepQuestions : FriendshipDeepQuestions;
    const casualMapped: Question[] = casual.map((text) => ({
      id: uuidv4(),
      text,
      askedTo: [],
      type: "CASUAL",
    }));
    const deepMapped: Question[] = deep.map((text) => ({
      id: uuidv4(),
      text,
      askedTo: [],
      type: "DEEP",
    }));
    addQuestionsBulk([...casualMapped, ...deepMapped]);
    setGameMode(mode);
    hasAddGameMode();
    navigate("/register-player");
  };
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <p className="font-poppins text-3xl font-bold text-primary-hover text-center">
        Mainnya mode apa niii?
      </p>
      {gameMode.map((mode) => (
        <button
          key={mode}
          onClick={() => gameModeClickHandler(mode)}
          className="w-1/2 p-8 bg-primary hover:bg-primary-hover hover:cursor-pointer flex items-center justify-center rounded-2xl transition-all duration-200"
        >
          <p className="text-xl font-bold font-poppins text-white">{mode}</p>
        </button>
      ))}
    </div>
  );
};

export default ModeSelection;
