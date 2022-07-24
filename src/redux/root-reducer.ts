import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { BrowserHistory } from "history";

export const createRootReducer = (history: BrowserHistory) =>
  combineReducers({
    router: connectRouter(history)
  });
