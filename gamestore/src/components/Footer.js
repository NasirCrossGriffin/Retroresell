import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import './Footer.css'

function Footer() {
    return (
        <footer className='Footer'>
            <div className='FooterHeading'>
                <span>Retroresell | Developed By Nasir Griffin</span>
            </div>

            <div className='ApexContact'>
                <div className='Contact'>
                <p className='ContactField'>Based In</p>
                <p className='ContactValue'>New York, NY</p>
                </div>

                <div className='Contact'>
                <p className='ContactField'>Email Me</p>
                <p className='ContactValue'>nasircrossgriffin@gmail.com</p>
                </div>

                <div className='Contact'>
                <p className='ContactField'>Call Me</p>
                <p className='ContactValue'>+1 (609) 805-9113</p>
                </div>
            </div>

            <div className='FooterLogo'>
                <img src='/Retroresell_Text_Logo.png'/>
            </div>

            <nav className='SocialsNav'>
                <a href='https://www.nasirgriffin.com/' target="_blank"><img src='/static/Nasir_Griffin.png' alt="Nasir Griffin Portfolio"/></a>
            </nav>

            <nav className='LegalNav'>
                <a href='/storefront/home'>Home</a>
                <a href='/storefront/privacy-policy'>Privacy Policy</a>
                <a href='/storefront/terms-of-use'>Terms Of Use</a>
                <a href='/storefront/website-disclaimer'>Web Development Disclaimer</a>
                <a href='/storefront/accessibility'>Accessibility</a>
                <a href='/storefront/contact-footer'>Contact</a>
            </nav>
        </footer>
    )
}

export default Footer;