import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import AppBar from './AppBar/AppBar';
import RequireAuth from "../auth/RequireAuth";

import HomeScreen from './screens/home/Home';
import LogInScreen from './screens/login/LoginScreen';
import Register from './screens/register/RegisterScreen';
import CreateGroupContainer from "./screens/createGroup/CreateGroupContainer";
import GroupView from './screens/groupView/GroupView';
import './App.css';

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
                <CreateGroupContainer />
            </RequireAuth>} 
        />
        <Route path='group-page/:id' element={
            <RequireAuth>
                <GroupView />
            </RequireAuth> 
        }/>
      </Routes>
    </Router>
  )
}

export default App;


