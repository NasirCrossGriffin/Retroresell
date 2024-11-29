import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { findUser, findGame, findGameImage, postUser, authenticate, setProfileImage } from "./middleware";


function Navbar({ logged_inProp, id, OptionsVisibilityProp, setOptionsVisibilityProp }) {
    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState('');
    const [logged_in, setLogged_in] = useState( logged_inProp );
    const [optionsVisibility, setOptionsVisibility] = useState(OptionsVisibilityProp);
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_API_URL || "";


    const navigateToProfile = async () => {
        if (logged_in) {
          navigate(`/Profile/${user._id}`, { replace: true });  
        }
    }

    const showOptionsMenu = () => {
        console.log("Trigger was clicked")
        if (optionsVisibility === false)
        {
            setOptionsVisibilityProp(true)
        }
        else 
        {
            setOptionsVisibilityProp(false)
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                const fetchedUser = await findUser(id);
                setUser(fetchedUser);
                if (fetchedUser) {
                    setProfilePic(fetchedUser.image);
                }
            }
        };

        fetchUser();
    }, [id]);

    useEffect(() => { 
        setLogged_in(logged_inProp)
    }, [logged_inProp])

    useEffect(() => { 
        setOptionsVisibility(OptionsVisibilityProp)
    }, [OptionsVisibilityProp])

    
    if (!logged_inProp) {
        return (
        <>
        <div className="Navbar">
            <div className="NavbarContainer">
                <button className="navmodaltrigger" onClick={showOptionsMenu}>
                <span />
                <span />
                <span />
                </button>

                <h1>Retroresell</h1>

                <div className="profilePic" onClick={navigateToProfile}>
                    {profilePic ? (
                        <img src={`${profilePic}`} alt="" />
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
        </div>
        </>
        )
    }


    return (
        <>
            <div className="Navbar">
                <div className="NavbarContainer">
                    <button className="navmodaltrigger" onClick={showOptionsMenu}>
                    <span />
                    <span />
                    <span />
                    </button>

                    <h1>Retroresell</h1>

                    <div className="profilePic" onClick={navigateToProfile}>
                        {profilePic ? (
                            <img src={`${BASE_URL}${profilePic}`} alt="profile picture" />
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
