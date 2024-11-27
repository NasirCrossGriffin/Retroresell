import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import "./EditGame.css"
import { useNavigate } from "react-router-dom";
import { patchGame, uploadGameImage, postGameImage, findGame, findGameImagesByGame } from "./middleware";

function EditGame({ gameId, editGameVisibilityProp, setEditGameVisibilityProp }) {
    const [game, setGame] = useState("");
    const [seller, setSeller] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const inputNameRef = useRef(null);
    const inputDescriptionRef = useRef(null);
    const inputPriceRef = useRef(null); // Reference for the textare
    const inputFileRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getGameToEdit = async () => {
            try {
                if (gameId) {
                    const gameToPatch = await findGame(gameId);
                    if (gameToPatch) {
                        setName(gameToPatch.name);
                        console.log(gameToPatch.name)
                        setDescription(gameToPatch.description);
                        console.log(gameToPatch.description)
                        setPrice(gameToPatch.price);
                        console.log(gameToPatch.price)
                        setSeller(gameToPatch.seller)
                        console.log(gameToPatch.seller)
                        setGame(gameToPatch);
                    } else {
                        console.error("The game was not found")
                    } 
                };
            } catch (error) {
                console.error("The was an error: " + error)
            }
        }; getGameToEdit();
    }, [gameId]);

    useEffect(() => {
        const getImages = async () => {
            try {
                const acquiredImages = await findGameImagesByGame(game._id) 
                if (acquiredImages) {
                    setImages(acquiredImages)
                    const newPreviewsMap = acquiredImages.map((image, index) => (`http://localhost:3001${image.image}`))
                    const newPreviewsArray = Array.from(newPreviewsMap.values())
                    setImagePreviews(newPreviewsArray)
                    console.log(newPreviewsArray)
                }
            } catch (error) {
                console.error(error)
            }
        }; getImages();  

    }, [game]) 

    const editGame = async (e) => {
        e.preventDefault(); // Prevent form submission reload
        const date = new Date();
        console.log(seller);

        const patchedGame = await patchGame(name, description, price, date, seller, gameId);
        if (patchedGame) {
            for (const image of images) {
                console.log(image);
                const uploadedImage = await uploadGameImage(image);
                console.log(patchedGame._id);
                const response = await postGameImage(uploadedImage, patchedGame._id);
                if (!response.ok) {
                    console.error("Failed to upload game image.");
                }
            }
            setEditGameVisibilityProp(false);
            navigate(`/GameView/${gameId}`, { replace: true });
            window.location.reload()
        } else {
            setIsVisible(true);
            console.error("Failed to patch game.");
        }
    };

    const hideModal = (e) => {
        if (e.target.classList.contains('NewGameBackground')) {
            setEditGameVisibilityProp(false);
        }
    };

    function autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto'; // Reset height to auto to recalculate
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }

    // Conditionally render the modal
    if (!editGameVisibilityProp) {
        return null; // Return nothing if the modal should not be visible
    }

    return ReactDOM.createPortal(
        <div className="NewGame">
            <div className="NewGameBackground" onClick={hideModal}>
                <div className="NewGameModal">
                    <div className="NewGameContainer">
                        <form className="gameForm" onSubmit={editGame}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="description">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onInput={autoResizeTextarea}
                            />
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className="addImage"
                                onChange={(e) => {
                                    const newFiles = e.target.files;
                                    if (newFiles && newFiles.length > 0) {
                                        setImages([...images, newFiles[0]]);
                                        setImagePreviews((prev) => [...prev, URL.createObjectURL(newFiles[0])])
                                    }
                                }}
                            />
                            <button type="submit">Edit Game</button>
                            {isVisible && <p style={{ color: "red" }}>Invalid Game</p>}
                            <div className="previews">
                                { images && images.length > 0 ? images.map((image, index) => (
                                    <img
                                        key={index}
                                        className="preview"
                                        src={imagePreviews[index]} // Create a local URL for the image file
                                        alt={`preview-${index}`}
                                    />
                                )) : <p>loading images</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>, document.getElementById('EditGame') // Ensure this element exists in the HTML
    );
}

export default EditGame;
