import React, { useState, useEffect } from "react";
import { findAllGames, findGameImagesByGame } from "./middleware"
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage( ) {
    const [search, setSearch] = useState([]);
    const [gameImage, setGameImage] = useState("");
    const [gamePreviews, setGamePreviews] = useState([]);
    const navigate = useNavigate();
    const BASE_URL = (process.env.NODE_ENV === "development" ? process.env.REACT_APP_REQ_URL : "")



    const getAllGames = async () => {
        const allGames = await findAllGames();
        return allGames
    }

    useEffect(() => {
        const loadAll = async () => {
            const games = await getAllGames();
            setSearch(games);
        };
        console.log("useEffect triggered");
        loadAll();
        console.log(search);
        console.log(BASE_URL)
    }, []); 

    const searchFunc = async (event) => {
        console.log("searchFunc triggered");
        const query = event.target.value.toLowerCase();
        if (query === "") {
            setSearch(await getAllGames());
        } else {
            const games = await getAllGames();
            if (games.length > 0) {
                const filteredGames = games.filter(game => game.name.toLowerCase().includes(query));
                setSearch(filteredGames);
            } else {
                setSearch([])
            }
        }
        console.log(search);
    }
    
    useEffect(() => {
        const fetchGamePreviews = async () => {
            const previews = await Promise.all(
                search.map(async (game) => {
                    const gameImages = await findGameImagesByGame(game._id);
                    return gameImages.length > 0 ? gameImages[0].image : null; // Handle no images case
                })
            );
            setGamePreviews(previews);
        };
    
        if (search.length > 0) {
            fetchGamePreviews();
        }
    }, [search]); // Depend on 'games'

    const accessGamePage = (event) => {
        const gameid = event.target.id;
        if (gameid)
        {
            navigate(`/GameView/${gameid}`);
        }
    }
    
    return (
        <>
        <div className="LandingPage">
            <form data-testid="search-bar" className="SearchBar">
                <label htmlFor="Search" className="SearchLabel">Search</label>
                <input type="text" className="Search" id="Search" onChange={(e) => {searchFunc(e)}}/>
            </form>

            <div className="gameView">
            {!(search.length === 0) ? search.map((game, index) => (
                <div data-testid="single-game" className="singleGame" id={game._id} onClick={(e) => (accessGamePage(e))}>
                    <div className="gamePreviewImage">
                        <img id={game._id} onClick={(e) => (accessGamePage(e))} src={`${gamePreviews[index] || "/placeholder.png"}`}/>
                    </div>
                    <p onClick={(e) => (accessGamePage(e))}>{game.name}</p>
                    <p onClick={(e) => (accessGamePage(e))}> {game.price > 0 ? game.price : "NOT FOR SALE"}</p>
                    <p onClick={(e) => (accessGamePage(e))}>uploaded on {new Date(game.date).toLocaleDateString()}</p>
                </div>
            )) : <p data-testid="no-games">There are no games for this search</p>}
            </div>
        </div>
        </>
    );
}

export default LandingPage;
