import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
// import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import React from "react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
