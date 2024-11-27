import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import "./DeleteGame.css"
import { useNavigate } from "react-router-dom";
import { patchGame, uploadGameImage, postGameImage, findGame, findGameImagesByGame, deleteGame, deleteGameImage } from "./middleware";

function DeleteGame({ gameId, deleteGameVisibilityProp, setDeleteGameVisibilityProp }) {
const [game, setGame] = useState(null)
const [gameImages, setGameImages] = useState([])
const navigate = useNavigate();

    //Get game when gameId is changed
    useEffect(() => {
        const fetchGame = async () => {
            const fetchedGame = await findGame(gameId)
            if (fetchedGame) {
                setGame(fetchedGame);
            }
        }; fetchGame();
    }, [gameId]);

    //Get game images when the game is received.
    useEffect(() => {
        const fetchGameImages = async () => {
            if (game) {
                const fetchedGameImages = await findGameImagesByGame(game._id);
                if (fetchedGameImages) {
                    setGameImages(fetchedGameImages);
                }
            }
        }; fetchGameImages();
    }, [game])

    //Delete the game and its images
    const deleteHandler = async () => {
        if (game) {
            for (const gameImage of gameImages)
                await deleteGameImage(gameImage._id)

            await deleteGame(game._id);
            setDeleteGameVisibilityProp(false);
            navigate("/MyGames");
        }
    }
    
    //Make the modal invisible
    const alterVisibility = () => {
        setDeleteGameVisibilityProp(false);
    }
    
    return ReactDOM.createPortal(
        deleteGameVisibilityProp ? <>
            <div className="DeleteGameBackground">
                <div className="DeleteGame">
                    <p>Are you sure you want to delete this game?</p>
                    <div className="DelBTNS">
                        <button onClick={deleteHandler}>Yes</button>
                        <button onClick={alterVisibility}>No</button>
                    </div>
                </div>
            </div>
        </> : <></>

       , document.getElementById('DeleteGame') 
    );
}

export default DeleteGame;
