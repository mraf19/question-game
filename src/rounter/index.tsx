import { createBrowserRouter } from "react-router";
import Layout from "../layout";
import RegisterPlayer from "../pages/register-player";
import AddQuestions from "../pages/add-questions";
import TypeSelection from "../pages/type-selection";
import Question from "../pages/question";
import ModeSelection from "../pages/mode-selection";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/mode-selection",
        element: <ModeSelection />,
      },
      {
        path: "/register-player",
        element: <RegisterPlayer />,
      },
      {
        path: "/add-question",
        element: <AddQuestions />,
      },
      {
        path: "/type-selection",
        element: <TypeSelection />,
      },
      {
        path: "/question",
        element: <Question />,
      },
    ],
  },
]);

export default Router;
