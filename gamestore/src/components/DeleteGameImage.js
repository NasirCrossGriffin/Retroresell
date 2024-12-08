import React, { useState, useEffect, useRef } from "react";
import { patchGame, uploadGameImage, postGameImage, findGame, findGameImagesByGame, deleteGameImage, uploadToAWS } from "./middleware";
import ReactDOM from "react-dom";
import "./DeleteGameImage.css"

function DeleteGameImage ({ gameImage, imageList, setImageList, previewList, setPreviewList, newImage, modalVisibility, setModalVisibility }) {
    const [image, setImage] = useState(null)

    useEffect(() => {
        console.log(gameImage)
        console.log(gameImage.value)
        setImage(gameImage.value)
        console.log(image)
    }, [gameImage])
    
    const handler = async () => {
        if (newImage === false) {
            console.log(gameImage.key)
            await deleteGameImage(gameImage.key);
            const newPreviewList = previewList.filter((image) => (image.key !== gameImage.key));
            console.log(newPreviewList)
            setPreviewList(newPreviewList);
            hideModal();
        } else {
            console.log(gameImage.key)
            const newImageList = imageList.filter((image) => (image !== gameImage.key));
            console.log(newImageList)
            setImageList(newImageList)
            const newPreviewList = previewList.filter((image) => (image.key !== gameImage.key));
            console.log(newPreviewList)
            setPreviewList(newPreviewList)
            hideModal();
        }
    }

    const hideModal = () => {
        setModalVisibility(false);
    }

    if (modalVisibility === false) {
        return null;
    }


    return ReactDOM.createPortal (    
        <>
            <div className="DeleteGameImageBackground"></div>
            <div className="DeleteGameImageModal">
                <p className="DeleteGameImagePrompt">Do you want to delete this game image</p>
                <div className="DeleteGameImagePreviewContainer">
                    <img className="DeleteGameImagePreview" src={image} alt={"preview"} />
                </div>
                <div className="DeleteGameImageButtonContainer">
                    <button onClick={handler} className="DeleteGameImageButton">Yes</button>
                    <button onClick={hideModal} className="DeleteGameImageButton">No</button>
                </div>
            </div>
        </>, document.getElementById("DeleteGameImage")
     )
}

export default DeleteGameImage;