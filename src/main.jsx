import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "./Rout/Router.jsx";
import { ensureStore } from "./Hok/ClientStore.jsx";

// Seed the browser store (fills demo riders/parcels only when empty).
ensureStore();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
