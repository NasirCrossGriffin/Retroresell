import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Logout, checkSession, findUser } from "./middleware";
import { CSSTransition } from 'react-transition-group';


import "./OptionsModal.css"

function OptionsModal ({ visibility, setOptionsVisibilityProp, logged_inProp, setLogged_InProp, setUserIDProp }) {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const nodeRef = useRef(null);
    const [sessionUser, setSessionUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        async function checkLoggedIn() {
            const session = await checkSession();

            if (!session) {
                setLoggedIn(false)
                return;
            }

            setLoggedIn(session.loggedIn);

            if (session.loggedIn && session.userID) {
                const retrievedUser = await findUser(session.userID);
                console.log(retrievedUser)
                setSessionUser(retrievedUser);
            }
        }

        checkLoggedIn();
    }, []);

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
            setUserIDProp(null);
            setLogged_InProp(false);
            navigate("/Login");  
            window.location.reload();
        }
    }

    if (!visibility) {
        return ReactDom.createPortal(<></>, document.getElementById('OptionsModal'));
    }
    
    return ReactDom.createPortal(
        <>
            <div className="background" onClick={hideDrawer}>
                <CSSTransition in={isVisible} nodeRef={nodeRef} timeout={300} classNames="modal" unmountOnExit>
                    <div className="modal" ref={nodeRef} variant="primary" dismissible onClose={() => setIsVisible(false)}>
                        <div className="container">
                            <Link to="/Home" className="OptionsLink">Home</Link> 
                            {loggedIn ? <button className="LogOut" onClick={logout}>Log Out</button> : <Link to="/Login" className="OptionsLink">Login</Link>}
                            {loggedIn ? <Link to="/Chat" className="OptionsLink">Chat</Link> : <></>}
                            {loggedIn ? <Link to={`/MyGames/${sessionUser._id}`} className="OptionsLink">My Games</Link> : <></>}
                        </div>
                    </div>
                </CSSTransition>
            </div>
        </>, document.getElementById('OptionsModal')
    );

}

export default OptionsModal;