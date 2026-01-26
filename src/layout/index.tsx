  /* eslint-disable @typescript-eslint/no-explicit-any */
  import { Suspense, useEffect, useRef, useState } from "react";
  import { Outlet, useNavigate } from "react-router";
  import { usePlayer } from "../store/use-player";
  import { useQuestion, type Question } from "../store/use-question";
  import Loader from "../components/loader";
  import IconExport from "../assets/export.svg";
  import toast, { Toaster } from "react-hot-toast";
  import { v4 as uuidv4 } from "uuid";
  import { useSyncTurn } from "../hooks.tsx/use-sync-turn";
  import { useApplication } from "../store/use-application";

  interface JSONData {
    deep?: string[];
    casual?: string[];
  }

  const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((v) => typeof v === "string");

  const isQuestionObject = (value: unknown): value is JSONData =>
    typeof value === "object" &&
    value !== null &&
    (("deep" in value && isStringArray((value as any).deep)) ||
      ("casual" in value && isStringArray((value as any).casual)));

  const createQuestions = (
    texts: string[],
    type: "CASUAL" | "DEEP",
  ): Question[] =>
    texts.map((text) => ({
      id: uuidv4(),
      text,
      askedTo: [],
      type,
    }));

  const Layout = () => {
    useSyncTurn();
    const navigate = useNavigate();
    const { players, currentTurnIndex, hasAddedPlayer } = usePlayer();
    const { hasAddedQuestions, addQuestionsBulk } = useQuestion();
    const { hasAddedGameMode } = useApplication();
    const [loading, setLoading] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // contoh: baca JSON
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed: unknown = JSON.parse(reader.result as string);

          if (isStringArray(parsed)) {
            addQuestionsBulk(createQuestions(parsed, "CASUAL"));
            toast.success("Questions added successfully.");
          } else if (isQuestionObject(parsed)) {
            if (parsed.deep) {
              addQuestionsBulk(createQuestions(parsed.deep, "DEEP"));
              toast.success("Deep questions added successfully.");
            }
            if (parsed.casual) {
              addQuestionsBulk(createQuestions(parsed.casual, "CASUAL"));
              toast.success("Casual questions added successfully.");
            }
          } else {
            toast.error("Invalid JSON structure.");
          }
        } catch {
          toast.error("Failed to parse JSON file.");
        }
      };

      reader.onloadend = () => {
        e.target.value = "";
      };

      reader.readAsText(file);
    };

    useEffect(() => {
      if (!hasAddedGameMode) {
        navigate("/mode-selection");
      } else if (!hasAddedPlayer) {
        navigate("/register-player");
      } else if (!hasAddedQuestions) {
        navigate("/add-question");
      } else {
        navigate("/type-selection");
      }
    }, [hasAddedGameMode, hasAddedPlayer, navigate, hasAddedQuestions]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }, []);

    const name = players[currentTurnIndex]?.name || "Player";

    return (
      <div className="relative bg-bg w-full max-w-xl h-screen transition-all duration-200 mx-auto overflow-x-hidden">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
          }}
        />
        {hasAddedPlayer && hasAddedGameMode ? (
          <div className="absolute top-[2%] flex items-center justify-between px-4 w-full">
            <div
              className="justify-self-start relative px-10 py-3 text-white font-semibold bg-linear-to-b from-transparent to-primary-hover transition-all duration-100 hover:bg-bottom active:scale-95 rounded-bl-4xl rounded-br-xs rounded-tr-4xl rounded-tl-xs"
              style={{ backgroundColor: "#f9a8d4" }}
            >
              {name}'s turn
              <div
                className="absolute right-0 bottom-full"
                style={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "#f9a8d4",
                  clipPath: "polygon(0 100%, 100% 0, 0 100%)",
                }}
              />
            </div>
            <div className="relative group justify-self-start">
              <button
                onClick={handleClick}
                className="relative px-3 py-2 font-semibold bg-white transition-all duration-100 hover:bg-bottom active:scale-95 rounded-lg border-2 border-primary"
              >
                <img src={IconExport} alt="Export" className="size-6" />
              </button>

              <div className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-primary-hover px-3 py-1.5 text-xs text-white opacity-0 scale-95 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 font-poppins">
                Upload questions
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        ) : null}
        <Suspense>{loading ? <Loader /> : <Outlet />}</Suspense>
      </div>
    );
  };

  export default Layout;
