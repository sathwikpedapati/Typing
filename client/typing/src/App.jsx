import React from 'react'
import "./App.css";
import {BrowserRouter as Router,Routes,Route, Navigate} from "react-router-dom";
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import DashBoard from './Pages/DashBoard';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const {isAuthenticated}=useAuth();
  return (
  <>
  <Router>
    <Routes>
      <Route path='/' element={!isAuthenticated? <Signup/>:<Navigate to="/dashboard"/>}/>
      <Route path='/login' element={!isAuthenticated? <Login/>:<Navigate to="/dashboard"/>}/>
      <Route path='/dashboard' element={ isAuthenticated ? <DashBoard/> : <Navigate to="/login" /> }/>
    </Routes>
  </Router>
  </>
  )
}

export default App
