import React, { useState, useEffect } from "react";
import "./MyGamesPage.css";
import { findUser, findGame, findGameImage, postUser, 
    authenticate, uploadProfileImage, changeProfileImage, findGamesByUser,
    findGameImagesByGame, uploadGameImage, postGame, postGameImage, checkSession } from "./middleware"
import NewGame from './NewGame';


function MyGamesPage( id ) {
    const [games, setGames] = useState([]);
    const [newGameVisibility, setNewGameVisibility] = useState(false)
    const [gameImage, setGameImage] = useState("");
    const [gamePreviews, setGamePreviews] = useState([]);

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

    const retrieveFirstImage = async (game) => {
        
    }


    if (!games) {
        return (<>
            <NewGame id={id} newGameVisibilityProp={newGameVisibility} setNewGameVisibilityProp={setNewGameVisibility}/>
            <button onClick={alterVisibility}>New Game</button>
        </>)
    }
    
    return (
        <> 
            <NewGame id={id} newGameVisibilityProp={newGameVisibility} setNewGameVisibilityProp={setNewGameVisibility}/>
            <button onClick={alterVisibility} className="NewGame">New Game</button>
            <div className="gameView">
                {games.map((game, index) => (
                    <div className="singleGame" id={game._id}>
                        <img src={`http://localhost:3001${gamePreviews[index] || "/placeholder.png"}`}/>
                        <p>{game.name}</p>
                        <p>{game.price}</p>
                        <p>uploaded on {game.date}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default MyGamesPage;
