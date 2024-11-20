import React, { useState, useEffect } from "react";
import { findGame, findGameImagesByGame } from "./middleware";
import { useParams } from 'react-router-dom';
import "./GamePage.css"

function GamePage() {
    const [game, setGame] = useState([]);
    const [gameImages, setGameImages] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        let isMounted = true; // Flag to track if the component is mounted

        const loadGame = async () => {
            try {
                const gameData = await findGame(id);
                if (isMounted && gameData) {
                    setGame(gameData);
                    const TheGameImages = await findGameImagesByGame(id)
                    if (TheGameImages) {
                        setGameImages(TheGameImages)
                        console.log(gameImages)
                    }    
                }
            } catch (error) {
                console.error("Failed to fetch game:", error);
            }
        };

        loadGame();

        // Cleanup function to set the flag to false when the component unmounts
        return () => {
            isMounted = false;
        };
    }, []);
    
    return (
        <>
            <div className="GamePage">
                {
                    game ? <div className="View">
                                <p>{game.name}</p>
                                <p>{game.date}</p>
                                <p>${game.price}</p>
                                <div className="GameImages">
                                    <div className="GameGrid">
                                        {gameImages.map((image, index) => (
                                            <img key={index} src={`http://localhost:3001${image.image || "/placeholder.png"}`}/>
                                        ))}
                                    </div>
                                </div>
                                <p>{game.description}</p>
                            </div> 
                        :
                        <div>
                                <p>loading...</p>
                        </div>
                }
            </div> 
        </>
    );
}

export default GamePage;
