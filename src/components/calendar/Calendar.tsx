import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { range, convert24HTo12H } from '../../util/helper'
import Event from './Event'

interface Props {}

const BG = styled.div`
    position: relative;
`

const Row = styled.div`
    display: grid;
    grid-template-columns: 3.5em auto
`

type EventData = {
    start: number
    end: number
}

const Calendar: React.FC<Props> = (props: Props) => {
    const {} = props

    const startHour = 8
    const endHour = 23
    
    const hours = range(startHour, endHour)
    const [events, setEvents] = useState<EventData[]>([])

    const addEvent = (startHour: number, isHalfHour: boolean) => {
        const startTime = startHour + (isHalfHour ? 0.5 : 0.0)
        const newEvent: EventData = {
            start: startTime,
            end: startTime + 0.5
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
                <Event key={`event_${i}`} start={event.start} end={event.end} baseHour={startHour} />
            )}
        </div>
    )
}

export default Calendar
export { Row }
