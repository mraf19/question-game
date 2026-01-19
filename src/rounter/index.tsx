import { createBrowserRouter } from "react-router";
import Layout from "../layout";
import { lazy } from "react";
const RegisterPlayer = lazy(() => import("../pages/register-player"));
const AddQuestions = lazy(() => import("../pages/add-questions"));
const TypeSelection = lazy(() => import("../pages/type-selection"));
const Question = lazy(() => import("../pages/question"));
const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
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
