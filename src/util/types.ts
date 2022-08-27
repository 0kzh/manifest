import React from "react"

export type PersistedData = {
    [date: string]: any;
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