import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store from "store/store";
import { QueryClientProvider } from "react-query";
import { queryClient } from "services/client/query.config";
/* Require Editor JS files. */
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";
// import 'froala-editor/js/plugins/word_export.min.js';
import "froala-editor/js/languages/ru";

import "./react-i18next";
import { CommonProvider } from "context/useCommon";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CommonProvider>
          <App />
        </CommonProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
  // </React.StrictMode>
);
