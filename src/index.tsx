import React from "react";
import ReactDOM from "react-dom";
import { createHashHistory } from "history";
import { Provider } from "mobx-react";
import { syncHistoryWithStore } from "mobx-react-router";
import { Router } from "react-router";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import systemStore from "./stores/systemStore";
import routingStore from "./stores/routingStore";
import authStore from "./stores/authStore";

const stores = {
  routingStore: routingStore,
  systemStore: systemStore,
  authStore: authStore,
};

const hashHistory = createHashHistory();
const history = syncHistoryWithStore(hashHistory, stores.routingStore);

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
