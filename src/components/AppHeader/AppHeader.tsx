import React, {useState, useEffect} from 'react'
import './AppHeader.scss'
import { Link } from 'react-router-dom'

type Props = {

}

const AppHeader: React.FC<Props> = (props) => {
    const [state, setState] = useState()


    return (
        <div className={"app-header-wrap"}>
            <div className="container">
                <Link to={'/'}>
                    <img src="" alt="logo" title={'logo'}/>
                </Link>
            </div>
        </div>
    )
}

export default AppHeader
