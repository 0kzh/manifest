/* global chrome */

import React, { useState, useEffect, useRef, forwardRef } from "react";
import Calendar from "./components/calendar/Calendar";
import DatePicker from "react-datepicker";
import {
  range,
  convert24HTo12H,
  formatDate,
  useKeyPress,
  getKey,
  setKey,
} from "./util/helper";
import { DEFAULT_START_TIME, DEFAULT_END_TIME } from "./util/constants";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import Checklist from "./components/checklist/Checklist";
import { useApp } from "./contexts/AppContext";
import Goals from "./components/goals/Goals";
import Reflection from "./components/reflection/Reflection";

function App() {
  const { date, setDate, inputFocused } = useApp();
  const [startTime, setStartTime] = useState<number>(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState<number>(DEFAULT_END_TIME);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const inputFocusedRef = useRef<boolean>(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLDivElement>(null);

  const prevDay = () => {
    const newDate = new Date();
    newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date();
    newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  // on initial load, load saved start/end time
  useEffect(() => {
    getKey("start_time", (res) => {
      if (res.start_time) {
        setStartTime(res.start_time);
      }
    });

    getKey("end_time", (res) => {
      if (res.end_time) {
        setEndTime(res.end_time);
      }
    });
  }, []);

  // save start/end time on value change
  useEffect(() => {
    setKey("start_time", startTime);
    setKey("end_time", endTime);
  }, [startTime, endTime]);

  // custom listener to close settings if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as HTMLElement) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(event.target as HTMLElement)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsRef, settingsBtnRef]);

  useEffect(() => {
    inputFocusedRef.current = inputFocused
  }, [inputFocused]);

  useEffect(() => {
    if (leftPress && !inputFocusedRef.current) {
      prevDay();
    }
  }, [leftPress]);

  useEffect(() => {
    if (rightPress && !inputFocusedRef.current) {
      console.log("nextDay")
      nextDay();
    }
  }, [rightPress]);

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
          <b>Manifest</b>
          <div
            ref={settingsBtnRef}
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <Cog8ToothIcon className="icon-circular settings" />
          </div>

          {settingsOpen && (
            <div
              className="time-select"
              ref={settingsRef}
              onBlur={() => setSettingsOpen(false)}
            >
              <label>Start Time</label>
              <select
                className="pl-2 pr-8 py-0 rounded text-xs border-gray-500 focus:outline-none"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setStartTime(parseInt(e.target.value))
                }
                defaultValue={startTime}
              >
                {range(0, 23).map((hour) => (
                  <option key={`start_opt_${hour}`} value={hour}>
                    {convert24HTo12H(hour)}
                  </option>
                ))}
              </select>
              <label>End Time</label>
              <select
                className="pl-2 pr-8 py-0 rounded text-xs border-gray-500 focus:outline-none"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setEndTime(parseInt(e.target.value))
                }
                defaultValue={endTime}
              >
                {range(startTime + 1, 23).map((hour) => (
                  <option key={`end_opt_${hour}`} value={hour}>
                    {convert24HTo12H(hour)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex-row vert-center" style={{ gap: 5 }}>
          <ChevronLeftIcon onClick={prevDay} className="icon-circular caret" />
          <div>
            <DatePicker
              selected={date}
              onChange={(date: Date) => setDate(date)}
              customInput={
                datePickerOpen ? (
                  <div className="pointer-events-none cursor-pointer">
                    <b>{formatDate(date)}</b>
                  </div>
                ) : (
                  <DateDisplay onClick={() => {}} />
                )
              }
              onCalendarOpen={() => setDatePickerOpen(true)}
              onCalendarClose={() => setDatePickerOpen(false)}
              dayClassName={() => "day"}
            />
          </div>
          <ChevronRightIcon onClick={nextDay} className="icon-circular caret" />
        </div>
      </div>
      <div className="flex w-full gap-4">
        <Calendar startTime={startTime} endTime={endTime} />
        <div className="flex flex-col" style={{ gap: 48, marginTop: -1 }}>
          <Checklist name="TODO" addItemText="Add TODO" />
          <Checklist name="Habits" addItemText="Add Habit" />
          <Goals name="Goals" addItemText="Add Goal" />
          <Reflection />
        </div>
      </div>
    </div>
  );
}

export default App;
