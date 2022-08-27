import { TrashIcon } from "@heroicons/react/outline";
import React, { useRef } from "react";
import styled from "styled-components";
import { ContextMenuItem } from "../util/types";
import { TChecklistItem } from "./Checklist";
import ContextMenu from "./ContextMenu";

type Props = {
  item: TChecklistItem;
  onCheck: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
};

const ChecklistInput: React.FC<Props> = ({ item, onCheck, onChange, onDelete }) => {
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
      <input
        type="checkbox"
        className="h-4 w-4 text-black border-gray-300 rounded cursor-pointer"
        checked={item.checked}
        onChange={onCheck}
      />
      <Input
        ref={inputRef}
        type="text"
        value={item.value}
        onChange={onChange}
      />
      <ContextMenu
        parentRef={inputRef}
        items={menuItems}
      />
    </div>
  );
};

const Input = styled.input`
  border-radius: 4px;
  box-sizing: border-box;

  &:hover:not(:focus) {
    background-color: #ededed;
    cursor: pointer;
  }
`;

export default ChecklistInput;
