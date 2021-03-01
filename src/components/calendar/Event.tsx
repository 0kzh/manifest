import React from 'react';
import styled from 'styled-components';
import { Rnd } from "react-rnd";

interface Props {}

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
    const {} = props

    return (
        <Rnd
            style={style}
            default={{
                x: 0,
                y: 0,
                width: '100%',
                height: 20
            }}
            resizeGrid={[0, 25]}
            dragGrid={[1, 25]}
            dragAxis={'y'}
            enableResizing={{ top: false, right: false, bottom: true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
        >
            <div className="hour-box">
                <div></div>
                <Entry className="slot"></Entry> 
            </div>
        </Rnd>
    )
}

export default Event
