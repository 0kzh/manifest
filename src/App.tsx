/* global chrome */

import React, { useState, useEffect, useRef, forwardRef } from "react";
import Calendar from "./components/calendar/Calendar";
import DatePicker from "react-datepicker";
import { range, convert24HTo12H, formatDate, useKeyPress } from "./util/helper";
import { DEFAULT_START_TIME, DEFAULT_END_TIME } from "./util/constants";
import { ChevronLeftIcon, ChevronRightIcon }from '@heroicons/react/outline';
import { CogIcon }from '@heroicons/react/solid';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<number>(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState<number>(DEFAULT_END_TIME);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");

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
    chrome.storage.sync.get(['start_time'], function(res) {
      if (res.start_time) {
        setStartTime(res.start_time)
      }
    });

    chrome.storage.sync.get(['end_time'], function(res) {
      if (res.end_time) {
        setEndTime(res.end_time)
      }
    });
  }, [])

  // save start/end time on value change
  useEffect(() => {
    chrome.storage.sync.set({ 'start_time': startTime })
    chrome.storage.sync.set({ 'end_time': endTime })
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

  // use arrow keys to skip days
  useEffect(() => {
    if (leftPress) {
      prevDay()
    }
  }, [leftPress])

  useEffect(() => {
    if (rightPress) {
      nextDay()
    }
  }, [rightPress])

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
              <CogIcon className="icon-circular settings" />
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
            <ChevronLeftIcon onClick={prevDay} className="icon-circular caret" />
            <div>
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)} 
                customInput={<DateDisplay onClick={() => {}} />}
                dayClassName={_ => "day"}
              />
            </div>
            <ChevronRightIcon onClick={nextDay} className="icon-circular caret" />
          </div>
      </div>
      <Calendar curDay={date} startTime={startTime} endTime={endTime} />
    </div>
  );
}


export default App;
