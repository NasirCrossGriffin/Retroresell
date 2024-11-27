import "./Signup.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { findUser, findUserByName, findGame, findGameImage, postUser, authenticate, uploadProfileImage, changeProfileImage } from "./middleware";

function Signup({ setUserIDProp, setLogged_InProp }) {
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState("");
    const [username, setUsername] = useState("");
    const [usernameValid, setUsernameValid] = useState("");
    const [password, setPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState("");
    const [file, setFile] = useState("");
    const [fileValid, setFileValid] = useState("");

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior

        if (emailValid && usernameValid && passwordValid && fileValid) {    
            const newUser = await postUser(username, email, password, await uploadProfileImage(file))

            if (newUser) {
                console.log('User created:', newUser);
                setUserIDProp(newUser._id);
                setLogged_InProp(true);
                navigate("/Home");
            } else {
                throw new Error('Failed to create user');
            }
        }
    };

    const validateEmail = (e) => {
        if ((e.target.value).includes("@") && (e.target.value).includes(".")) {
            return true;
        }
        
        return false;
    }

    const emailHandler = (e) => {
        setEmailValid(validateEmail(e))
        setEmail(e.target.value)
    }

    const validateUsername = async (e) => {
        const user = await findUserByName(e.target.value)
        if (user || e.target.value === null || e.target.value.length < 1)  {
            return false;
        }

        return true;
    }

    const usernameHandler = (e) => {
        setUsernameValid(validateUsername(e))
        setUsername(e.target.value)
    }

    const validatePassword = (e) => {
        if ((e.target.value).length >= 6) {
            return true;
        }

        return false;
    }

    const passwordHandler = (e) => {
        setPasswordValid(validatePassword(e))
        setPassword(e.target.value)
    }

    const validateFile = (e) => {
        if ((e.target.files).length > 0) {
            return true;
        }

        return false;
    }

    const fileHandler = (e) => {
        setFileValid(validateFile(e))
        setFile(e.target.files[0])
    }

    

    return (
        <>
        <div className="Signup">
            <div className="SignupCont">
                <h1>Signup</h1>
                <form onSubmit={submitHandler}>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" value={email} onChange={(e) => emailHandler(e)}/>
                    <p style={{ display: !(emailValid) ? 'block' : 'none' }} className="validator">Please enter a valid email</p>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" value={username} onChange={(e) => usernameHandler(e)}/>
                    <p style={{ display: !(usernameValid) ? 'block' : 'none' }} className="validator">Please enter a valid username</p>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" value={password} onChange={(e) => passwordHandler(e)}/>
                    <p style={{ display: !(passwordValid) ? 'block' : 'none' }} className="validator">Please enter a valid password</p>
                    <input type="file" accept="image/*" className="setImage" onChange={(e) => fileHandler(e)} />
                    <p style={{ display: !(fileValid) ? 'block' : 'none' }} className="validator">Please input a profile picture</p>
                    <input type="submit" name="submit" id="submit" />
                </form>
            </div>
        </div>
        <Link to="/Login" className="LoginPrompt">Already have an account? Log in.</Link>
        </>
    );
}

export default Signup;
