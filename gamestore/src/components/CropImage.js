import React, { useState, useRef } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
  convertToPixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

  function CropImage({ image, visibility }) {
    const [percentCrop, setPercentCrop] = useState({
        unit: '%', 
        x: 25,
        y: 25,
        width: 50,
        height: 50
      })

    return (
        visibility ?
        <div className="CropContainer">
            <ReactCrop aspect={1} minWidth={50} minHeight={50} onChange={(percentCrop) => setPercentCrop(percentCrop)} crop={percentCrop}>
                <img src={image} />
            </ReactCrop>
        </div> : <></>
    )
  }
  
  export default CropImage;