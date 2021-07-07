import React, {useState, useEffect, useRef, MutableRefObject} from 'react'
import {useParams} from 'react-router-dom'
import {CONSTRUCT_BASE_URL, getImage} from "../../api/flickr";



const ImageEdge = (props) => {
    const [imageInfo, setImageInfo] = useState()
    const {id, secret} = useParams()
    const canvasRef = useRef(null)
    const canvasOutput = useRef(null)


    useEffect(() => {
        getImage(id, secret).then((res) => {
            setImageInfo(res.data.photo)
        })

        if(canvasRef.current){
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')

            let base_image = new Image();
            base_image.src = `${CONSTRUCT_BASE_URL}${imageInfo?.server}/${imageInfo?.id}_${imageInfo?.secret}.jpg`;
            base_image.onload = function(){
                ctx.drawImage(base_image, 0, 0)
            }


            const canvasoutput = canvasOutput.current
            const ctxOutput = canvasoutput.getContext('2d')
            let src = cv.imread(base_image);
            let dst = new cv.Mat();
            cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
            // You can try more different parameters
            cv.Canny(src, dst, 50, 100, 3, false);
            cv.imshow('canvasOutput', dst);
            ctxOutput.drawImage(dst)
            src.delete(); dst.delete();
        }

    }, [])

    const imgUrl = `${CONSTRUCT_BASE_URL}${imageInfo?.server}/${imageInfo?.id}_${imageInfo?.secret}.jpg`

    return (
        <div className={"image-edges-wrap"}>
            <img src={imgUrl}/>
            <div>
                <div className="inputoutput">
                    <canvas ref={canvasRef} />
                    <canvas ref={canvasOutput} />
                </div>
            </div>
        </div>
    )
}

export default ImageEdge
