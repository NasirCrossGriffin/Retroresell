import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import "./NewGame.css"
import { postGame, uploadGameImage, postGameImage, uploadToAWS, checkSession, findUser } from "./middleware";

function NewGame({ id, newGameVisibilityProp, setNewGameVisibilityProp }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});

        useEffect(() => {
            async function checkLoggedIn() {
                const session = await checkSession();
    
                if (!session) {
                    setLoggedIn(false)
                    return;
                }
    
                setLoggedIn(session.loggedIn);
    
                if (session.loggedIn && session.userID) {
                    const retrievedUser = await findUser(session.userID);
                    console.log(retrievedUser)
                    setUser(retrievedUser);
                }
            }
    
            checkLoggedIn();
        }, []);


    const createNewGame = async (e) => {
        e.preventDefault(); // Prevent form submission reload
        const date = new Date();
        const seller = user._id;
        console.log(seller);

        const newGame = await postGame(name, description, price, date, seller);
        if (newGame) {
            console.log(images)
            for (const image of images) {
                console.log(image);
                const uploadedImage = await uploadToAWS(image);
                console.log(newGame._id);
                const response = await postGameImage(uploadedImage, newGame._id);
                if (!response.ok) {
                    console.error("Failed to upload game image.");
                }
            }
            setNewGameVisibilityProp(false);
            window.location.reload();
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
                                    }
                                }}
                            />
                            <button type="submit">Create Game</button>
                            {isVisible && <p style={{ color: "red" }}>Invalid Game</p>}
                            <div className="previews">
                                {images.map((image, index) => (
                                    <img
                                        key={index}
                                        className="preview"
                                        src={URL.createObjectURL(image)} // Create a local URL for the image file
                                        alt={`preview-${index}`}
                                    />
                                ))}
                            </div>

                            
                        </form>
                    </div>
                </div>
            </div>
        </div>, document.getElementById('NewGame') // Ensure this element exists in the HTML
    );
}

export default NewGame;
