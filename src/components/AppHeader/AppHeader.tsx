import React from 'react'
import './AppHeader.scss'
import { Link } from 'react-router-dom'
import logo from '../../flickr_logo_dots.svg'

type Props = {

}

const AppHeader: React.FC<Props> = (props) => {
    return (
        <div className={"app-header-wrap"}>
            <div className="container">
                <Link to={'/'}>
                    <img src={logo} alt="logo" title={'logo'}/>
                </Link>
            </div>
        </div>
    )
}

export default AppHeader
