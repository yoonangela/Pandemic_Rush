import React from "react";
import App from "./components/App";
import Home from "./components/Home";
import Pregame1 from "./components/Pregame1";
import Pregame2 from "./components/Pregame2";
import Pregame3 from "./components/Pregame3";
import Rank from "./components/Rank";
import Settings from "./components/Settings";
import Simulation from "./components/Simulation";





import "./index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/pregame1",
        element: <Pregame1 />, 
      },
      {
        path: "pregame2",
        element: <Pregame2 />, 
      },
      {
        path: "pregame3",
        element: <Pregame3 />,
      },
      {
        path: "rank",
        element: <Rank />,
      },
      {
        path: "users/:id/settings",
        element: <Settings />,
      },
      {
        path: "simulation",
        element: <Simulation />,
      }
    ],
  },
]);


const container = document.getElementById("root");
const root = createRoot(container);
root.render(<RouterProvider router={router} />);
