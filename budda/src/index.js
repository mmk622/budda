import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "process";
import { Buffer } from "buffer";
global.Buffer = Buffer;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
