import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { findUser, findGame, findGameImage, postUser, 
    authenticate, uploadProfileImage, changeProfileImage, findGamesByUser,
    findGameImagesByGame, uploadGameImage, postGame, postGameImage, checkSession } from "./middleware"

function NewGame({ id, newGameVisibilityProp, setNewGameVisibilityProp }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    const createNewGame = async (e) => {
        e.preventDefault(); // Prevent form submission reload
        const date = new Date();
        const seller = id.id;
        console.log(seller);

        const newGame = await postGame(name, description, price, date, seller);
        if (newGame) {
            for (const image of images) {
                console.log(image);
                const uploadedImage = await uploadGameImage(image);
                console.log(newGame._id)
                const response = await postGameImage(uploadedImage, newGame._id);
                if (!response.ok) {
                    console.error("Failed to upload game image.");
                }
            }
            setNewGameVisibilityProp(false);
        } else {
            setIsVisible(true);
            console.error("Game creation failed.");
        }
    };

    const hideModal = (e) => {
        if (e.target.classList.contains('NewGameBackground')) {
            setNewGameVisibilityProp(false);
        }
    };

    function autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto'; // Reset height to auto to recalculate
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }

    // Conditionally render the modal
    if (!newGameVisibilityProp) {
        return null; // Return nothing if the modal should not be visible
    }

    return ReactDOM.createPortal(
        <div className="NewGame">
            <div className="NewGameBackground" onClick={hideModal}>
                <div className="NewGameModal">
                    <div className="NewGameContainer">
                        <form className="gameForm" onSubmit={createNewGame}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="description">Description</label>
                            <input
                                type="textarea"
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
                                onChange={(e) => setImages([...images, e.target.files[0]])}
                            />
                            <button type="submit">Create Game</button>
                            {isVisible && <p style={{ color: "red" }}>Invalid Game</p>}
                            <ul>
                            {images.map((image, index) => (
                                <li key={index}>{image.name}</li>
                            ))}
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        </div>, document.getElementById('NewGame') // Ensure this element exists in the HTML
    );
}

export default NewGame;
