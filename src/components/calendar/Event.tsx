import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Rnd } from "react-rnd";
import { EventData, ContextMenuItem } from "../../util/types";
import { moveStep, rowHeight, paddingMultiplier } from "../../util/constants";
import ContextMenu from "../ContextMenu";
import { TrashIcon } from "@heroicons/react/24/solid";

interface Props {
  event: EventData;
  baseTime: number;
  updateEvent: (newEvent: EventData) => void;
  deleteEvent: (id: string) => void;
}

const style = {
  position: "absolute",
  width: "100%",
  top: 0,
} as const;

const Entry = styled.div`
  background: black;
  top: 2px;
  color: white;
  padding: 0px 10px;
  width: auto;
`;

const Input = styled.input`
  background: transparent;
  font-size: 12px;
  font-family: mono, monospace;
  font-weight: bold;
  border: none !important;
  outline: none !important;
  color: white;
  width: 100%;
  padding: 0px;

  &:focus {
    box-shadow: none;
  }

  &:not(:focus) {
    cursor: pointer;
  }
`;

const Event: React.FC<Props> = (props: Props) => {
  const { event, baseTime, updateEvent, deleteEvent } = props;

  // const [focused, setFocused] = useState<boolean>(false);
  const [isDragAndDrop, setIsDragAndDrop] = useState<boolean>(false);
  const [resizable, setResizable] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFocused = (focused: boolean) => {
    const newEvent = event;
    newEvent.focused = focused;
    updateEvent(newEvent);
  };

  useEffect(() => {
    if (!event.text) {
      setFocused(true);
      focusInput();
    }

    return setFocused(false);
  }, []);

  const focusInput = () => {
    setTimeout(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    });
  };

  const blurInput = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.blur();
    }
  };

  const menuItems: ContextMenuItem[] = [
    {
      icon: <TrashIcon style={{ height: 12, width: 12 }} />,
      text: "Delete",
      onClick: () => deleteEvent(event.id),
    },
  ];

  return (
    <Rnd
      style={style}
      default={{
        x: 0,
        y: moveStep * (event.start - baseTime) * 2,
        width: "100%",
        height: rowHeight * (event.end - event.start) * 2 * paddingMultiplier,
      }}
      resizeGrid={[0, moveStep]}
      dragGrid={[1, moveStep]}
      dragAxis={"y"}
      bounds={"parent"}
      enableResizing={{
        top: false,
        right: false,
        bottom: resizable && true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      onDragStop={(_, d) => {
        const step = Math.round(d.y / moveStep);
        const newStartTime = baseTime + step / 2;

        const newEvent = event;
        newEvent.end = event.end + (newStartTime - event.start);
        newEvent.start = newStartTime;
        updateEvent(newEvent);
      }}
      onResizeStop={(_, direc, ref, delta, pos) => {
        const span =
          parseInt(ref.style.height, 10) / rowHeight / paddingMultiplier;
        const newEndTime = event.start + span / 2;

        const newEvent = event;
        newEvent.end = newEndTime;
        updateEvent(newEvent);
      }}
    >
      <div className="hour-box">
        <div></div>
        <Entry
          className="slot"
          ref={containerRef}
          onMouseDown={(e) => e.button === 0 && setIsDragAndDrop(false)}
          onMouseMove={(e) => e.button === 0 && setIsDragAndDrop(true)}
          onMouseUp={(e) => {
            if (e.button !== 0) return;
            if (!isDragAndDrop) {
              setFocused(true);
              setTimeout(() => {
                focusInput();
              });
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <Input
            ref={inputRef}
            type="text"
            spellCheck={false}
            disabled={!event.focused}
            value={event.text}
            onChange={(e) => {
              const newEvent = event;
              newEvent.text = e.target.value;
              updateEvent(newEvent);
            }}
            onMouseUp={(e) =>
              e.button === 0 && (event.focused ? e.stopPropagation() : () => {})
            }
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                blurInput();
              }
            }}
            onKeyUp={(e) => e.stopPropagation()}
          />
        </Entry>
      </div>
      <ContextMenu
        parentRef={containerRef}
        items={menuItems}
        // this hack is needed as the resize event fights with the `click` event on the contextMenu
        // because of this, we disable resizing when the contextMenu is open
        setContextMenuOpen={(isOpen: boolean) => setResizable(!isOpen)}
      />
    </Rnd>
  );
};

export default Event;
