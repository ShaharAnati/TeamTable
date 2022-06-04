import React, { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ConflictError } from "src/errors/ConflictError";

export type LocationState = {
  from: {
    pathname: string;
  };
};

export enum TokenState {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  NON_EXISTENT = 'NON'
};

interface LoggedInUser {
  email?: string;
  token: string;
}

interface AuthContextInterface {
  loggedInUser: LoggedInUser;
  likedRestaurants: string[];
  signin: (email: string, password: string) => Promise<any>;
  signout: () => void;
  register: (email: string, password: string, phoneNumber: string, fullName: string) => Promise<void>;
  isTokenValid: () => TokenState;
  refreshToken: () => Promise<void>;
  removeRestaurantFromLiked: (restaurantId: string) => void;
  addRestaurantToLiked: (restaurantId: string) => void
}

export const AuthContext = createContext<AuthContextInterface>(null!);

const sessionStorageUser = {
  token: sessionStorage.getItem('user_token')
}

export const isUserLoggedIn = (): boolean =>
  !!sessionStorage.getItem('user_token')

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser>(sessionStorageUser);
  const [likedRestaurants, setLikedRestaurants] = useState<string[]>([]);

  useEffect(() => {
    const likedRests = sessionStorage.getItem('liked_restaurants')
      ? JSON.parse(sessionStorage.getItem('liked_restaurants'))
      : [];

    setLikedRestaurants(likedRests);
  }, [loggedInUser]);

  const signin = async (email: string, password: string): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.post("/login", {
        email,
        password
      });

      setLoggedInUser({ email, token: res.data.token });
      setLikedRestaurants(res.data.user.likedRestaurants)

      sessionStorage.setItem('user_token', res.data.token);
      sessionStorage.setItem('token_expiry_time', Date.now() + res.data.expiresIn);
      sessionStorage.setItem('user_email', email);
      sessionStorage.setItem('refresh_token', res.data.refreshToken);
      sessionStorage.setItem("liked_restaurants", JSON.stringify(res.data.user.likedRestaurants));

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
    sessionStorage.removeItem('user_token');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('token_expiry_time');
    sessionStorage.removeItem("liked_restaurants");

    setLoggedInUser(null);
    return;
  };

  const register = async (email: string, password: string, phoneNumber: string, fullName: string): Promise<void> => {
    try {
      const res: AxiosResponse<any> = await axios.post("/register", {
        email,
        password,
        phoneNumber,
        fullName
      });

      setLoggedInUser({ email, token: res.data.token });
      sessionStorage.setItem('user_token', res.data.token);
      sessionStorage.setItem('user_email', email);
      sessionStorage.setItem('token_expiry_time', Date.now() + res.data.expiresIn);
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

  const refreshToken = async (): Promise<void> => {
    try {
      // const res = await fetch
      const res = await axios.post('/refresh', {}, {
        headers: {
          'authorization': sessionStorage.getItem('refresh_token')
        },
      })

      if (res.status === 200) {
        sessionStorage.setItem('user_token', res.data.token);
        sessionStorage.setItem('token_expiry_time', Date.now() + res.data.expiresIn);
        sessionStorage.setItem('user_email', res.data.user?.email);
        sessionStorage.setItem('refresh_token', res.data.refreshToken);
        setLoggedInUser({ email: res.data.user?.email, token: res.data.token })
      }

    } catch (error) { }
  };

  const removeRestaurantFromLiked = (restaurantId: string) => {
    const newLiked = likedRestaurants.filter(currId => currId !== restaurantId);

    setLikedRestaurants(newLiked);
    sessionStorage.setItem("liked_restaurants", JSON.stringify(newLiked));
  }

  const addRestaurantToLiked = (restaurantId: string) => {
    const newLiked = [...likedRestaurants, restaurantId];

    setLikedRestaurants([...new Set(newLiked)]);
    sessionStorage.setItem("liked_restaurants", JSON.stringify(newLiked));

  }

  const isTokenValid = (): TokenState => {
    return (
      Date.now() < +sessionStorage.getItem('token_expiry_time')
        ? TokenState.VALID
        : !!sessionStorage.getItem('token_expiry_time')
          ? TokenState.EXPIRED
          : TokenState.NON_EXISTENT
    )
  }

  const value = {
    loggedInUser, likedRestaurants, signin, signout, register, isTokenValid, refreshToken, removeRestaurantFromLiked, addRestaurantToLiked
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
