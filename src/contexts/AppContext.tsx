import React, { useState, useContext, createContext } from "react";

export type TAppContextValue = {
  date: Date;
  setDate: (curDay: Date) => void;
};

const useAppData = (): TAppContextValue => {
  const [date, setDate] = useState<Date>(new Date());

  return {
    date,
    setDate,
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