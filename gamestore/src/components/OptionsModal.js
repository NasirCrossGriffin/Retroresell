import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router-dom';
import "./OptionsModal.css"

function OptionsModal ({ visibility, setOptionsVisibilityProp }) {
    const [isVisible, setIsVisible] = useState(false);

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

    if (!visibility) {
        return ReactDom.createPortal(<></>, document.getElementById('OptionsModal'));
    }
    
    return ReactDom.createPortal(
        <>
            <div className="background" onClick={hideDrawer}>
                <div className="modal">
                    <div className="container">
                        <Link to="/Home" className="OptionsLink">Home</Link>
                        <Link to="/Login" className="OptionsLink">Login</Link>
                    </div>
                </div>
            </div>
        </>, document.getElementById('OptionsModal')
    );


}

export default OptionsModal;