import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import EditorPage from "./pages/EditorPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <EditorPage />
  </React.StrictMode>
);
