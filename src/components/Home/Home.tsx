import React from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'

type Props = {}

const Home: React.FC<Props> = (props) => {
  return (
    <div className={'home-wrap'}>
      <div className="say-hi">
        <div>
          This is home page. Not too much to see here, but give it a try.
        </div>
        <Link to={'images'} className={'btn'}>
          Search for images
        </Link>
      </div>
    </div>
  )
}

export default Home
