import { createContext, useState, useContext } from "react";

export const AlertContext = createContext();

export function AlertContextProvider({ children }) {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <AlertContext.Provider value={{ showAlert, setShowAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}
