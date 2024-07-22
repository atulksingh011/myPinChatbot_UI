import { createContext, useEffect, useState } from "react";
import { login } from "../apis";

export const AuthContext = createContext<{
  user: any;
  loading: boolean;
  authenticated: boolean;
}>({
  user: null,
  loading: false,
  authenticated: false,
});

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);


  useEffect(() => {
    const performLogin = async () => {
      const response = await login();
      setUser(response.data);
      setLoading(false);
      if (response) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    };

    performLogin();
  }, []);

  

  return (
    <AuthContext.Provider value={{ user, loading, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
