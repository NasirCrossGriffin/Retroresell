import "./Login.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { findUser, findGame, findGameImage, postUser, authenticate, setProfileImage } from "./middleware";

function Login({ setUserIDProp, setLogged_InProp }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior

        const user = await authenticate(username, password)
                
        if (user) {
            console.log('User found:', user);
            console.log(user._id);
            setUserIDProp(user._id);
            setLogged_InProp(true);
            navigate("/Home");
        }
        else
        {
            setIsVisible(true)
            throw new Error('Cannot find user'); 
        }
    };

  return (
    <>
    <div className="Login">
        <div className="LoginCont">
            <h1>Login</h1>
            <form onSubmit={submitHandler}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="username">Password</label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type="submit" name="submit" id="submit"/>
                <p style={{ display: isVisible ? 'block' : 'none' }}>Wrong username or password</p>
            </form>
        </div>
    </div>
    <Link to="/Signup" className="SignupPrompt">Need an account? Sign up now!</Link>
    </>
  );
}

export default Login;
