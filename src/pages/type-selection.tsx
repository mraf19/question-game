import type { QuestionType } from "../store/use-question";
import { useApplication } from "../store/use-application";
import { useState, useEffect, useRef } from "react";
import Loader from "../components/loader";
import { useNavigate } from "react-router";

const modes: QuestionType[] = ["CASUAL", "DEEP"];

const TypeSelection = () => {
  const navigate = useNavigate();
  const { setMode } = useApplication();
  const [selectedMode, setSelectedMode] = useState<QuestionType | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const word =
    selectedMode === "CASUAL"
      ? "Keknya kita santai dlu kali yaaa, aku mau tau sesuatu donggg"
      : "Sesekali serius yuuu, aku mau ngomongin sesuatu niiii";

  const handleRandomMode = () => {
    setLoading(true);

    timerRef.current = window.setTimeout(() => {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const index = array[0] % modes.length;
      const selected = modes[index];
      setMode(selected);
      setSelectedMode(selected);
      setLoading(false);
    }, 3000);
  };

  const nextHandler = () => {
    navigate("/question");
  };

  // Cleanup timer saat component unmount
  useEffect(() => {
    return () => {
      setSelectedMode(null);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      {selectedMode ? (
        <div className="flex flex-col gap-4 w-3/4 items-center">
          <p className="font-poppins text-xl font-bold text-primary-hover text-center">
            {word}
          </p>
          <button
            onClick={nextHandler}
            className="p-6 bg-primary font-poppins font-bold text-xl text-white rounded hover:bg-primary-hover transition w-fit"
          >
            Yuk lanjut...
          </button>
        </div>
      ) : (
        <>
          <h1 className="font-poppins text-3xl font-bold w-3/4 text-center text-text-primary">
            Mau ngobrolin tentang apa yaaa
          </h1>

          <button
            onClick={handleRandomMode}
            className="p-6 bg-primary font-poppins font-bold text-xl text-white rounded hover:bg-primary-hover transition"
          >
            Mulai Yukkk!!!
          </button>
        </>
      )}
    </div>
  );
};

export default TypeSelection;
