import React, {createContext, useContext, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {ConflictError} from "src/errors/ConflictError";

export type LocationState = {
  from: {
    pathname: string;
  };
};

interface LoggedInUser {
  email: string;
  token: string;
}

interface AuthContextInterface {
  loggedInUser: LoggedInUser;
  signin: (email: string, password: string) => Promise<any>;
  signout: () => void;
  register: (email: string, password: string) => Promise<void>;
}


export const AuthContext = createContext<AuthContextInterface>(null!);

const sessionStorageUser = sessionStorage.getItem('user_token');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedInUser, setLoggedInUser] = useState<any>(sessionStorageUser);

  const signin = async (email: string, password: string): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      setLoggedInUser({email, token: res.data.token});
      sessionStorage.setItem('user_token', res.data.token);
      sessionStorage.setItem('user_email', email);

      console.log("Succesfully logged in");
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("failed to log in", error.message);

        if ((error.toJSON() as any).status === 400) throw error;
      } else {
        console.log("failed to log in");
      }
    }
  }

  const signout = async () => {
    sessionStorage.removeItem('user_token')
    setLoggedInUser(null);
    return;
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.post("http://localhost:3000/register", {
        email,
        password
      });

      setLoggedInUser(res.data.token);
      sessionStorage.setItem('user_token', res.data.token);
      sessionStorage.setItem('user_email', email);

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

  const value = { loggedInUser, signin, signout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
