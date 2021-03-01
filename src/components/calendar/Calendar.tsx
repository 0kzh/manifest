import React from 'react'
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

const Calendar: React.FC<Props> = (props: Props) => {
    const {} = props

    const startHour = 8
    const endHour = 23
    
    const hours = range(startHour, endHour)
    console.log(hours)

    return (
        <div className="calendar">
            <BG>
                {hours.map((hour, i) => 
                    <Row>
                        <div className="col-center">
                            {convert24HTo12H(hour)}
                        </div>
                        <div className="times">
                                {i === 0 && <span className="hour-div"></span>}

                                <div className="slot slot-bg"></div>
                                <span className="half-hour-div"></span>
                                <div className="slot slot-bg"></div>
                                <span className="hour-div"></span>
                        </div>
                    </Row>
                )}
            </BG>
            <Event />
        </div>
    )
}

export default Calendar
export { Row }
