import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import React from 'react';
import LogInScreen from './screens/login/LoginScreen';
import HomeScreen from './screens/home/Home';
import AppBar from './AppBar/AppBar';
import Register from './screens/register/RegisterScreen';
import CreateGroup from "./screens/createGroup/CreateGroup";
import RequireAuth from "../auth/RequireAuth";

const App: React.FC = (props): JSX.Element => {
  return (
    <Router>
      <AppBar />
      <Routes >
        <Route path='/' element={<HomeScreen />} />
        <Route path='login-screen' element={<LogInScreen />} />
        <Route path='register-screen' element={<Register />} />
          <Route path='create-group-screen' element={
              <RequireAuth>
                  <CreateGroup />
              </RequireAuth>} />
      </Routes>
    </Router>
  )
}

export default App;


