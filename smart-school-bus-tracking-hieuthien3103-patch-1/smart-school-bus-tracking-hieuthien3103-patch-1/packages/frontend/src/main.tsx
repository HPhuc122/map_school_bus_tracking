import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { SocketProvider } from "./contexts/SocketContext"; // đường dẫn đúng với file của bạn
import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);