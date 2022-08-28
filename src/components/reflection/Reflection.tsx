import React, { useRef } from "react";
import { useApp } from "../../contexts/AppContext";
import { generateKey, toSnakeCase } from "../../util/helper";
import styled from "styled-components";
import ContextMenu from "../ContextMenu";

const Reflection: React.FC = () => {
  const { date, data, setData } = useApp();
  const curDay = generateKey(date);

  const text = data[curDay]?.["reflection"] || "";

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between"
        style={{ marginTop: -20, marginBottom: 4 }}
      >
        <b>Reflection</b>
      </div>
      <textarea
        className="focus:ring-0 focus:border-0 block text-xs border-gray-400 rounded h-full box-border"
        placeholder={`What was memorable?
      
What did I do well?

How could today be improved?

What should I focus on tomorrow?
      `}
        style={{ maxHeight: 200 }}
        onChange={(e) => {
          const newData = {
            ...data,
            [curDay]: { ...data[curDay], reflection: e.target.value },
          };
          setData(newData);
        }}
        value={text}
      >
      </textarea>
    </div>
  );
};

export default Reflection;
