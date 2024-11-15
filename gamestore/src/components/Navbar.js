import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar({ logged_inProp, id, OptionsVisibilityProp, setOptionsVisibilityProp }) {
    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState('');
    const [logged_in, setLogged_in] = useState( logged_inProp );
    const [optionsVisibility, setOptionsVisibility] = useState(OptionsVisibilityProp);
    const navigate = useNavigate();

    const findUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('No user found');
            }

            const userData = await response.json();
            return userData;
        } catch (err) {
            console.error('Error:', err.message);
            return null;
        }
    };

    const navigateToProfile = async () => {
        if (logged_in) {
          navigate("/Profile");  
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
        return <></>;
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
                            <img src={`http://localhost:3001${profilePic}`} alt="profile picture" />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
