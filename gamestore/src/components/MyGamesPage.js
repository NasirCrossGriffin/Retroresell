import React, { useState, useEffect } from "react";
import "./MyGamesPage.css";
import { findUser, findGame, findGameImage, postUser, 
    authenticate, uploadProfileImage, changeProfileImage, findGamesByUser,
    findGameImagesByGame, uploadGameImage, postGame, postGameImage, checkSession } from "./middleware"
import NewGame from './NewGame';
import { useNavigate} from "react-router-dom"


function MyGamesPage({ id, logged_in_prop }) {
    const [games, setGames] = useState([]);
    const [newGameVisibility, setNewGameVisibility] = useState(false)
    const [gameImage, setGameImage] = useState("");
    const [gamePreviews, setGamePreviews] = useState([]);
    const navigate = useNavigate();
    const BASE_URL = (process.env.NODE_ENV === "development" ? process.env.REACT_APP_REQ_URL : "")

    useEffect(() => {
        if (!logged_in_prop)
            navigate(`/Login`);
    }, [logged_in_prop]); 

    useEffect(() => {
        const fetchGames = async () => {
            const myGames = await findGamesByUser(id.id); 
            setGames(myGames);
        };
        fetchGames();
    }, [id]);

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

    const alterVisibility = () => {
        console.log("Button clicked: " + newGameVisibility)
        if (newGameVisibility === true) {
            setNewGameVisibility(false);
            console.log("if statement entered")

        } else {
            setNewGameVisibility(true);
            console.log("else statement entered")

        }
    }

    const accessGamePage = (event) => {
        const gameid = event.target.id;
        if (gameid)
        {
            navigate(`/GameView/${gameid}`);
        }
    }

    if (!games) {
        return (<>
            <NewGame id={id} newGameVisibilityProp={newGameVisibility} setNewGameVisibilityProp={setNewGameVisibility}/>
            <button onClick={alterVisibility}>New Game</button>
        </>)
    }
    
    return (
        <>  
            <div className="MyGames">
                <NewGame id={id} newGameVisibilityProp={newGameVisibility} setNewGameVisibilityProp={setNewGameVisibility}/>
                <button onClick={alterVisibility} className="NewGameBTN">New Game</button>
                <div className="gameView">
                    {games.map((game, index) => (
                        <div className="singleGame" id={game._id} onClick={(e) => (accessGamePage(e))}>
                            <div className="gamePreviewImage">
                                <img id={game._id} onClick={(e) => (accessGamePage(e))} src={`${gamePreviews[index] || "/placeholder.png"}`}/>
                            </div>
                            <p>{game.name}</p>
                            <p>${game.price}</p>
                            <p>uploaded on {new Date(game.date).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>   
        </>
    );
}

export default MyGamesPage;
