import React from 'react'
import './AppHeader.scss'
import { Link } from 'react-router-dom'
import logo from '../../flickr_logo_dots.svg'
import { AUTHOR_LINK, AUTHOR_NAME } from '../../constants'

type Props = {}

const AppHeader: React.FC<Props> = (props) => {
  return (
    <div className={'app-header-wrap'}>
      <div className="container">
        <Link to={'/'}>
          <img src={logo} className={'logo'} alt="logo" title={'logo'} />
        </Link>
        <a href={AUTHOR_LINK} target={'_blank'} rel="noreferrer" className="author">
          Made by {AUTHOR_NAME}
        </a>
      </div>
    </div>
  )
}

export default AppHeader
