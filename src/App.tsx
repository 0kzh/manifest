import React from "react";
import Calendar from "./components/calendar/Calendar";
import { getDate } from "./util/helper";
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="header">
          <div>Daily Manifest</div>
          <div>{getDate()}</div>
      </div>
      <Calendar />
    </div>
  );
}

export default App;
