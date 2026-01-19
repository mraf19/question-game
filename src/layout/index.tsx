import { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { usePlayer } from "../store/use-player";
import { useQuestion } from "../store/use-question";
import Loader from "../components/loader";
import { useApplication } from "../store/use-application";

const Layout = () => {
  const navigate = useNavigate();
  const { player1, player2 } = usePlayer();
  const { hasAddedQuestions } = useQuestion();
  const { turn } = useApplication();
  const isAllPlayerReady = Boolean(player1?.name && player2?.name);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAllPlayerReady) {
      navigate("/register-player");
    } else if (!hasAddedQuestions) {
      navigate("/add-question");
    } else {
      navigate("/type-selection");
    }
  }, [isAllPlayerReady, navigate, hasAddedQuestions]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const name = turn === "player1" ? player1?.name : player2?.name;

  return (
    <div className="relative bg-bg w-full max-w-xl h-screen transition-all duration-200 mx-auto">
      {isAllPlayerReady ? (
        <div
          className="top-[2%] left-[2%] justify-self-start relative px-10 py-3 text-white font-semibold bg-linear-to-b from-transparent to-primary-hover transition-all duration-100 hover:bg-bottom active:scale-95 rounded-bl-4xl rounded-br-xs rounded-tr-4xl rounded-tl-xs"
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
      ) : null}
      <Suspense>{loading ? <Loader /> : <Outlet />}</Suspense>
    </div>
  );
};

export default Layout;
