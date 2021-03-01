import React from 'react';
import styled from 'styled-components';
import { Rnd } from "react-rnd";

interface Props {
    start: number
    end: number
    baseHour: number
}

const style = {
    position: 'absolute',
    width: '100%',
    top: 0
} as const

const Entry = styled.div`
    background: black;
    top: 2px;
`

const Event: React.FC<Props> = (props: Props) => {
    const {start, end, baseHour} = props

    const moveStep = 25
    const rowHeight = 20

    return (
        <Rnd
            style={style}
            default={{
                x: 0,
                y: moveStep * (start - baseHour) * 2,
                width: '100%',
                height: rowHeight
            }}
            resizeGrid={[0, moveStep]}
            dragGrid={[1, moveStep]}
            dragAxis={'y'}
            enableResizing={{ top: true, right: false, bottom: true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
        >
            <div className="hour-box">
                <div></div>
                <Entry className="slot"></Entry> 
            </div>
        </Rnd>
    )
}

export default Event
