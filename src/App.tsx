import React, { useState, useEffect } from "react";
import Calendar from "./components/calendar/Calendar";
import { formatDate } from "./util/helper";
import { DocumentTextOutline, ChevronLeftOutline, ChevronRightOutline }from "heroicons-react";
import './App.css';

function App() {
  const [date, setDate] = useState<Date>(new Date());

  const prevDay = () => {
    const newDate = new Date()
    newDate.setDate(date.getDate() - 1)
    setDate(newDate)
  }

  const nextDay = () => {
    const newDate = new Date()
    newDate.setDate(date.getDate() + 1)
    setDate(newDate)
  }

  return (
    <div className="container">
      <div className="header">
          <div className="flex-row vert-center">
            <DocumentTextOutline style={{ height: 18, width: 18, marginRight: 5 }}/>
            <b>Daily Manifest</b>
          </div>
          <div className="flex-row vert-center" style={{ gap: 5 }}>
            <ChevronLeftOutline onClick={prevDay} className="icon-circular caret" />
            <b>{formatDate(date)}</b>
            <ChevronRightOutline onClick={nextDay} className="icon-circular caret" />
          </div>
      </div>
      <Calendar curDay={date} />
    </div>
  );
}

export default App;
