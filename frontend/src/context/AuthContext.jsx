import { createContext } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
  const serverUrl = "https://proconnect-backend-thkn.onrender.com";
  let value = {
    serverUrl,
  };
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  );
}

export default AuthContext;
