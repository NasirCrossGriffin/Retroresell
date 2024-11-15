import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import OptionsModal from './components/OptionsModal';
import React, {useState} from 'react'
import { BrowserRouter, Navigate, Routes, Route, redirect} from "react-router-dom";


function App() {

  const [userID, setUserID] = useState("");
  const [logged_in, setLogged_In] = useState(false);
  const [optionsVisibility, setOptionsVisibility] = useState(false);

  return (
    <> 
      <BrowserRouter basename="/retroresell" future={{ v7_startTransition: true }}>
        <Navbar logged_inProp={logged_in} id={userID} OptionsVisibilityProp={optionsVisibility} setOptionsVisibilityProp={setOptionsVisibility}/>
        <OptionsModal visibility={optionsVisibility} setOptionsVisibilityProp={setOptionsVisibility}/>
        <Routes>
          <Route path="/" element={<Navigate to="/Login"/>}/>
          <Route path="/Login" element={<Login setUserIDProp={setUserID} setLogged_InProp={setLogged_In}/>}/> 
          <Route path="/Signup" element={<Signup setUserIDProp={setUserID} setLogged_InProp={setLogged_In}/>}/>
          <Route path="/Profile" element={<Profile id={userID}/>}/>
          <Route path="/Home" element={<LandingPage />}/> 
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
