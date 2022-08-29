import React, { useState, useContext, createContext, useEffect } from "react";
import { generateKey, getKey, isExtensionMode, setKey } from "../util/helper";
import { EventData, PersistedData } from "../util/types";

export type TAppContextValue = {
  date: Date;
  setDate: (curDay: Date) => void;
  data: PersistedData;
  setData: (data: PersistedData) => void;
};

const useAppData = (): TAppContextValue => {
  const [date, setDate] = useState<Date>(new Date());
  const [data, setData] = useState<PersistedData>({});

  // on initial load, get events from Chrome storage
  useEffect(() => {
    const key = generateKey(date);
    if (!(key in data)) {
      getKey(key, (val) => {
        if (val) {
          setData({ ...data, [key]: val });
        }
      });
    }
  }, [date, data]);

  // on change of events, persist to Chrome storage
  useEffect(() => {
    const key = generateKey(date);
    if (data[key]) {
      setKey(key, data[key]);
    }
  }, [data, date])

  // when date changes, update title
  useEffect(() => {
    if (isExtensionMode) {
      document.title = "New Tab";
    } else {
      // set title formatted with short month
      document.title = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } , [date]);

  return {
    date,
    setDate,
    data,
    setData,
  };
};

export const AppContext: React.Context<TAppContextValue> = createContext(
  undefined as unknown as TAppContextValue
);

export const AppContextProvider: React.FC = ({ children }) => {
  const appState: TAppContextValue = useAppData();

  return (
    <AppContext.Provider value={appState}>{children}</AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);