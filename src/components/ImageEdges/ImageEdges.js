import React, { useState, useEffect, useRef, MutableRefObject } from 'react'
import { useParams } from 'react-router-dom'
import { CONSTRUCT_BASE_URL, getImage } from '../../api/flickr'
import { OpenCvProvider } from 'opencv-react'
import {useHistory } from 'react-router-dom'
import './imgeEdges.scss'

const ImageEdges = (props) => {
  const [cv, setCv] = useState()
  const [imageInfo, setImageInfo] = useState()
  const [imgUrl, setImgUrl] = useState('')
  const [size, setSize] = useState([0,0])

  const { id, secret } = useParams()

  const canvasRef = useRef(null)
  const canvasOutput = useRef(null)
  const originalImg = useRef(null)

  const history = useHistory()

  useEffect(() => {
    getImage(id, secret).then((res) => {
      const imageInfo = res.data.photo
      setImageInfo(imageInfo)
      setImgUrl(`${CONSTRUCT_BASE_URL}${imageInfo?.server}/${imageInfo?.id}_${imageInfo?.secret}.jpg`)
    })
  }, [id, secret])

  useEffect(() => {
    if (canvasRef.current) {
      setSize([originalImg.current.naturalWidth, originalImg.current.naturalHeight])
      if (cv) {
        const canvas = canvasRef.current
        const canvasout = canvasOutput.current
        // @ts-ignore
        const ctxOutput = canvas.getContext('2d')
        const base_image = new Image()
        base_image.src = `${CONSTRUCT_BASE_URL}${imageInfo?.server}/${imageInfo?.id}_${imageInfo?.secret}.jpg`
        base_image.crossOrigin = "Anonymous";
        base_image.setAttribute('crossOrigin', '')
        base_image.onload = function(){
          ctxOutput.drawImage(base_image, 0, 0)
          const src = cv.imread(canvas.id)
          const dst = new cv.Mat()
          cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0)
          // You can try more different parameters
          cv.Canny(src, dst, 50, 100, 3, false)
          cv.imshow(canvasout.id, dst)
          // ctxOutput.drawImage(dst)
          src.delete()
          dst.delete()
        }

      }
    }
  }, [imageInfo, cv])

  const onLoaded = (cvLibrary) => {
    setTimeout(function () {;
      setCv(window.cv)
    }, 500);
  }


  return (
    <OpenCvProvider
      onLoad={onLoaded}
      openCvPath={'/libraries/opencv.js'}
    >
      <div className={'image-edges-wrap'}>
          <h3><a onClick={() => history.goBack()} className={'go-back'}> Back to search results</a></h3>
          <div className="image-card">
              <img src={imgUrl} id="cvImage" ref={originalImg} />
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
            <canvas ref={canvasRef} id={'thecanvasId'} width={size[0]} height={size[1]} style={{display: "none"}}/>
            <canvas ref={canvasOutput} id={'thecanvasOutId'} width={size[0]} height={size[1]}/>
          </div>
        </div>
      </div>
    </OpenCvProvider>
  )
}

export default ImageEdges
