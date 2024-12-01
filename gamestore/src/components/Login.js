import "./Login.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { findUser, findGame, findAllGames, findGameImage, postUser, authenticate, setProfileImage, findGameImagesByGame } from "./middleware";
import { CSSTransition } from 'react-transition-group';

function Login({ setUserIDProp, setLogged_InProp }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [games, setGames] = useState([]);
    const [gamePreviews, setGamePreviews] = useState([]);
    const [index, setIndex] = useState(0);
    const [appear, setAppear] = useState(true)
    const BASE_URL = (process.env.NODE_ENV === "development" ? process.env.REACT_APP_REQ_URL : "")
    const nodeRef = useRef(null);

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
        }
    };

    useEffect(() => {
        const fetchGames = async () => {
            const gamesList = await findAllGames();
            console.log(gamesList)
            if (gamesList) {
                setGames(gamesList || [])
            }
        }; fetchGames()
    }, [])

    useEffect(() => {
        const fetchGamePreviews = async () => {
            const previews = await Promise.all(
                games.map(async (game) => {
                    const gameImages = await findGameImagesByGame(game._id);
                    return gameImages.length > 0 ? gameImages[0].image : null; // Handle no images case
                })
            );
            setGamePreviews(previews);
        };
    
        if (games.length > 0) {
            fetchGamePreviews();
        }
    }, [games]); // Depend on 'games'

    useEffect(() => {
        if (appear === true) {
            const timeoutId = setTimeout(() => {
            setAppear(false)
            }, 5000);
        
            return () => clearTimeout(timeoutId); // Clear the timeout on unmount
        }

        if (appear === false) {
            const timeoutId = setTimeout(() => {
            setAppear(true)
            }, 1000);
        
            return () => clearTimeout(timeoutId); // Clear the timeout on unmount
        }
      }, [appear]);

    const incrementIndex = () => {
        if (index < gamePreviews.length - 1) {
            setIndex((prev) => prev + 1)
        } else {
            setIndex(0)
        }
    }

  return (
    <>
    <div className="WelcomeDiv"><p className="Welcome">Welcome to Retroresell</p></div>
    <div className="LoginPage">
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
        <div className="gamePreviews">
            <CSSTransition 
                in={appear}
                nodeRef={nodeRef}
                timeout={300}
                classNames="imagepreview"
                unmountOnExit
                onExited={() => incrementIndex()}
            >
                { games.length > 0 ? 
                <img 
                    className="imagepreview" 
                    ref={nodeRef}
                    variant="primary"
                    dismissible 
                    src={`${BASE_URL}${gamePreviews[index]}`} 
                /> : <p>loading</p>}
            </CSSTransition>
        </div>
    </div>
    <Link to="/Signup" className="SignupPrompt">Need an account? Sign up now!</Link>
    </>
  );
}

export default Login;