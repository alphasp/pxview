import React, { createContext } from 'react';
import { useSelector } from 'react-redux';

export const LocalizationContext = createContext();

const LocalizationProvider = ({ children, i18n }) => {
  const lang = useSelector((state) => state.i18n.lang);
  return (
    <LocalizationContext.Provider
      value={{
        i18n,
        lang,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationProvider;
