import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./DeleteGame.css";
import { useNavigate } from "react-router-dom";
import {
    findGame,
    findGameImagesByGame,
    deleteGame,
    deleteGameImage,
} from "./middleware";
import { CSSTransition } from "react-transition-group";

function DeleteGame({ gameId, deleteGameVisibilityProp, setDeleteGameVisibilityProp }) {
    const [game, setGame] = useState(null);
    const [gameImages, setGameImages] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const nodeRef = useRef(null);

    // Get game when gameId changes
    useEffect(() => {
        const fetchGame = async () => {
            const fetchedGame = await findGame(gameId);
            if (fetchedGame) {
                setGame(fetchedGame);
            }
        };
        fetchGame();
    }, [gameId]);

    useEffect(() => {
        setIsVisible(deleteGameVisibilityProp);
    }, [deleteGameVisibilityProp]);

    // Get game images when the game is loaded
    useEffect(() => {
        const fetchGameImages = async () => {
            if (game) {
                const fetchedGameImages = await findGameImagesByGame(game._id);
                if (fetchedGameImages) {
                    setGameImages(fetchedGameImages);
                }
            }
        };
        fetchGameImages();
    }, [game]);

    // Delete the game and its images
    const deleteHandler = async () => {
        if (game) {
            for (const gameImage of gameImages) {
                await deleteGameImage(gameImage._id);
            }
            await deleteGame(game._id);
            setDeleteGameVisibilityProp(false);
            navigate("/MyGames");
        }
    };

    // Close the modal
    const alterVisibility = () => {
        setDeleteGameVisibilityProp(false);
    };

    const hideModal = (e) => { 
        if (isVisible === true) {
            if (e.target.classList.contains('DeleteGameBackground')) {
                setDeleteGameVisibilityProp(false);
            }
        }
    }

    // Return early if portal target is missing
    if (!document.getElementById("DeleteGame")) return null;

    if (!deleteGameVisibilityProp) {
        return null; // Return nothing if the modal should not be visible
    }

    return ReactDOM.createPortal(
        <>
            <div className="DeleteGameBackground" onClick={hideModal}></div>
            <CSSTransition
                in={isVisible}
                nodeRef={nodeRef}
                timeout={300}
                classNames="Del"
                unmountOnExit
            >
                <div className="DeleteGame" ref={nodeRef}>
                    <p>Are you sure you want to delete this game?</p>
                    <div className="DelBTNS">
                        <button onClick={deleteHandler}>Yes</button>
                        <button onClick={alterVisibility}>No</button>
                    </div>
                </div>
            </CSSTransition>
        </>,
        document.getElementById("DeleteGame")
    );
}

export default DeleteGame;
