import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { startTime, moveStep } from '../../util/constants'
import { dateToNumber } from '../../util/helper'

interface Props {}

const TimeIndicator = (props: Props) => {
    const {} = props
    const [y, setY] = useState<number>()
    const [date, setDate] = useState<Date>(new Date())

    useEffect(() => {
        // simple timer that ticks
        setTimeout(() => {
            setDate(new Date())
        }, 1000)

        if (date) {
            const curTime = dateToNumber(date)
            const startDate = startTime
    
            // originally if 10:30 has passed, yields 10.5
            // need to multiply by 2 since rowHeight => 30 mins
            const elapsed = (curTime - startDate) * 2
            setY(elapsed * moveStep)
        }
    }, [date])
    
    const style = {
        position: 'absolute',
        width: '100%',
        top: y,
        visibility: y && y >= 0 ? 'visible' : 'hidden'
    } as const

    return (
        <div className="hour-box" style={style}>
            <div />
            <div>
                <Circle />
                <Line />
            </div>
        </div>
    )
}

const Circle = styled.div`
    position: absolute;
    background-color: #EA4335;
    border-radius: 50%;
    height: 6px;
    width: 6px;
    margin-left: -3px;
    margin-top: -3px;
`

const Line = styled.div`
    width: 100%;
    height: 1px;
    background-color: #EA4335;
`

export default TimeIndicator
