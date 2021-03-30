import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { range, convert24HTo12H, generateKey } from '../../util/helper'
import { EventData } from '../../util/types'
import { v4 as uuid4 } from 'uuid';
import Event from './Event'
import TimeIndicator from './TimeIndicator'

interface Props {
    curDay: Date
    startTime: number
    endTime: number
}

const BG = styled.div`
    position: relative;
`

const Row = styled.div`
    display: grid;
    grid-template-columns: 3.5em auto
`

const Calendar: React.FC<Props> = (props: Props) => {
    const { curDay, startTime, endTime } = props
    
    const hours = range(startTime, endTime)
    const [events, setEvents] = useState<EventData[]>([])

    // on initial load, get events from localStorage
    useEffect(() => {
        let loadedEvents: EventData[] = []
        const persistedEvents: string | null = localStorage.getItem(generateKey(curDay))
        if (persistedEvents) {
            loadedEvents = JSON.parse(persistedEvents)
        }

        setEvents(loadedEvents)
    }, [curDay])

    // on change of events, persist to localStorage    
    useEffect(() => {
        localStorage.setItem(generateKey(curDay), JSON.stringify(events))
    }, [events])

    const addEvent = (startHour: number, isHalfHour: boolean) => {
        const startTime = startHour + (isHalfHour ? 0.5 : 0.0)
        const newEvent: EventData = {
            id: uuid4(),
            start: startTime,
            end: startTime + 0.5,
            text: ''
        }

        if (events) {
            setEvents([...events, newEvent])
        }
    }

    return (
        <div className="calendar">
            <BG>
                {hours.map((hour, i) => 
                    <Row key={`hour_${i}`}>
                        <div className="col-center">
                            <span className="hour">{convert24HTo12H(hour)}</span>
                        </div>
                        <div className="times">
                                {i === 0 && <span className="hour-div" />}

                                <div className="slot slot-bg" onClick={() => addEvent(hour, false)}/>
                                <span className="half-hour-div" />
                                <div className="slot slot-bg" onClick={() => addEvent(hour, true)}/>
                                <span className="hour-div" />
                        </div>
                    </Row>
                )}
            </BG>
            {events && events.filter(event => event.start >= startTime && event.end <= endTime + 1).map((event, i) =>
                <Event 
                    key={`event_${event.id}_${startTime}_${endTime}`} 
                    event={event}
                    baseTime={startTime}
                    updateEvent={(newEvent: EventData) => {
                        const newEvents = events.map(e => e.id === event.id ? newEvent : e)
                        setEvents(newEvents)
                    }}
                    deleteEvent={(id: string) => {
                        const newEvents = events.filter(e => e.id !== id)
                        setEvents(newEvents)
                    }}
                />
            )}
            <TimeIndicator startTime={startTime} endTime={endTime} />
        </div>
    )
}

export default Calendar
export { Row }
