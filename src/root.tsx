import { Provider } from "react-redux";
import { Store } from "redux";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { BrowserHistory } from "history";

import { RoutesComponent } from "./routes";

type RootProps = {
  store: Store;
  history: BrowserHistory;
};

export const Root = ({ store, history }: RootProps) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <RoutesComponent />
      </Router>
    </Provider>
  );
};
