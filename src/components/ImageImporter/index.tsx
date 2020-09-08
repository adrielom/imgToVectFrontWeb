import React, { useState } from 'react';
import './index.scss'
import { FaPlusCircle } from 'react-icons/fa'

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
                <img src={imageSource} className="previewImage" alt={'previewImage'} />
            )
        }
    }

    return (
        <div id="imageImporterSection">
            {RenderPreviewImage()}
            {
                imageSource === '' ?
                    (
                        <label htmlFor="imageSource"> <FaPlusCircle className="iconImage" /> </label>
                    ) :
                    (
                        <label htmlFor="imageSource"> <FaPlusCircle className="iconImage opacity02" /> </label>
                    )
            }
            <input id="imageSource" alt='imgage source' type='file' onChange={ImageChange} />
        </div>
    );
}

export default ImageImporter;