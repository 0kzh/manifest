/* global chrome */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  range,
  convert24HTo12H,
  generateKey,
  getKey,
  setKey,
} from "../../util/helper";
import { CalendarData, EventData } from "../../util/types";
import { v4 as uuid4 } from "uuid";
import Event from "./Event";
import TimeIndicator from "./TimeIndicator";
import { getAllJSDocTags } from "typescript";
import { useApp } from "../../contexts/AppContext";

interface Props {
  startTime: number;
  endTime: number;
  setInputFocusedHandler: (focused: boolean) => void;
}

const BG = styled.div`
  position: relative;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 3.5em auto;
`;

const Calendar: React.FC<Props> = (props: Props) => {
  const { startTime, endTime, setInputFocusedHandler } = props;
  const { date } = useApp();

  const hours = range(startTime, endTime);
  const [data, setData] = useState<CalendarData>({});

  // on initial load, get events from Chrome storage
  useEffect(() => {
    const key = generateKey(date);
    if (!(key in data)) {
      getKey(key, (val) => {
        if (val) {
          setData({ ...data, [key]: val });
        }
      });
    }
  }, [date, data]);

  // on change of events, persist to Chrome storage
  useEffect(() => {
    const key = generateKey(date);
    if (data[key]) {
      setKey(key, data[key]);
      setInputFocusedHandler(data[key]?.some((e) => e.focused));
    }
  }, [data, date, setInputFocusedHandler])

  const addEvent = (startHour: number, isHalfHour: boolean) => {
    const startTime = startHour + (isHalfHour ? 0.5 : 0.0);
    const newEvent: EventData = {
      id: uuid4(),
      start: startTime,
      end: startTime + 0.5,
      text: "",
    };

    const key = generateKey(date);
    setData({ ...data, [key]: [...(data[key] || []), newEvent] });
  };

  const events: EventData[] = (data && data[generateKey(date)]) || [];

  return (
    <div className="calendar">
      <BG>
        {hours.map((hour, i) => (
          <Row key={`hour_${i}`}>
            <div className="col-center">
              <span className="hour">{convert24HTo12H(hour)}</span>
            </div>
            <div className="times">
              {i === 0 && <span className="hour-div" />}

              <div
                className="slot slot-bg"
                onClick={() => addEvent(hour, false)}
              />
              <span className="half-hour-div" />
              <div
                className="slot slot-bg"
                onClick={() => addEvent(hour, true)}
              />
              <span className="hour-div" />
            </div>
          </Row>
        ))}
      </BG>
      {events &&
        events
          .filter(
            (event) => event.start >= startTime && event.end <= endTime + 1
          )
          .map((event, i) => (
            <Event
              key={`event_${event.id}_${startTime}_${endTime}`}
              event={event}
              baseTime={startTime}
              updateEvent={(newEvent: EventData) => {
                const key = generateKey(date);
                setData({
                  ...data,
                  [key]: data[key]?.map((e) =>
                    e.id === event.id ? newEvent : e
                  ),
                });
              }}
              deleteEvent={(id: string) => {
                console.log("triggered")
                const key = generateKey(date);
                setData({
                  ...data,
                  [key]: data[key]?.filter((e) => e.id !== id),
                });
              }}
            />
          ))}
      <TimeIndicator startTime={startTime} endTime={endTime} />
    </div>
  );
};

export default Calendar;
export { Row };
