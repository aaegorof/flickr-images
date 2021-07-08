import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getImage } from '../../api/flickr'
import { CONSTRUCT_BASE_URL } from '../../constants'
import { useHistory } from 'react-router-dom'
import './imgeEdges.scss'
import Switch from '../Switch/Switch'

const ImageEdges = ({ cv }) => {
  const [imageInfo, setImageInfo] = useState(null)
  const [imgUrl, setImgUrl] = useState('')
  const [size, setSize] = useState([0, 0])
  const [isEdge, toggleEdge] = useState(true)

  const { id, secret } = useParams()

  const canvasRef = useRef(null)
  const canvasOutput = useRef(null)
  const originalImg = useRef(null)

  const history = useHistory()

  useEffect(() => {
    if (id) {
      getImage(id, secret).then((res) => {
        const imageInfo = res.data.photo
        setImageInfo(imageInfo)
        const URL = `${CONSTRUCT_BASE_URL}${imageInfo?.server}/${imageInfo?.id}_${imageInfo?.secret}.jpg`
        setImgUrl(URL)
        const img = new Image()
        img.src = URL
        img.onload = function () {
          setSize([this.width, this.height])
        }
      })
    }
  }, [id, secret])

  useEffect(() => {
    if (canvasRef.current) {
      if (cv && imageInfo && imgUrl && size[0]) {
        const canvas = canvasRef.current
        const canvasout = canvasOutput.current
        // @ts-ignore
        const ctxOutput = canvas.getContext('2d')
        const base_image = new Image()
        base_image.src = imgUrl
        base_image.crossOrigin = 'Anonymous'
        base_image.setAttribute('crossOrigin', '')
        base_image.onload = function () {
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
  }, [imageInfo, cv, imgUrl, size])

  return (
    <div className={'image-edges-wrap'}>
      <h3>
        <a onClick={() => history.goBack()} className={'go-back'}>
          {' '}
          Back to search results
        </a>
      </h3>
      <div className="image-card">
        <div className="img-wrap">
          <img src={imgUrl} id="cvImage" ref={originalImg} />
          <canvas
            ref={canvasRef}
            id={'thecanvasId'}
            width={size[0]}
            height={size[1]}
            style={{ display: 'none' }}
          />
          <canvas
            ref={canvasOutput}
            id={'thecanvasOutId'}
            width={size[0]}
            height={size[1]}
            style={{ display: isEdge ? 'initial' : 'none' }}
          />
        </div>
        {imageInfo && (
          <div className="photo-info">
            <p>
              <strong>Title: </strong> {imageInfo.title._content}
            </p>
            <p>
              <strong>Posted date: </strong>
              {new Date(imageInfo.dates.posted * 1000).toLocaleString()}
            </p>
            <p>
              <strong>Owner: </strong>
              {imageInfo.owner.username}
            </p>

            <p style={{ marginTop: 50 }}>
              You can switch the edge detection
              <Switch
                left={'On'}
                right={'Off'}
                onChange={(val) => toggleEdge((old) => !old)}
              />
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="inputoutput"></div>
      </div>
    </div>
  )
}

export default ImageEdges
