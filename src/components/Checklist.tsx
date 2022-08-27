import { PlusCircleIcon } from "@heroicons/react/solid";
import React from "react";

export type TChecklistItem = {
  value: string;
  checked: boolean;
};

type TChecklistProps = {
  name: string;
  items: TChecklistItem[];
} & AddItemProps;

const Checklist: React.FC<TChecklistProps> = ({ name, items, addItemText }) => {
  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginTop: -22, marginBottom: 4 }}>
        <b>{name}</b>
        <AddItem addItemText={addItemText} />
      </div>
      {items.map((item) => (
        <div key={item.value} className="todo">
          <input
            type="checkbox"
            className="h-4 w-4 mr-1 text-black border-gray-300 rounded cursor-pointer"
          />
          <input type="text" value={item.value} />
        </div>
      ))}
    </div>
  );
};

type AddItemProps = {
  addItemText?: string;
}

const AddItem: React.FC<AddItemProps> = ({ addItemText="New Item" }) => {
  return (
    <div className="flex items-center gap-1 text-gray-400 rounded hover:bg-gray-200 cursor-pointer px-1 select-none">
      <PlusCircleIcon className="h-3 w-3" />
      <span style={{ fontSize: 10, fontWeight: 'bold' }}>{addItemText}</span>
    </div>
  );
}

export default Checklist;
