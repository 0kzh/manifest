import React, { useEffect, useRef } from 'react';
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
    color: white;
    padding: 0px 10px;
    width: auto;
`

const Input = styled.input`
    background: transparent;
    font-size: 12px;
    font-family: mono, monospace;
    font-weight: bold;
    margin-top: 2px;
    border: none;
    outline: none;
    color: white;
    width: 100%;
`

const Event: React.FC<Props> = (props: Props) => {
    const {start, end, baseHour} = props
    const inputRef = useRef<HTMLInputElement>(null);

    const moveStep = 25
    const rowHeight = 20

    useEffect(() => {
        focusInput()
    }, [])

    const focusInput = () => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus()
        }
    }

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
            bounds={'parent'}
            enableResizing={{ top: false, right: false, bottom: true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
        >
            <div className="hour-box">
                <div></div>
                <Entry className="slot" onClick={focusInput}>
                    <Input ref={inputRef} type="text" spellCheck={false} />    
                </Entry> 
            </div>
        </Rnd>
    )
}

export default Event
