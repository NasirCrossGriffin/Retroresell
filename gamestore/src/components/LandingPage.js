import React, { useState, useEffect } from "react";
import "./LandingPage.css";

function LandingPage( ) {
    return (
        <form className="SearchBar">
            <label htmlFor="Search">Search</label>
            <input type="text" name="Search" id="Search" />
            <input type="submit" className="submit"/>
        </form>
    );
}

export default LandingPage;
