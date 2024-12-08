import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./EditGame.css";
import "./DeleteGameImage"
import { useNavigate } from "react-router-dom";
import { patchGame, postGameImage, findGame, findGameImagesByGame, uploadToAWS } from "./middleware";
import { CSSTransition } from "react-transition-group";
import DeleteGameImage from "./DeleteGameImage";

function EditGame({ gameId, editGameVisibilityProp, setEditGameVisibilityProp }) {
    const [game, setGame] = useState("");
    const [seller, setSeller] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [existingImagePreviews, setExistingImagePreviews] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [visibility, setVisibility] = useState(false); // Local state for visibility
    const [deleteGameImageVisibility, setDeleteGameImageVisibility] = useState(false)
    const nodeRef = useRef(null); // Ref for CSSTransition
    const navigate = useNavigate();
    const BASE_URL = (process.env.NODE_ENV === "development" ? process.env.REACT_APP_REQ_URL : "")
    const [imageToDelete, setImageToDelete] = useState(null); // Track the image to delete

    // Fetch the game data when the component mounts
    useEffect(() => {
        const getGameToEdit = async () => {
            if (gameId) {
                try {
                    const gameToPatch = await findGame(gameId);
                    if (gameToPatch) {
                        setName(gameToPatch.name);
                        setDescription(gameToPatch.description);
                        setPrice(gameToPatch.price);
                        setSeller(gameToPatch.seller);
                        setGame(gameToPatch);
                    } else {
                        console.error("The game was not found");
                    }
                } catch (error) {
                    console.error("Error fetching game:", error);
                }
            }
        };
        getGameToEdit();
    }, [gameId]);

    // Fetch images when game data is loaded
    useEffect(() => {
        const getImages = async () => {
            if (game) {
                try {
                    const acquiredImages = await findGameImagesByGame(game._id);
                    if (acquiredImages) {
                        const existingPreviews = acquiredImages.map((image) => ({key: image._id, value: `${image.image}`}));
                        console.log(existingPreviews);
                        setExistingImagePreviews(existingPreviews);
                    }
                } catch (error) {
                    console.error("Error fetching images:", error);
                }
            }
        };
        getImages();
    }, [game]);

    // Sync visibility prop with local state
    useEffect(() => {
        console.log("Visibility Prop:", editGameVisibilityProp);
        setVisibility(editGameVisibilityProp);
    }, [editGameVisibilityProp]);
    

    // Handle editing the game
    const editGame = async (e) => {
        e.preventDefault();
        const date = new Date();

        try {
            const patchedGame = await patchGame(name, description, price, date, seller, gameId);
            if (patchedGame) {
                for (const image of images) {
                    const uploadedImage = await uploadToAWS(image);
                    await postGameImage(uploadedImage, patchedGame._id);
                }
                setEditGameVisibilityProp(false);
                navigate(`/GameView/${gameId}`, { replace: true });
                window.location.reload();
            } else {
                setIsVisible(true);
                console.error("Failed to patch game.");
            }
        } catch (error) {
            console.error("Error editing game:", error);
        }
    };

    // Close the modal when clicking outside of it
    const hideModal = (e) => {
        if (e.target.classList.contains("NewGameBackground")) {
            setEditGameVisibilityProp(false);
        }
    };

    if (!visibility) {
        return null; // Do not render if not visible
    }

    function autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto'; // Reset height to auto to recalculate
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }

    const handleDeleteGameImage = (newImage, gameImage) => {
        console.log("clicked");
        setDeleteGameImageVisibility(true);
        setImageToDelete({ newImage, gameImage });
        setDeleteGameImageVisibility(true); // Show the modal
        console.log(deleteGameImageVisibility);
    }

    return ReactDOM.createPortal(<>
        {deleteGameImageVisibility && (
            <DeleteGameImage
                gameImage={imageToDelete.gameImage}
                imageList={imageToDelete.newImage ? images : []}
                setImageList={imageToDelete.newImage ? setImages : null}
                previewList={imageToDelete.newImage ? newImagePreviews : existingImagePreviews}
                setPreviewList={imageToDelete.newImage ? setNewImagePreviews : setExistingImagePreviews}
                newImage={imageToDelete.newImage}
                modalVisibility={deleteGameImageVisibility}
                setModalVisibility={setDeleteGameImageVisibility}
            />
        )}
        
        <div className="NewGame">
            <div className="NewGameBackground" onClick={hideModal}></div>
            <CSSTransition
                in={visibility}
                nodeRef={nodeRef}
                timeout={300}
                classNames="newgamemodal"
                unmountOnExit
            >
                <div className="NewGameModal" ref={nodeRef}>
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
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files.length > 0) {
                                        setImages([...images, files[0]]);
                                        setNewImagePreviews((prev) => [...prev, ({key: files[0] ,value: URL.createObjectURL(files[0])})]);
                                    }
                                }}
                            />
                            <button type="submit">Edit Game</button>
                            {isVisible && <p style={{ color: "red" }}>Invalid Game</p>}
                            <div className="previews">
                                {existingImagePreviews.map((gameImage, index) => (
                                    <img key={index} className="preview" onClick={() => handleDeleteGameImage(false, gameImage)} src={gameImage.value} alt={`Preview ${index}`} />
                                ))}
                                {newImagePreviews.map((gameImage, index) => (
                                    <img key={index} className="preview" onClick={() => handleDeleteGameImage(true, gameImage)} src={gameImage.value} alt={`Preview ${index}`} />
                                ))}
                            </div>
                        </form>
                    </div>
                </div>
            </CSSTransition>
        </div>
        </>, document.getElementById("EditGame")
    );
}

export default EditGame;
