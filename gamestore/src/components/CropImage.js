import React, { useState, useEffect } from 'react';
import ReactCrop, { convertToPixelCrop } from 'react-image-crop';
import ReactDOM from 'react-dom';
import 'react-image-crop/dist/ReactCrop.css';
import "./CropImage.css"

function CropImage({ file, setVisibility, visibility, setFile }) {
  const [image, setImage] = useState(null);
  const [original, setOriginal] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [percentCrop, setPercentCrop] = useState({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });

  useEffect(() => {
    if (file) {
      setImage(URL.createObjectURL(file));
      console.log('File was sent in');
    }
  }, [file]);

  useEffect(() => {
    if (!original) {
      setOriginal(image)
    }
  }, [image]);

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          resolve(croppedFile);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    });
  };

  const buttonHandler = async () => {
    if (!imageRef) {
      console.error('Image reference not set!');
      return;
    }
    const pixelCrop = convertToPixelCrop(percentCrop, imageRef.width, imageRef.height);
    const croppedImage = await getCroppedImg(imageRef, pixelCrop);
    setFile(croppedImage);
    setVisibility(false);
  };

  const hideCropper = (e) => { 
    if (visibility === true) {
        if (e.target.classList.contains('cropImageBackground')) {
            setVisibility(false);
        }
    }
}

  return ReactDOM.createPortal(
    visibility && image ? (
      <>
        <div className='cropImageBackground' onClick={(e) => hideCropper(e)}></div>
        <div className="CropContainer">
          <ReactCrop
            className='imageCropper'
            aspect={1}
            minWidth={50}
            minHeight={50}
            onChange={(newCrop) => setPercentCrop(newCrop)}
            crop={percentCrop}
          >
            <img
              src={image}
              onLoad={(e) => setImageRef(e.target)}
              alt="Crop"
            />
          </ReactCrop>
          <div className="finishCrop">
            <button onClick={buttonHandler}>Done</button>
          </div>
        </div>
      </>
    ) : null, // Render null instead of <></>
    document.getElementById('CropContainer') // Second argument
  );  
}

export default CropImage;
