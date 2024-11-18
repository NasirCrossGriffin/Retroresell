import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Logout } from "./middleware";

import "./OptionsModal.css"

function OptionsModal ({ visibility, setOptionsVisibilityProp, logged_inProp, setLogged_InProp }) {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        setIsVisible(visibility)
    }, [visibility]) 

    const hideDrawer = (e) => { 
        if (isVisible === true) {
            if (e.target.classList.contains('background')) {
                setOptionsVisibilityProp(false);
            }
        }
    }

    const logout = async () => {
        const response = await Logout()
        if (response.ok) {
            setLogged_InProp(false)
            navigate("/Login");  
        }
    }

    if (!visibility) {
        return ReactDom.createPortal(<></>, document.getElementById('OptionsModal'));
    }
    
    return ReactDom.createPortal(
        <>
            <div className="background" onClick={hideDrawer}>
                <div className="modal">
                    <div className="container">
                        <Link to="/Home" className="OptionsLink">Home</Link>
                        {logged_inProp ? <button className="LogOut" onClick={logout}>Log Out</button> : <Link to="/Login" className="OptionsLink">Login</Link>}
                        <Link to="/MyGames" className="OptionsLink">My Games</Link>

                    </div>
                </div>
            </div>
        </>, document.getElementById('OptionsModal')
    );


}

export default OptionsModal;