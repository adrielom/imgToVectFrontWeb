import React, { useState } from 'react';
import './index.scss'
import { FaPlusCircle, FaImage } from 'react-icons/fa'
import { SiConvertio } from 'react-icons/si'

// import { Container } from './styles';

function ImageImporter() {
    const [imageSource, setImageSource] = useState('')

    const ImageChange = (e: any) => {
        setImageSource(URL.createObjectURL(e.target.files[0]))
        console.log(imageSource)
    }

    const RenderPreviewImage = () => {
        console.log(imageSource)
        if (imageSource !== '') {
            return (
                <div className="renderPreviewContainer">
                    <div className="imageCenterContainer">
                        <label htmlFor="imageSource"> <FaPlusCircle className="iconImage opacity04" /> </label>
                        <img src={imageSource} className="previewImage" alt={'previewImage'} />
                    </div>
                    <div>
                        <SiConvertio className="iconImage" />
                    </div>
                    <div>

                        <FaImage className="iconImage" />
                    </div>
                </div>
            )
        } else {
            return (
                <label htmlFor="imageSource"> <FaPlusCircle className="iconImage" /> </label>
            )
        }
    }

    return (
        <div id="imageImporterSection">
            {RenderPreviewImage()}
            <input id="imageSource" accept="image/*" alt='imgage source' type='file' onChange={ImageChange} />
        </div >
    );
}

export default ImageImporter;