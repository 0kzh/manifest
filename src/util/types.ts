import React from "react"
import { TChecklistItem } from "../components/Checklist";

export type PersistedData = {
    [date: string]: {
        events: EventData[],
        todos: TChecklistItem[],
    };
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