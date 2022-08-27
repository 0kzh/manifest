import React, { useState, useContext, createContext, useEffect } from "react";
import { generateKey, getKey, setKey } from "../util/helper";
import { EventData, PersistedData } from "../util/types";

export type TAppContextValue = {
  date: Date;
  setDate: (curDay: Date) => void;
  data: PersistedData;
  setData: (data: PersistedData) => void;
  inputFocused: boolean;
};

const useAppData = (): TAppContextValue => {
  const [date, setDate] = useState<Date>(new Date());
  const [data, setData] = useState<PersistedData>({});
  const [inputFocused, setInputFocused] = useState<boolean>(false);

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
      setInputFocused(data[key].events?.some((e: EventData) => e.focused));
    }
  }, [data, date])

  return {
    date,
    setDate,
    data,
    setData,
    inputFocused,
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