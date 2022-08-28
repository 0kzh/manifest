import { ArrowUturnLeftIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import React, { useRef } from "react";
import { useApp } from "../contexts/AppContext";
import { generateKey, toSnakeCase } from "../util/helper";
import { v4 as uuid4 } from "uuid";
import styled from "styled-components";
import ContextMenu from "./ContextMenu";
import ChecklistInput from "./ChecklistInput";

export type TChecklistItem = {
  id: string;
  value: string;
  checked: boolean;
};

type TChecklistProps = {
  name: string;
} & AddItemProps;

const Checklist: React.FC<TChecklistProps> = ({ name, addItemText }) => {
  const { date, data, setData } = useApp();
  const key = toSnakeCase(name);
  const curDay = generateKey(date);

  const items = data[curDay]?.[key] || [];

  const addItem = (value: string) => {
    const newItem = { id: uuid4(), value, checked: false };
    const newItems = [...items, newItem];
    const newData = { ...data, [curDay]: { ...data[curDay], [key]: newItems } };
    setData(newData);
  };

  const fillFromYesterday = () => {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = generateKey(yesterday);
    const yesterdaysItems = data[yesterdayKey]?.[key] || [];
    const newItems = yesterdaysItems.map((item: TChecklistItem) => ({
      ...item,
      id: uuid4(),
    }));
    const newData = { ...data, [curDay]: { ...data[curDay], [key]: newItems } };
    setData(newData);
  };

  return (
    <div>
      <div
        className="flex items-center justify-between"
        style={{ marginTop: -20, marginBottom: 4 }}
      >
        <b>{name}</b>
        <AddItem addItemText={addItemText} onClick={() => addItem("")} />
      </div>
      {items.map((item: TChecklistItem) => (
        <ChecklistInput
          key={item.id}
          item={item}
          onCheck={() => {
            const newItems = items.map((i: TChecklistItem) =>
              i.id === item.id ? { ...i, checked: !i.checked } : i
            );
            const newData = {
              ...data,
              [curDay]: { ...data[curDay], [key]: newItems },
            };
            setData(newData);
          }}
          onChange={(e) => {
            const newItems = items.map((i: TChecklistItem) =>
              i.id === item.id ? { ...i, value: e.target.value } : i
            );
            const newData = {
              ...data,
              [curDay]: { ...data[curDay], [key]: newItems },
            };
            setData(newData);
          }}
          onDelete={() => {
            const newItems = items.filter(
              (i: TChecklistItem) => i.id !== item.id
            );
            const newData = {
              ...data,
              [curDay]: { ...data[curDay], [key]: newItems },
            };
            setData(newData);
          }}
        />
      ))}
      {items.length === 0 && (
        <>
          <button
            className="flex items-center justify-center gap-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 w-full mt-2 py-2"
            onClick={fillFromYesterday}
          >
            <ArrowUturnLeftIcon className="h-3 w-3" />
            Fill from yesterday
          </button>
          <div className="todo invisible" style={{ marginTop: -40 }}>
            <input
              type="checkbox"
              className="h-4 w-4 text-black border-gray-300 rounded cursor-pointer"
            />
            <input type="text" value="" />
          </div>
        </>
      )}
    </div>
  );
};

type AddItemProps = {
  addItemText?: string;
  onClick?: () => void;
};

const AddItem: React.FC<AddItemProps> = ({
  addItemText = "New Item",
  onClick,
}) => {
  return (
    <div
      className="flex items-center gap-1 text-gray-400 rounded hover:bg-gray-200 cursor-pointer px-1 select-none"
      onClick={onClick}
    >
      <PlusCircleIcon className="h-3 w-3" />
      <span style={{ fontSize: 10, fontWeight: "bold" }}>{addItemText}</span>
    </div>
  );
};

export default Checklist;
