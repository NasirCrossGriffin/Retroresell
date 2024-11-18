import React, { useState, useEffect } from "react";
import "./LandingPage.css";

function LandingPage( ) {
    return (
        <form className="SearchBar">
            <label htmlFor="Search" className="SearchLabel">Search</label>
            <input type="text" className="Search" id="Search" />
            <input type="submit" className="SearchSubmit"/>
        </form>
    );
}

export default LandingPage;
