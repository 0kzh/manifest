import React, { useState } from "react";

export const isExtensionMode = typeof chrome != "undefined" && chrome?.storage;

export const range = (begin: number, end: number): Array<number> => {
  let len = end - begin + 1;
  let arr = new Array(len);
  for (var i = 0; i < len; i++) {
    arr[i] = begin + i;
  }
  return arr;
};

export const convert24HTo12H = (timeIn24H: number): string => {
  const isPM = timeIn24H >= 12 && timeIn24H < 24;
  let hour = timeIn24H % 12;
  if (hour === 0) {
    hour = 12;
  }

  return `${hour} ${isPM ? "PM" : "AM"}`;
};

export const dateToNumber = (date: Date): number => {
  const hour = date.getHours();
  const decimal = (date.getMinutes() * 60 + date.getSeconds()) / 3600;
  return hour + decimal;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleString("default", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const generateKey = (date: Date): string => {
  const serializedISODate =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return serializedISODate;
};

export const toSnakeCase = (str: string): string => {
  return str.toLowerCase().split(" ").join("_");
}

// custom hook for detecting key presses
export const useKeyPress = function (targetKey: string) {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  function downHandler({ key }: { key: string }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

export const getKey = (key: string, fn: (val: any) => void): any => {
  if (!isExtensionMode) {
    const res = JSON.parse(localStorage.getItem(key) || "[]");
    fn(res);
  } else {
    chrome.storage.sync.get([key], fn);
  }
};

export const setKey = (key: string, val: any): any => {
  if (!isExtensionMode) {
    localStorage.setItem(key, JSON.stringify(val));
  } else {
    chrome.storage.sync.set({ [key]: val });
  }
};
