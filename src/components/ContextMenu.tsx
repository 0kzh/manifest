import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ContextMenuItem } from '../util/types'

interface Props {
    parentRef: React.RefObject<any>
    items: ContextMenuItem[]
}

const ContextMenu = (props: Props)  => {
    const { parentRef, items } = props

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [x, setX] = useState<number>(0)
    const [y, setY] = useState<number>(0)

    useEffect(() => {
        const parent = parentRef.current
        if (!parent) {
            return
        }
        
        const showMenu = (event: MouseEvent) => {
            event.preventDefault()
            setIsVisible(true)
            setX(event.clientX - parent.getBoundingClientRect().left)
            setY(event.clientY - parent.getBoundingClientRect().top)
        }

        const closeMenu = () => {
            setIsVisible(false)
        }

        parent.addEventListener('contextmenu', showMenu)
        window.addEventListener('click', closeMenu)

        return function cleanup() {
            parent.removeEventListener('contextmenu', showMenu)
            window.removeEventListener('click', closeMenu)
        }
    })

    return isVisible ?  (
        <ContextMenuWrapper left={x} top={y} onContextMenu={(e) => e.preventDefault()}>
            {items.map((item, index) => {
                return (
                    <ContextItemWrapper
                        key={index}
                        onClick={item.onClick}
                    >
                        {item.icon}
                        {item.text}
                    </ContextItemWrapper>
                );
            })}
        </ContextMenuWrapper>
    ) : null;
}

interface ContextMenuWrapperProps {
    top: number;
    left: number;
}

const ContextMenuWrapper = styled.div`
    position: absolute;
    font-size: 11px;
    background: #EA4335;
    color: white;
    border-radius: 3px;
    padding: 2px 5px;
    border: 1px solid black;
    top: ${(p: ContextMenuWrapperProps) => p.top}px;
    left: ${(p: ContextMenuWrapperProps) => p.left}px;
    transform: translate(50%, 25%);
`

const ContextItemWrapper = styled.div`
    display: flex;
    gap: 4px;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    z-index: 999;
`

export default ContextMenu
