import { QueryClient, QueryClientProvider } from 'react-query'
import ImageList from './components/ImageList/ImageList'
import AppHeader from './components/AppHeader/AppHeader'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import ImageEdges from './components/ImageEdges/ImageEdges'

import './styles/common.scss'
import { OpenCvProvider } from 'opencv-react'
import React, { useState } from 'react'
import Home from "./components/Home/Home";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
})

function App() {
  const [cv, setCv] = useState(null)
  const onLoaded = (cvLibrary) => {
    setTimeout(function () {
      setCv(window.cv)
    }, 500)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <OpenCvProvider onLoad={onLoaded} openCvPath={'/libraries/opencv.js'}>
        <Router>
          <AppHeader />
          <div className="container">
            <Switch>
              <Route
                path="/"
                exact
                children={<Home/>}
              />
              <Route path="/images" children={<ImageList />} />
              <Route path="/edge/:id" exact children={<ImageEdges cv={cv} />} />
            </Switch>
          </div>
        </Router>
      </OpenCvProvider>
    </QueryClientProvider>
  )
}

export default App
