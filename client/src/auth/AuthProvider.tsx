import React, { createContext, useContext, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ConflictError } from "src/errors/ConflictError";

export type LocationState = {
  from: {
    pathname: string;
  };
};

interface AuthContextInterface {
  user: any;
  signin: (email: string, password: string) => Promise<any>;
  signout: () => void;
  register: (email: string, password: string) => Promise<void>;
}


export const AuthContext = createContext<AuthContextInterface>(null!);

const sessionStorageUser = sessionStorage.getItem('user_token');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(sessionStorageUser);

  const signin = async (email: string, password: string): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      setUser(res.data.token);
      sessionStorage.setItem('user_token', res.data.token);

      console.log("Succesfully logged in");
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("failed to log in", error.message);
      } else {
        console.log("failed to log in");
      }
    };
  }

  const signout = async () => {
    sessionStorage.removeItem('user_token')
    setUser(null);
    return;
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.post("http://localhost:3000/register", {
        email,
        password
      });

      setUser(res.data.token);
      sessionStorage.setItem('user_token', res.data.token);

      console.log("Registration completed succesfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("failed to register", error.message);
        if (error.response.status === 409) {
          throw new ConflictError();
        }
      } else {
        console.log("failed to register");
      }

      throw error;
    }
  }

  const value = { user, signin, signout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);