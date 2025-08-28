import React from "react";
import ReactDOM from "react-dom/client";
import PartList from "@/pages/part-list/PartList";
import "@styles/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PartList />
  </React.StrictMode>
);
