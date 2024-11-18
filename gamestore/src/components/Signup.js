import "./Signup.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { findUser, findGame, findGameImage, postUser, authenticate, uploadProfileImage, changeProfileImage } from "./middleware";

function Signup({ setUserIDProp, setLogged_InProp }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState("");

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior

            const user = await postUser(username, email, password, uploadProfileImage(file))

            if (user) {
                console.log('User created:', user);
                setUserIDProp(user._id);
                setLogged_InProp(true);
                navigate("/Login");
            } else {
                throw new Error('Failed to create user');
            }
    };

    return (
        <>
        <div className="Signup">
            <div className="SignupCont">
                <h1>Signup</h1>
                <form onSubmit={submitHandler}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input type="file" accept="image/*" className="setImage" onChange={(e) => setFile(e.target.files[0])} />
                    <input type="submit" name="submit" id="submit" />
                </form>
            </div>
        </div>
        <Link to="/Login" className="LoginPrompt">Already have an account? Log in.</Link>
        </>
    );
}

export default Signup;
