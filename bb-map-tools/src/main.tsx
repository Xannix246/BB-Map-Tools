import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initConfig } from "@utils/base-utils";

(async () => {
    await initConfig();
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
})();
