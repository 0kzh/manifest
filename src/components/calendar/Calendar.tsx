import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { range, convert24HTo12H } from '../../util/helper'
import { EventData } from '../../util/types'
import { v4 as uuid4 } from 'uuid';
import Event from './Event'

interface Props {}

const BG = styled.div`
    position: relative;
`

const Row = styled.div`
    display: grid;
    grid-template-columns: 3.5em auto
`

const Calendar: React.FC<Props> = (props: Props) => {
    const {} = props

    const startHour = 8
    const endHour = 23
    
    const hours = range(startHour, endHour)
    const [events, setEvents] = useState<EventData[]>([])

    // on initial load, get events from localStorage
    useEffect(() => {
        const persistedEvents: string | null = localStorage.getItem("events")
        if (persistedEvents) {
            const loadedEvents: EventData[] = JSON.parse(persistedEvents)
            setEvents(loadedEvents)
        }
    }, [])

    // on change of events, persist to localStorage    
    useEffect(() => {
        localStorage.setItem("events", JSON.stringify(events))
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
                            {convert24HTo12H(hour)}
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
            {events && events.map((event, i) => 
                <Event 
                    key={`event_${i}`} 
                    event={event}
                    baseHour={startHour}
                    setTextForEvent={(newText: string) => {
                        const newEvents = [...events]
                        let newEvent = newEvents.find(ev => ev.id === event.id)
                        if (newEvent) {
                            newEvent.text = newText
                        }
                        setEvents(newEvents)
                    }}
                />
            )}
        </div>
    )
}

export default Calendar
export { Row }
