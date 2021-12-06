import React from "react";

type TChecklistItem = {
  value: string;
  checked: boolean;
};

type TChecklistProps = {
  name: string;
  items: TChecklistItem[];
};

const Checklist: React.FC<TChecklistProps> = ({ name, items }) => {
  return (
    <div>
      <b className="absolute -mt-6">{name}</b>
      {items.map((item) => (
        <div key={item.value} className="todo">
          <input
            type="checkbox"
            className="h-4 w-4 text-black border-gray-300 rounded"
          />
          <input type="text" value={item.value} />
        </div>
      ))}
    </div>
  );
};

export default Checklist;
