import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Rnd } from "react-rnd";
import { EventData } from '../../util/types'
import { moveStep, rowHeight, paddingMultiplier } from '../../util/constants'
interface Props {
    event: EventData
    baseTime: number
    updateEvent: (newEvent: EventData) => void
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

    &:not(:focus) {
        cursor: pointer;
    }
`

const Event: React.FC<Props> = (props: Props) => {
    const { event, baseTime, updateEvent } = props

    const [focused, setFocused] = useState(false);
    const [isDragAndDrop, setIsDragAndDrop] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!event.text) {
            focusInput()
        }
    }, [])

    const focusInput = () => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }

    return (
        <Rnd
            style={style}
            default={{
                x: 0,
                y: moveStep * (event.start - baseTime) * 2,
                width: '100%',
                height: rowHeight * (event.end - event.start) * 2 * paddingMultiplier
            }}
            resizeGrid={[0, moveStep]}
            dragGrid={[1, moveStep]}
            dragAxis={'y'}
            bounds={'parent'}
            enableResizing={{ top: false, right: false, bottom: true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
            onDragStop={(_, d) => {
                const step = Math.round(d.y / moveStep)
                const newStartTime = baseTime + (step / 2)
                
                const newEvent = event
                newEvent.end = event.end + (newStartTime - event.start)
                newEvent.start = newStartTime
                updateEvent(newEvent)
            }}
            onResizeStop={(_, direc, ref, delta, pos) => {
                const span = parseInt(ref.style.height, 10) / rowHeight / paddingMultiplier
                const newEndTime = event.start + (span / 2)
                
                const newEvent = event
                newEvent.end = newEndTime
                updateEvent(newEvent)
            }}
        >
            <div className="hour-box">
                <div></div>
                <Entry
                    className="slot"
                    onMouseDown={() => setIsDragAndDrop(false)}
                    onMouseMove={() => setIsDragAndDrop(true)}
                    onMouseUp={() => {
                        if (!isDragAndDrop) {
                            setFocused(true)
                            setTimeout(() => {
                                focusInput()
                            })
                        } 
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                >
                    <Input
                        ref={inputRef}
                        type="text"
                        spellCheck={false}
                        disabled={!focused}
                        value={event.text}
                        onChange={(e) => {
                            const newEvent = event
                            newEvent.text = e.target.value
                            updateEvent(newEvent)
                        }}
                        onMouseUp={(e) => focused ? e.stopPropagation() : () => {}}
                    />    
                </Entry> 
            </div>
        </Rnd>
    )
}

export default Event
