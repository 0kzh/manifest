import { TrashIcon } from "@heroicons/react/24/outline";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { ContextMenuItem, EmojiData } from "../../util/types";
import ContextMenu from "../ContextMenu";
import { TGoalItem } from "./Goals";

type Props = {
  item: TGoalItem;
  onEmojiChange: (emoji: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
};

const GoalInput: React.FC<Props> = ({
  item,
  onEmojiChange,
  onChange,
  onDelete,
}) => {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const menuItems: ContextMenuItem[] = [
    {
      icon: <TrashIcon style={{ height: 12, width: 12 }} />,
      text: "Delete",
      onClick: onDelete,
    },
  ];

  return (
    <div className="todo relative" style={{ marginTop: -1 }}>
      <div className="relative">
        <div
          className="px-1 text-lg text-center rounded hover:bg-gray-200 cursor-pointer"
          onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
        >
          {item.emoji}
        </div>
        {emojiPickerOpen && (
          <div className="absolute z-10" onBlur={() => setEmojiPickerOpen(false)}>
            <Picker
              data={data}
              onEmojiSelect={(emoji: EmojiData) => {
                onEmojiChange(emoji.native);
                setEmojiPickerOpen(false);
              }}
              theme="light"
              previewPosition="none"
            />
          </div>
        )}
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={item.value}
        onChange={onChange}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      />
      <ContextMenu parentRef={inputRef} items={menuItems} />
    </div>
  );
};

const Input = styled.input`
  padding-left: 0.5em;
  border-radius: 4px;
  box-sizing: border-box;

  &:hover:not(:focus) {
    background-color: #ededed;
    cursor: pointer;
  }
`;

export default GoalInput;
