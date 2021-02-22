import React from 'react'
import { range, convert24HTo12H } from '../../util/helper'

interface Props {}

const Calendar: React.FC<Props> = (props: Props) => {
    const {} = props

    const startHour = 8
    const endHour = 23
    
    const hours = range(startHour, endHour)
    console.log(hours)

    return (
        <div className="calendar">
            {hours.map((hour, i) => 
                <div className="hour-box">
                    <div className="col-center">
                        {convert24HTo12H(hour)}
                    </div>
                    <div className="times">
                        {i === 0 && <span className="hour-div"></span>}
                        <div className="slot"></div>
                        <span className="half-hour-div"></span>
                        <div className="slot"></div>
                        <span className="hour-div"></span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Calendar
