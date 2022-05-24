import React, { createContext, useContext, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ConflictError } from "src/errors/ConflictError";

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
  register: (email: string, password: string, phoneNumber: string, fullName: string) => Promise<void>;
}



export const getRefreshToken = async (): Promise<boolean> => {
  const res = await axios.post('http://localhost:3000/refresh', {
    headers: {
        'authorization' : sessionStorage.getItem('refresh_token')
    },
  })
  
  if (res.status == 200) {
    sessionStorage.setItem('user_token', res.data.token);
    return true;
  } else { 
    return false;
  }
};

export const AuthContext = createContext<AuthContextInterface>(null!);

const sessionStorageUser = sessionStorage.getItem('user_token');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedInUser, setLoggedInUser] = useState<any>(sessionStorageUser);

  const signin = async (email: string, password: string): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.post("http://localhost:3000/login", {
        email,
        password
      });

      setLoggedInUser({ email, token: res.data.token });
      sessionStorage.setItem('user_token', res.data.token);
      sessionStorage.setItem('user_email', email);
      sessionStorage.setItem('refresh_token', res.data.refreshToken);

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

  const register = async (email: string, password: string, phoneNumber: string, fullName: string): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.post("http://localhost:3000/register", {
        email,
        password,
        phoneNumber,
        fullName
      });

      setLoggedInUser(res.data.token);
      sessionStorage.setItem('user_token', res.data.token);
      sessionStorage.setItem('user_email', email);
      sessionStorage.setItem('refresh_token', res.data.refreshToken);


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
