import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import React, {useState} from 'react'
import { BrowserRouter, Navigate, Routes, Route, redirect} from "react-router-dom";


function App() {

  const [userID, setUserID] = useState("");

  return (
    <> 
      <BrowserRouter basename="/retroresell" future={{ v7_startTransition: true }}> 
        <Routes>
          <Route path="/" element={<Navigate to="/Login"/>}/>
          <Route path="/Login" element={<Login setUserIDProp={setUserID}/>}/> 
          <Route path="/Signup" element={<Signup setUserIDProp={setUserID}/>}/>
          <Route path="/Profile" element={<Profile id={userID}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
