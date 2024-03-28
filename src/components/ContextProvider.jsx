import React, { createContext, useContext, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [calendarId, setCalendarId] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [calendarsList, setCalendarsList] = useState([]);
  const [sideMenuNeedRedraw, setSideMenuNeedRedraw] = useState(false);


  return (
      <Context.Provider value={
          { calendarId, setCalendarId, 
            calendarData, setCalendarData, 
            calendarsList, setCalendarsList, 
            sideMenuNeedRedraw, setSideMenuNeedRedraw 
          }
      }>
          {children}
      </Context.Provider>
  );
};

export const useContextProvider = () => useContext(Context);