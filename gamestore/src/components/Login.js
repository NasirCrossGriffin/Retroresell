import "./Login.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUserIDProp, setLogged_InProp }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior

        try {
            console.log(username);
            console.log(password);

            const response = await fetch(`http://localhost:3001/users/authenticate/${username}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "password" : password,
            })
          });
          

            if (!response.ok) {
                setIsVisible(true)
                throw new Error('Cannot find user'); 
            }

            const user = await response.json();
            console.log('User found:', user);
            console.log(user._id);
            setUserIDProp(user._id);
            setLogged_InProp(true);
            navigate("/Home");
        } catch (err) {
            console.error('Error:', err.message);
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
