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
import { EventData } from "../../util/types";
import { v4 as uuid4 } from "uuid";
import Event from "./Event";
import TimeIndicator from "./TimeIndicator";
import { getAllJSDocTags } from "typescript";
import { useApp } from "../../contexts/AppContext";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  startTime: number;
  endTime: number;
}

const BG = styled.div`
  position: relative;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 3.5em auto;
`;

const Calendar: React.FC<Props> = (props: Props) => {
  const { startTime, endTime } = props;
  const { date, data, setData } = useApp();

  const hours = range(startTime, endTime);

  const addEvent = (startHour: number, isHalfHour: boolean) => {
    const startTime = startHour + (isHalfHour ? 0.5 : 0.0);
    const newEvent: EventData = {
      id: uuid4(),
      start: startTime,
      end: startTime + 0.5,
      text: "",
    };

    const key = generateKey(date);
    setData({ ...data, [key]: {
      ...data[key],
      events: [...(data[key].events || []), newEvent] }
    });
  };

  const events: EventData[] = (data && data[generateKey(date)]?.events) || [];
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = generateKey(yesterday);
  const yesterdaysEvents = data[yesterdayKey]?.events || [];

  const fillFromYesterday = () => {
    const newEvents = yesterdaysEvents.map((event: EventData) => ({
      ...event,
      id: uuid4(),
    }));
    const newData = { ...data, [generateKey(date)]: { ...data[generateKey(date)], events: newEvents } };
    setData(newData);
  }

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
                  [key]: {
                    ...data[key],
                    events: data[key].events?.map((e: EventData) =>
                      e.id === event.id ? newEvent : e
                    )
                  },
                });
              }}
              deleteEvent={(id: string) => {
                console.log("triggered")
                const key = generateKey(date);
                setData({
                  ...data,
                  [key]: {
                    ...data[key],
                    events: data[key].events?.filter((e: EventData) => e.id !== id),
                  },
                });
              }}
            />
          ))}
      <TimeIndicator startTime={startTime} endTime={endTime} />
      {events.length === 0 && <button
        className="flex items-center justify-center gap-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 w-full mt-2 py-2"
        onClick={fillFromYesterday}
      >
        <ArrowUturnLeftIcon className="h-3 w-3" />
        Fill from yesterday
      </button>
    }
    </div>
  );
};

export default Calendar;
export { Row };
