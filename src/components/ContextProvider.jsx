import React, { createContext, useContext, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [calendarId, setCalendarId] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  

  return (
    <Context.Provider value={{ calendarId, setCalendarId, calendarData, setCalendarData }}>
      {children}
    </Context.Provider>
  );
};

export const useContextProvider = () => useContext(Context);