import React, { useState, useRef, useEffect } from 'react';
import './index.scss'
import { FaPlusCircle } from 'react-icons/fa'
import { SiConvertio } from 'react-icons/si'
import { BiVector } from 'react-icons/bi'
import Slider from 'react-input-slider';
import { secondaryColor, lightGreyColor } from '../../utils/Colors'
import axios from 'axios'

const url = "https://image-to-vector.herokuapp.com/"


function ImageImporter() {
    const [imageSource, setImageSource] = useState('')
    const [slider, setSlider] = useState({ x: 72 });
    const [typeValue, setTypeValue] = useState(0)
    const [svg, setSvg] = useState('')
    const [servedImageName, setServedImageName] = useState('')
    const [imgName, setImgName] = useState('')
    const [imgServedName, setImgServedName] = useState('')


    useEffect(() => {
        setTimeout(() => {
            setImageSource('')
            setSvg('')
            setImgName('')
            setServedImageName('')
        }, 840000);
    }, [imageSource])

    let img: any = {}

    const buttonRef = useRef<HTMLButtonElement>(null)

    const fetchSVGImage = (name: string, type: number, threshold: number) => {
        if (type === 0) {
            //https://image-to-vector.herokuapp.com/tracing?id=1&name=952bbab97d987d92891db98a8b6ec722&color=black&threshold=110
            axios.get(url + `tracing?id=${name}&name=${name}&color=black&threshold=${threshold}`).then(res => {

                let blob = new Blob([res.data], { type: 'image/svg+xml' });
                let url = URL.createObjectURL(blob);

                setSvg(url)
            })
        } else {
            // http://localhost:8080/posterize?name=5bc7e25e5891c315b5440930a31f7602&threshold=180&steps=5
            axios.get(url + `posterize?name=${name}&threshold=${threshold}&steps=${type}`).then(res => {

                let blob = new Blob([res.data], { type: 'image/svg+xml' });
                let url = URL.createObjectURL(blob);

                setSvg(url)
            })
        }
    }

    function downloadSVG() {
        const element = document.createElement("a");
        console.log(imgServedName)
        element.download = imgServedName.split('.')[0];
        console.log(svg)
        element.href = svg;
        element.click();
        element.remove();
        buttonRef.current?.blur()
    }

    function SliderToRequest(sliderValue: number) {
        return Math.floor(sliderValue * 2.55)
    }

    const serveImage = (file: any) => {
        const formData = new FormData();
        formData.append('name', file)

        return axios.post(url + 'imgToVector', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            img = res.data
            setImgName(res.data.name)
            setImgServedName(res.data.originalName)
            setServedImageName(img.name)
            fetchSVGImage(img.name, typeValue, SliderToRequest(slider.x))
        }).catch(err => {
            console.log(err)
        })
    }

    const ImageChange = (e: any) => {
        setImageSource('')
        setSvg('')
        setImgName('')
        setImgServedName('')
        setServedImageName('')
        setImageSource(URL.createObjectURL(e.target.files[0]))
        serveImage(e.target.files[0])
    }

    const RenderOptionSection = () => {
        if (imageSource !== '') {
            return (
                <div className="optionsSection">
                    <div id="sliderContainer">
                        <label>Nível de detalhe: {slider.x} % </label>
                        <Slider
                            axis="x"
                            x={slider.x}
                            styles={{
                                track: {
                                    backgroundColor: lightGreyColor,
                                    width: "100%"
                                },
                                active: {
                                    backgroundColor: secondaryColor
                                },
                                thumb: {
                                    width: 10,
                                    height: 10
                                },
                                disabled: {
                                    opacity: 0.5
                                },

                            }}
                            onChange={({ x }) => {
                                setSlider(state => ({ ...state, x }))
                            }}
                            onDragEnd={() => {
                                setSvg('')
                                console.log('drag ended')
                                if (imageSource !== '' && servedImageName !== '')
                                    fetchSVGImage(servedImageName, typeValue, SliderToRequest(slider.x))
                            }}
                        />
                    </div>
                    <div className="detailContainer">
                        <label>Tipo de detalhe:  </label>

                        <select onChange={(e) => {
                            setSvg('')
                            setTypeValue(e.target.selectedIndex)
                            fetchSVGImage(servedImageName, typeValue, SliderToRequest(slider.x))
                        }} id="detailLevel">
                            <option value="1">Traço</option>
                            <option value="2">Baixa</option>
                            <option value="3">Média</option>
                            <option value="4">Alta</option>
                            <option value="5">Muito Alta</option>
                        </select>

                    </div>
                    <div className="buttonsSection">
                        <button ref={buttonRef} onClick={() => downloadSVG()}>
                            Download
                            <BiVector className="svgIcon" />
                        </button>
                    </div>
                </div >
            )
        }
    }

    const RenderPreviewImage = () => {
        if (imageSource !== '') {
            return (
                <div className="renderPreviewContainer">
                    <div className="imageCenterContainer">
                        <label htmlFor="imageSource"> <FaPlusCircle className="iconImage opacity04" /> </label>
                        <img src={imageSource} className="previewImage" alt={'previewImage'} />
                    </div>
                    <div>
                        <SiConvertio id="convertIcon" className="iconImageSmall" />
                    </div>
                    <div className="imageCenterContainer">
                        {
                            svg === '' || imageSource === '' ? 'carregando...' : <img src={svg} className="previewImage" alt={'previewImage'} />
                        }
                    </div>
                </div>
            )
        } else {
            return (
                <label htmlFor="imageSource"> <FaPlusCircle className="iconImage iconImageDeselected" /> </label>
            )
        }
    }

    return (
        <>
            <div className="card">
                {imageSource === '' ? <h1 className="title">Selecione uma imagem</h1> : ''}
                <div id="imageImporterSection" className={imageSource === '' ? 'height75vh' : ''}>
                    {RenderPreviewImage()}

                    <input id="imageSource" accept=".png, .jpg, .jpeg" alt='imgage source' type='file' onChange={ImageChange} />
                </div>
                {RenderOptionSection()}
            </div>
        </>
    );
}

export default ImageImporter;