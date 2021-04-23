import React from "react";
import ReactDOM from "react-dom";
import { ModalProvider } from "react-modal-hook";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.scss";

ReactDOM.render(
  <ModalProvider>
    <App />
  </ModalProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
