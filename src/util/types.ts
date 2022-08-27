import React from "react"

// calendar data as map of dates to events
export type CalendarData = {
    [date: string]: EventData[];
}

export type EventData = {
    id: string
    start: number
    end: number
    text: string
    focused?: boolean
}

export type ContextMenuItem = {
    icon: React.ReactNode
    text: string
    onClick: () => void
}