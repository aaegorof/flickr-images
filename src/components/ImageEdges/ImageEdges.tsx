import React, {useState, useEffect, useRef, MutableRefObject} from 'react'
import {useParams} from 'react-router-dom'
import {CONSTRUCT_BASE_URL, getImage} from "../../api/flickr";


interface Urls {
    url: Array<{type: string, _content: string}>
}
interface Tags {
    tag: string[]
}
interface Dates {
    posted: string
    taken: string
    takengranularity: number
    takenunknown: string
    lastupdate: string
}

interface ImageInfo {
    id: string
    secret: string
    server: string
    farm: number
    dateuploaded: string
    isfavorite: number
    license: string
    safety_level: string
    rotation: number
    originalsecret: string
    originalformat: string
    title: {
        _content: string
    }
    description: {
        _content: string
    }
    urls: Urls
    tags: Tags
    date: Dates
}
type Props = {

}

const ImageEdges: React.FC<Props> = (props) => {
    const [imageInfo, setImageInfo] = useState<ImageInfo>()
    const {id, secret} = useParams<{id: string, secret: string}>()
    const canvasRef = useRef(null) as MutableRefObject<any>
    const canvasOutput = useRef(null) as MutableRefObject<any>


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
                    <img id="imageSrc" alt="No Image"/>
                    <div className="caption">imageSrc <input type="file" id="fileInput" name="file"/></div>
                </div>

                <div className="inputoutput">
                    <canvas ref={canvasRef} />
                    <canvas ref={canvasOutput} />
                    <div className="caption">canvasOutput</div>
                </div>
            </div>
        </div>
    )
}

export default ImageEdges
