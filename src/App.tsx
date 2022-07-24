import React, { useEffect } from "react";
import { fetchPeopleListApi } from "@/api/people";
import "./styles.css";

export default function App() {
  useEffect(() => {
    fetchPeopleListApi();
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
