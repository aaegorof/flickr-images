import React, { useState, useEffect, useRef, MutableRefObject } from 'react'
import { useParams } from 'react-router-dom'
import { CONSTRUCT_BASE_URL, getImage } from '../../api/flickr'
import { useOpenCv } from 'opencv-react'
import {useHistory } from 'react-router-dom'
import './imgeEdges.scss'

const ImageEdges = (props) => {
  const [imageInfo, setImageInfo] = useState()
  const { id, secret } = useParams()
  const canvasRef = useRef(null)
  // const canvasOutput = useRef(null) as MutableRefObject<any>

    const history = useHistory()
  const { loaded, cv } = useOpenCv()

  useEffect(() => {
    getImage(id, secret).then((res) => {
      setImageInfo(res.data.photo)
    })
  }, [])

  useEffect(() => {
    if (canvasRef.current && loaded) {
      // const canvas = canvasRef.current
      // const ctx = canvas.getContext('2d')
      //
      // let base_image = new Image();
      // console.log('imageInfo',imageInfo)
      // base_image.src = `${CONSTRUCT_BASE_URL}${imageInfo?.server}/${imageInfo?.id}_${imageInfo?.secret}.jpg`;
      // base_image.onload = function(){
      //     ctx.drawImage(base_image, 0, 0)
      // }
      console.log(loaded, cv)
      if (cv) {
        const canvas = canvasRef.current
        // @ts-ignore
        const ctxOutput = canvas.getContext('2d')
        let base_image = new Image()
        base_image.src = `${CONSTRUCT_BASE_URL}${imageInfo?.server}/${imageInfo?.id}_${imageInfo?.secret}.jpg`
        let src = cv.imread(base_image)
        let dst = new cv.Mat()
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0)
        // You can try more different parameters
        cv.Canny(base_image, dst, 50, 100, 3, false)
        cv.imshow('canvasOutput', dst)
        console.log(src, dst)
        ctxOutput.drawImage(dst)
        src.delete()
        dst.delete()
      }
    }
  }, [loaded, imageInfo])

  const imgUrl = `${CONSTRUCT_BASE_URL}${imageInfo?.server}/${imageInfo?.id}_${imageInfo?.secret}.jpg`

  return (
    <div className={'image-edges-wrap'}>
        <h3><a onClick={() => history.goBack()} className={'go-back'}> Back to search results</a></h3>
        <div className="image-card">
            <img src={imgUrl} />
            {imageInfo && (
                <div className="photo-info">
                    <p>Title: {imageInfo.title._content}</p>
                    <p>Posted date: {new Date(imageInfo.dates.posted * 1000).toLocaleString()}</p>
                    <p>Owner: {imageInfo.owner.username}</p>
                </div>
            )}
        </div>

      <div>
        <div className="inputoutput">
          <canvas ref={canvasRef} />
          {/*<canvas ref={canvasOutput} />*/}
        </div>
      </div>
    </div>
  )
}

export default ImageEdges
