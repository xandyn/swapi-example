import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";

import { rootSaga } from "./redux/root-saga";

const sagaMiddleware = createSagaMiddleware();

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({ history: createBrowserHistory() });

export const store = createStore(
  combineReducers({
    router: routerReducer
  }),
  compose(applyMiddleware(routerMiddleware, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export const history = createReduxHistory(store);
