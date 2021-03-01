import React from 'react';
import styled from 'styled-components';
import { Resizable } from "re-resizable";

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
        <Resizable
            style={style}
            defaultSize={{
                width: '100%',
                height: 20
            }}
            grid={[0, 25]}
            enable={{ top: false, right: false, bottom: true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
        >
            <div className="hour-box">
                <div></div>
                <Entry className="slot"></Entry> 
            </div>
        </Resizable>
    )
}

export default Event
