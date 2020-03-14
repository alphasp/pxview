import React, { createContext } from 'react';

export const LocalizationContext = createContext();

const LocalizationProvider = ({ children, i18n }) => {
  return (
    <LocalizationContext.Provider
      value={{
        i18n,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationProvider;
