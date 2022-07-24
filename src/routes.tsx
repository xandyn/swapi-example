import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "./App";

export const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<App />} />
      </Route>
    </Routes>
  );
};
