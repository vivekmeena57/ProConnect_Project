import { createContext } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
  const serverUrl = "https://proconnect-backend-thkn.onrender.com";
  let value = {
    serverUrl,
  };
  return (
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
  );
}

export default AuthContext;
