import React, { useState, useRef, forwardRef } from "react";
import Calendar from "./components/calendar/Calendar";
import DatePicker from "react-datepicker";
import { formatDate } from "./util/helper";
import { DocumentTextOutline, ChevronLeftOutline, ChevronRightOutline }from "heroicons-react";
import './App.css';
import "react-datepicker/dist/react-datepicker.css";

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

  interface IPropInput {
    onClick: (date: any) => void;
  }

  const DateDisplay = forwardRef(
    ({ onClick }: IPropInput, ref: React.LegacyRef<HTMLDivElement>) => (
      <div className="date-display" onClick={onClick} ref={ref}>
        <b>{formatDate(date)}</b>
      </div>
    )
  );

  return (
    <div className="container">
      <div className="header">
          <div className="flex-row vert-center">
            <DocumentTextOutline style={{ height: 18, width: 18, marginRight: 5 }}/>
            <b>Daily Manifest</b>
          </div>
          <div className="flex-row vert-center" style={{ gap: 5 }}>
            <ChevronLeftOutline onClick={prevDay} className="icon-circular caret" />
            <div>
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)} 
                customInput={<DateDisplay onClick={() => {}} />}
              />
            </div>
            <ChevronRightOutline onClick={nextDay} className="icon-circular caret" />
          </div>
      </div>
      <Calendar curDay={date} />
    </div>
  );
}

export default App;
