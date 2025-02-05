import React from 'react';
import './Header.css';
import Typewriter from "typewriter-effect"
import glassImg from "../assets/magnifying-glass.png";

const Header = () => {
    return (
        <header>
            <h1 id="title">Welcome to <span>Deduction</span></h1>
            <img src={glassImg} alt="magnifying glass" className="magnifying-img"/>
        </header>
    );
};

export default Header;