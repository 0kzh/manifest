import React from "react"

export type EventData = {
    id: string
    start: number
    end: number
    text: string
}

export type ContextMenuItem = {
    icon: React.ReactNode
    text: string
    onClick: () => void
}