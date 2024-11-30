import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import OptionsModal from './components/OptionsModal';
import MyGamesPage from './components/MyGamesPage';
import GamePage from './components/GamePage';
import Conversation from './components/Conversation';
import Chat from './components/Chat';
import { checkSession } from './components/middleware'; // Import your middleware

function App() {
    const [userID, setUserID] = useState(null); // Tracks the logged-in user's ID
    const [loggedIn, setLoggedIn] = useState(false); // Tracks if the user is logged in
    const [optionsVisibility, setOptionsVisibility] = useState(false);
    const [loading, setLoading] = useState(true); // Tracks if session check is ongoing

    useEffect(() => {
      const verifySession = async () => {
          try {
              const sessionData = await checkSession(); // Check session via backend
              if (sessionData) {
                  setLoggedIn(true);
                  setUserID(sessionData.userID); // Extract and store the userID
              } else {
                  setLoggedIn(false);
              }
          } catch (error) {
              console.error('Error verifying session:', error);
              setLoggedIn(false);
          }
          setLoading(false); // Mark session check as complete
      };
      console.log(process.env.NODE_ENV === "development")
      verifySession();
  }, []);

    if (loading) {
        // Show a loading indicator while verifying the session
        return <div>Loading...</div>;
    }

    return (
        <>
            <BrowserRouter basename="/retroresell">
                <Navbar
                    logged_inProp={loggedIn}
                    id={userID}
                    OptionsVisibilityProp={optionsVisibility}
                    setOptionsVisibilityProp={setOptionsVisibility}
                />
                <OptionsModal
                    visibility={optionsVisibility}
                    setOptionsVisibilityProp={setOptionsVisibility}
                    logged_inProp={loggedIn}
                    setLogged_InProp={setLoggedIn}
                />
                <Routes>
                    {loggedIn ? (
                        <>
                            <Route path="/" element={<Navigate to="/Home" />} />
                            <Route path="/Profile/:profileid" element={<Profile id={userID} />} />
                            <Route path="/MyGames" element={<MyGamesPage id={userID} />} />
                            <Route path="/GameView/:id" element={<GamePage userId={userID}/>} />
                            <Route path="/Conversation/:recipientid" element={<Conversation id={userID} />} />
                            <Route path="/Chat" element={<Chat id={userID} />} />
                            <Route path="/Home" element={<LandingPage />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Navigate to="/Login" />} />
                            <Route path="/Login" element={<Login setUserIDProp={setUserID} setLogged_InProp={setLoggedIn} />}/>
                            <Route path="/Signup" element={<Signup setUserIDProp={setUserID} setLogged_InProp={setLoggedIn} />}
                            />
                        </>
                    )}
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
