import "./Signup.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup({ setUserIDProp, setLogged_InProp }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState("");

    const navigate = useNavigate();

    const setImage = async (event) => {
        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const response = await fetch("http://localhost:3001/users/uploadProfilePic", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("File uploaded successfully:", result.filePath);
                return result.filePath; // Return the file path directly
            } else {
                throw new Error("File upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error.message);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior

        try {
            const userData = {
                name: username,
                email: email,
                password: password,
                image: await setImage(e)
            };

            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                /*body: JSON.stringify({
                    "name" : userData.name,
                    "email" : userData.email,
                    "password" : userData.password,
                    "image" : userData.image
                })*/
                body: JSON.stringify(userData) 
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            const data = await response.json();
            console.log('User created:', data);
            setUserIDProp(data._id);
            setLogged_InProp(true);
            navigate("/Home");

        } catch (err) {
            console.error('Error:', err.message);
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
