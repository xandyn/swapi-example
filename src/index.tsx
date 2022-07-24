import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";

import { Root } from "./root";
import { store, history } from "./store";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement as HTMLElement);

root.render(
  <StrictMode>
    <Root store={store} history={history} />
  </StrictMode>
);
