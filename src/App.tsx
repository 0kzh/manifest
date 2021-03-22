import React from "react";
import Calendar from "./components/calendar/Calendar";
import { getDate } from "./util/helper";
import { DocumentTextOutline }from "heroicons-react";
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="header">
          <div className="flex-row vert-center">
            <DocumentTextOutline style={{ height: 18, width: 18, marginRight: 5 }}/>
            <b>Daily Manifest</b>
          </div>
          <b>{getDate()}</b>
      </div>
      <Calendar />
    </div>
  );
}

export default App;
