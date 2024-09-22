import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import "./reset-style.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import router from "./routers/router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
