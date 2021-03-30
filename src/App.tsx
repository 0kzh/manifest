import React, { useState, useEffect, useRef, forwardRef } from "react";
import Calendar from "./components/calendar/Calendar";
import DatePicker from "react-datepicker";
import { range, convert24HTo12H, formatDate } from "./util/helper";
import { DEFAULT_START_TIME, DEFAULT_END_TIME } from "./util/constants";
import { DocumentTextOutline, ChevronLeftOutline, ChevronRightOutline, Cog }from "heroicons-react";
import './App.css';
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<number>(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState<number>(DEFAULT_END_TIME);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLDivElement>(null);

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

  // on initial load, load saved start/end time
  useEffect(() => {
    const savedStartTime: string | null = localStorage.getItem('start_time')
    const savedEndTime: string | null = localStorage.getItem('end_time')
    if (savedStartTime) {
      setStartTime(JSON.parse(savedStartTime))
    }

    if (savedEndTime) {
      setEndTime(JSON.parse(savedEndTime))
    }
  }, [])

  // save start/end time on value change
  useEffect(() => {
    localStorage.setItem("start_time", JSON.stringify(startTime))
    localStorage.setItem("end_time", JSON.stringify(endTime))
  }, [startTime, endTime])

  // custom listener to close settings if clicking outside of it
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (settingsRef.current && !settingsRef.current.contains(event.target as HTMLElement) &&
              settingsBtnRef.current && !settingsBtnRef.current.contains(event.target as HTMLElement)) {
              setSettingsOpen(false)
          }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [settingsRef, settingsBtnRef]);

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
            <b>Daily Manifest</b>
            <div
              ref={settingsBtnRef}
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <Cog className="icon-circular settings" />
            </div>

            {
              settingsOpen &&
              <div className="time-select" ref={settingsRef} onBlur={() => setSettingsOpen(false)}>
                <label>Start Time</label>
                <select 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStartTime(parseInt(e.target.value))}
                  defaultValue={startTime}
                >
                  {range(0, 23).map(hour => 
                    <option key={`start_opt_${hour}`} value={hour}>{convert24HTo12H(hour)}</option>
                  )}
                </select>
                <label>End Time</label>
                <select
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEndTime(parseInt(e.target.value))}
                  defaultValue={endTime}
                >
                  {range(startTime + 1, 23).map(hour => 
                    <option key={`end_opt_${hour}`} value={hour}>{convert24HTo12H(hour)}</option>
                  )}
                </select>
              </div>
            }
          </div>
          <div className="flex-row vert-center" style={{ gap: 5 }}>
            <ChevronLeftOutline onClick={prevDay} className="icon-circular caret" />
            <div>
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)} 
                customInput={<DateDisplay onClick={() => {}} />}
                dayClassName={_ => "day"}
              />
            </div>
            <ChevronRightOutline onClick={nextDay} className="icon-circular caret" />
          </div>
      </div>
      <Calendar curDay={date} startTime={startTime} endTime={endTime} />
    </div>
  );
}


export default App;
