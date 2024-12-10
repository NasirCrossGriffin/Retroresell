import React, { useState, useEffect } from "react";
import EditGame from "./EditGame"
import DeleteGame from "./DeleteGame"
import { findGame, findGameImagesByGame, findUser, uploadToAWS } from "./middleware";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./GamePage.css"


function GamePage({ userId }) {
    const [game, setGame] = useState([]);
    const [seller, setSeller] = useState("");
    const [gameImages, setGameImages] = useState([]);
    const [editGameVisibility, setEditGameVisibility] = useState(false);
    const [deleteGameVisibility, setDeleteGameVisibility] = useState(false);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    const { id } = useParams();
    const BASE_URL = (process.env.NODE_ENV === "development" ? process.env.REACT_APP_REQ_URL : "")


    useEffect(() => {
        console.log(userId)
    }, [])

    useEffect(() => {
        console.log(seller._id)
    }, [seller])

    useEffect(() => {
        let isMounted = true; // Flag to track if the component is mounted

        const loadGame = async () => {
            try {
                const gameData = await findGame(id);
                if (isMounted && gameData) {
                    setGame(gameData);
                    console.log(gameData.seller)
                    const user = await findUser(gameData.seller);
                    if (user) {
                        console.log(user)
                        setSeller(user);
                    }
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
    
    const scroll = (event) => {
        if (event.target.id === "Left") {
            if (!(index === 0)) {
                setIndex(index-1)
            }
            else {
                setIndex(gameImages.length - 1)
            }

        } else if (event.target.id === "Right") {
            if (!(index === gameImages.length - 1)) {
                setIndex(index+1)
            }
            else {
                setIndex(0)
            }

        }

    }

    const alterVisibility = (event) => {
        if (event.target.id === "EditGameBTN") {
            console.log("Button clicked: " + editGameVisibility)
            if (editGameVisibility === true) {
                setEditGameVisibility(false);
                console.log("if statement entered")

            } else {
                setEditGameVisibility(true);
                console.log("else statement entered")

            }
        }

        if (event.target.id === "RemoveGameBTN") {
            console.log("Button clicked: " + deleteGameVisibility)
            if (deleteGameVisibility === true) {
                setDeleteGameVisibility(false);
                console.log("if statement entered")

            } else {
                setDeleteGameVisibility(true);
                console.log("else statement entered")

            }
        }
    }

    return (
        <>
            <>
                {
                    <DeleteGame gameId={id} deleteGameVisibilityProp={deleteGameVisibility} setDeleteGameVisibilityProp={setDeleteGameVisibility}/>
                }
            </>
            <>
                {
                    <EditGame gameId={id} editGameVisibilityProp={editGameVisibility} setEditGameVisibilityProp={setEditGameVisibility}/>
                }
            </>
            <>
                {
                    userId === seller._id ? <div className="ButtonsDiv">
                                                        <button onClick={(e) => alterVisibility(e)} id="EditGameBTN" className="EditGameBTN">Edit Game</button>
                                                        <button onClick={(e) => alterVisibility(e)} id="RemoveGameBTN" className="RemoveGameBTN">Remove Game</button>
                                                   </div> : <></>
                }
            </>
            <div className="GamePage">
                {
                    game ? <div className="View">
                                <p>{game.name}</p>
                                <p>{new Date(game.date).toLocaleDateString()}</p>
                                <p>${game.price}</p>
                                <div className="Seller">
                                    <p>{seller.name}</p>
                                    <div className="SellerPicContainer">
                                        <img className="SellerPic" onClick={() => (navigate(`/Profile/${seller._id}`))} src={`${seller.image}`} alt="profile picture" />
                                    </div>
                                </div>
                                <div className="GameImages">
                                    {
                                        (gameImages && gameImages.length > 0) ?
                                        <div className="GameGrid">
                                            <img id="Left" className="Left" onClick={(e) => (scroll(e))} src={"/static/ArrowLeft.png"}/>
                                            <div className="ImageDiv">
                                                <img className="Image" src={`${gameImages[index].image || "/placeholder.png"}`}/>
                                            </div>
                                            <img id="Right" className="Right" onClick={(e) => (scroll(e))} src={"/static/ArrowRight.png"}/>
                                        </div> : <p>loading</p>
                                    }
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
